import { storage } from './storage';
import type { SyncRun, ProductSyncLog } from '@shared/schema';

export interface SyncReportSummary {
  runId: string;
  status: string;
  startedAt: Date;
  completedAt: Date | null;
  durationMinutes: number;
  totalProducts: number;
  processed: number;
  succeeded: number;
  failed: number;
  skipped: number;
  successRate: number;
  brandBreakdown: Record<string, { total: number; succeeded: number; failed: number }>;
  failedProducts: Array<{ name: string; brand: string; error: string }>;
  requiresManualReview: boolean;
  config: Record<string, unknown>;
}

type DateInput = Date | string | null | undefined;

export interface AlertInfo {
  level: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  details: Record<string, unknown>;
}

function normalizeDate(date: DateInput): Date | null {
  if (!date) return null;
  if (date instanceof Date) return date;
  return new Date(date);
}

export async function generateSyncReport(runId: string): Promise<SyncReportSummary | null> {
  const run = await storage.getSyncRun(runId);
  if (!run) return null;

  const logs = await storage.getSyncRunLogs(runId);
  
  const startedAt = normalizeDate(run.startedAt) || new Date();
  const completedAt = normalizeDate(run.completedAt);
  
  const brandBreakdown: Record<string, { total: number; succeeded: number; failed: number }> = {};
  const failedProducts: Array<{ name: string; brand: string; error: string }> = [];

  for (const log of logs) {
    const brand = log.brand || 'Unknown';
    
    if (!brandBreakdown[brand]) {
      brandBreakdown[brand] = { total: 0, succeeded: 0, failed: 0 };
    }
    
    if (log.phase === 'sync') {
      brandBreakdown[brand].total++;
      if (log.status === 'success') {
        brandBreakdown[brand].succeeded++;
      } else if (log.status === 'failed') {
        brandBreakdown[brand].failed++;
        failedProducts.push({
          name: log.productName || 'Unknown Product',
          brand,
          error: log.errorMessage || 'Unknown error'
        });
      }
    }
  }

  const durationMs = run.durationMs || 0;
  const processed = run.processed || 0;
  const succeeded = run.succeeded || 0;
  const failed = run.failed || 0;
  const skipped = run.skipped || 0;
  const successRate = processed > 0 ? (succeeded / processed) * 100 : 0;
  const requiresManualReview = failed > 0 || successRate < 80;

  return {
    runId: run.id,
    status: run.status || 'unknown',
    startedAt,
    completedAt,
    durationMinutes: Math.round(durationMs / 60000 * 10) / 10,
    totalProducts: run.totalProducts || 0,
    processed,
    succeeded,
    failed,
    skipped,
    successRate: Math.round(successRate * 10) / 10,
    brandBreakdown,
    failedProducts: failedProducts.slice(0, 50),
    requiresManualReview,
    config: run.config as Record<string, unknown> || {}
  };
}

export async function getRecentSyncReports(limit: number = 10): Promise<SyncReportSummary[]> {
  const runs = await storage.getRecentSyncRuns(limit);
  const reports: SyncReportSummary[] = [];

  for (const run of runs) {
    const report = await generateSyncReport(run.id);
    if (report) {
      reports.push(report);
    }
  }

  return reports;
}

export function generateAlerts(report: SyncReportSummary): AlertInfo[] {
  const alerts: AlertInfo[] = [];

  if (report.status === 'failed') {
    alerts.push({
      level: 'critical',
      title: 'Sync Run Failed',
      message: `Sync run ${report.runId} failed to complete`,
      details: { runId: report.runId, status: report.status }
    });
  }

  if (report.successRate < 50) {
    alerts.push({
      level: 'critical',
      title: 'Low Success Rate',
      message: `Only ${report.successRate}% of products synced successfully`,
      details: { successRate: report.successRate, failed: report.failed }
    });
  } else if (report.successRate < 80) {
    alerts.push({
      level: 'warning',
      title: 'Moderate Success Rate',
      message: `${report.successRate}% success rate - some products may need manual review`,
      details: { successRate: report.successRate, failed: report.failed }
    });
  }

  if (report.failed > 10) {
    alerts.push({
      level: 'warning',
      title: 'Multiple Products Failed',
      message: `${report.failed} products failed to sync`,
      details: { failed: report.failed, samples: report.failedProducts.slice(0, 5) }
    });
  }

  const brandFailures = Object.entries(report.brandBreakdown)
    .filter(([_, stats]) => stats.failed > stats.succeeded && stats.total > 2)
    .map(([brand, stats]) => ({ brand, ...stats }));

  if (brandFailures.length > 0) {
    alerts.push({
      level: 'warning',
      title: 'Brand-Specific Issues',
      message: `Some brands have high failure rates`,
      details: { brands: brandFailures }
    });
  }

  if (alerts.length === 0 && report.status === 'completed') {
    alerts.push({
      level: 'info',
      title: 'Sync Completed Successfully',
      message: `${report.succeeded} products synced with ${report.successRate}% success rate`,
      details: { succeeded: report.succeeded, duration: report.durationMinutes }
    });
  }

  return alerts;
}

export function formatReportAsText(report: SyncReportSummary): string {
  const lines: string[] = [
    '═══════════════════════════════════════════════════════════════',
    '                    PRODUCT SYNC REPORT',
    '═══════════════════════════════════════════════════════════════',
    '',
    `Run ID:        ${report.runId}`,
    `Status:        ${report.status.toUpperCase()}`,
    `Started:       ${report.startedAt.toISOString()}`,
    `Completed:     ${report.completedAt?.toISOString() || 'N/A'}`,
    `Duration:      ${report.durationMinutes} minutes`,
    '',
    '─────────────────────────────────────────────────────────────────',
    '                       SUMMARY',
    '─────────────────────────────────────────────────────────────────',
    '',
    `Total Products:    ${report.totalProducts}`,
    `Processed:         ${report.processed}`,
    `Succeeded:         ${report.succeeded}`,
    `Failed:            ${report.failed}`,
    `Skipped:           ${report.skipped}`,
    `Success Rate:      ${report.successRate}%`,
    '',
  ];

  if (Object.keys(report.brandBreakdown).length > 0) {
    lines.push('─────────────────────────────────────────────────────────────────');
    lines.push('                  BRAND BREAKDOWN');
    lines.push('─────────────────────────────────────────────────────────────────');
    lines.push('');
    lines.push('Brand                  Total   Success   Failed');
    lines.push('────────────────────────────────────────────────');

    for (const [brand, stats] of Object.entries(report.brandBreakdown).sort((a, b) => b[1].total - a[1].total)) {
      const brandPadded = brand.padEnd(20);
      const totalPadded = stats.total.toString().padStart(5);
      const successPadded = stats.succeeded.toString().padStart(7);
      const failedPadded = stats.failed.toString().padStart(8);
      lines.push(`${brandPadded} ${totalPadded}   ${successPadded}   ${failedPadded}`);
    }
    lines.push('');
  }

  if (report.failedProducts.length > 0) {
    lines.push('─────────────────────────────────────────────────────────────────');
    lines.push('             FAILED PRODUCTS (Manual Review Required)');
    lines.push('─────────────────────────────────────────────────────────────────');
    lines.push('');

    for (const product of report.failedProducts.slice(0, 20)) {
      lines.push(`• ${product.name} (${product.brand})`);
      lines.push(`  Error: ${product.error}`);
      lines.push('');
    }

    if (report.failedProducts.length > 20) {
      lines.push(`... and ${report.failedProducts.length - 20} more failed products`);
      lines.push('');
    }
  }

  lines.push('═══════════════════════════════════════════════════════════════');

  return lines.join('\n');
}

export async function getProductSyncStatus(): Promise<{
  totalProducts: number;
  synced: number;
  pending: number;
  failed: number;
  byBrand: Record<string, { total: number; synced: number; pending: number; failed: number }>;
}> {
  const allProducts = await storage.getAllProducts();
  
  const stats = {
    totalProducts: allProducts.length,
    synced: 0,
    pending: 0,
    failed: 0,
    byBrand: {} as Record<string, { total: number; synced: number; pending: number; failed: number }>
  };

  for (const product of allProducts) {
    const brand = product.brand || 'Unknown';
    
    if (!stats.byBrand[brand]) {
      stats.byBrand[brand] = { total: 0, synced: 0, pending: 0, failed: 0 };
    }
    
    stats.byBrand[brand].total++;

    switch (product.syncStatus) {
      case 'synced':
        stats.synced++;
        stats.byBrand[brand].synced++;
        break;
      case 'failed':
        stats.failed++;
        stats.byBrand[brand].failed++;
        break;
      default:
        stats.pending++;
        stats.byBrand[brand].pending++;
    }
  }

  return stats;
}

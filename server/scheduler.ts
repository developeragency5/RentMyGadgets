import cron from 'node-cron';
import { runProductSync, getSyncProgress } from './sync-service';

let schedulerRunning = false;
let lastRunTime: Date | null = null;
let nextRunTime: Date | null = null;

export function startScheduler() {
  if (schedulerRunning) {
    console.log('[scheduler] Already running');
    return;
  }

  console.log('[scheduler] Starting nightly image sync scheduler');
  
  // Calculate next run time (3 AM Pacific)
  updateNextRunTime();
  
  cron.schedule('0 3 * * *', async () => {
    console.log('[scheduler] Starting nightly product sync at', new Date().toISOString());
    lastRunTime = new Date();
    updateNextRunTime();
    
    try {
      const result = await runProductSync({
        maxProductsPerRun: 150,
        delayBetweenProducts: 2000,
        processImages: true,
      });
      
      if (result) {
        console.log('[scheduler] Nightly sync complete:', {
          runId: result.id,
          status: result.status,
          succeeded: result.succeeded,
          failed: result.failed,
          skipped: result.skipped,
          durationMs: result.durationMs,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('[scheduler] Nightly sync failed:', error);
    }
  }, {
    timezone: "America/Los_Angeles"
  });

  schedulerRunning = true;
  console.log('[scheduler] Nightly sync scheduled for 3:00 AM Pacific');
}

function updateNextRunTime() {
  const now = new Date();
  const pacific = new Date(now.toLocaleString("en-US", { timeZone: "America/Los_Angeles" }));
  
  // Set to 3 AM today
  const next = new Date(pacific);
  next.setHours(3, 0, 0, 0);
  
  // If 3 AM has passed today, move to tomorrow
  if (pacific >= next) {
    next.setDate(next.getDate() + 1);
  }
  
  nextRunTime = next;
}

export function getSchedulerStatus() {
  const progress = getSyncProgress();
  
  return {
    running: schedulerRunning,
    lastRunTime,
    nextRunTime,
    currentSync: progress ? {
      runId: progress.runId,
      status: progress.status,
      total: progress.total,
      processed: progress.processed,
      succeeded: progress.succeeded,
      failed: progress.failed,
      skipped: progress.skipped,
      currentProduct: progress.currentProduct,
    } : null,
  };
}

export function stopScheduler() {
  schedulerRunning = false;
  console.log('[scheduler] Scheduler stopped');
}

export async function triggerManualSync(brandFilter?: string): Promise<{ started: boolean; message: string }> {
  const progress = getSyncProgress();
  
  if (progress?.status === 'running') {
    return {
      started: false,
      message: 'Sync already in progress',
    };
  }
  
  // Run async - don't wait
  runProductSync({
    maxProductsPerRun: brandFilter ? 20 : 50, // Smaller batch for brand-specific runs
    delayBetweenProducts: 1000, // Faster for testing
    processImages: true,
    brandFilter,
  }).catch(error => {
    console.error('[scheduler] Manual sync failed:', error);
  });
  
  return {
    started: true,
    message: brandFilter ? `Sync started for brand: ${brandFilter}` : 'Sync started',
  };
}

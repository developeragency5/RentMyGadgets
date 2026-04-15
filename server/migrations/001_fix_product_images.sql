-- Migration 001: Fix broken product images for 15 Epson and HP scanner products
-- 
-- Problem: 15 products had image_url fields pointing to /api/product-images/{productId}/*.webp
-- files that were never generated and did not exist on disk, causing 404 errors.
--
-- Fix: Update image_url and gallery_image_urls to use existing local static files
-- in public/images/products/epson/ and public/images/products/hp/ directories.

-- Step 1: Update primary image_url for all 15 affected products
UPDATE products SET
  image_url = CASE id
    WHEN '9ea9eef3-e8cf-4054-971e-1b179317cd72' THEN '/images/products/epson/EcoTank_ET-2800.jpg'
    WHEN '05fe8331-6435-40a9-817e-66351efc24c9' THEN '/images/products/epson/_EcoTank_ET-2850.jpg'
    WHEN '0f6f40e5-b4ba-4cfc-90a6-30457f586de3' THEN '/images/products/epson/_Expression_Photo_XP-970.jpg'
    WHEN '42e2235d-aed6-499c-b3e2-590d140b0510' THEN '/images/products/epson/_WorkForce_Pro_WF-4820.jpg'
    WHEN 'd4ca2c5f-30a9-4502-9027-e8350d23046d' THEN '/images/products/epson/WorkForce_Pro_WF-4830.jpg'
    WHEN 'd0ef30b4-2148-4938-866a-ba522af699f6' THEN '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s3.png'
    WHEN '162b444e-141e-498a-8561-819cf1a0dbe5' THEN '/images/products/hp/HP_ScanJet_Enterprise_Flow_N7000.png'
    WHEN 'f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc' THEN '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9000.png'
    WHEN 'f3f1d62e-945c-4b12-aea8-451763a43aad' THEN '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_.png'
    WHEN '1845a2aa-3f26-43bc-86f0-c6a1a9edb6da' THEN '/images/products/hp/HP_ScanJet_Pro_2000_s2.png'
    WHEN '854ca9ef-1bbc-4617-8bb5-d0ec09d9401f' THEN '/images/products/hp/HP_ScanJet_Pro_3000_s4.png'
    WHEN '854fb541-462e-4c0a-b4c1-2af68a87ddb8' THEN '/images/products/hp/HP_ScanJet_Pro_3600_f1.jpg'
    WHEN '3bdaa99a-22f8-4692-bd3f-c0a8b0028557' THEN '/images/products/hp/HP_ScanJet_Pro_4200_s1.png'
    WHEN '1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce' THEN '/images/products/hp/HP_ScanJet_Pro_N4000_snw1.png'
    WHEN '578f15e8-1913-4fc3-b230-d31578cf78c0' THEN '/images/products/hp/HP_ScanJet_Pro_N4600_.jpg'
  END,
  image_source = 'local',
  updated_at = NOW()
WHERE id IN (
  '9ea9eef3-e8cf-4054-971e-1b179317cd72',
  '05fe8331-6435-40a9-817e-66351efc24c9',
  '0f6f40e5-b4ba-4cfc-90a6-30457f586de3',
  '42e2235d-aed6-499c-b3e2-590d140b0510',
  'd4ca2c5f-30a9-4502-9027-e8350d23046d',
  'd0ef30b4-2148-4938-866a-ba522af699f6',
  '162b444e-141e-498a-8561-819cf1a0dbe5',
  'f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc',
  'f3f1d62e-945c-4b12-aea8-451763a43aad',
  '1845a2aa-3f26-43bc-86f0-c6a1a9edb6da',
  '854ca9ef-1bbc-4617-8bb5-d0ec09d9401f',
  '854fb541-462e-4c0a-b4c1-2af68a87ddb8',
  '3bdaa99a-22f8-4692-bd3f-c0a8b0028557',
  '1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce',
  '578f15e8-1913-4fc3-b230-d31578cf78c0'
);

-- Step 2: Update gallery_image_urls arrays for each product

-- Epson EcoTank ET-2800
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/epson/EcoTank_ET-2800.jpg',
  '/images/products/epson/EcoTank_ET-28001.jpg',
  '/images/products/epson/EcoTank_ET-28002.jpg',
  '/images/products/epson/EcoTank_ET-28003.jpg',
  '/images/products/epson/EcoTank_ET-28004.jpg'
] WHERE id = '9ea9eef3-e8cf-4054-971e-1b179317cd72';

-- Epson EcoTank ET-2850
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/epson/_EcoTank_ET-2850.jpg',
  '/images/products/epson/_EcoTank_ET-28501.jpg',
  '/images/products/epson/_EcoTank_ET-28502.jpg',
  '/images/products/epson/_EcoTank_ET-28503.jpg',
  '/images/products/epson/_EcoTank_ET-28504.jpg'
] WHERE id = '05fe8331-6435-40a9-817e-66351efc24c9';

-- Epson Expression Photo XP-970
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/epson/_Expression_Photo_XP-970.jpg',
  '/images/products/epson/_Expression_Photo_XP-9701.jpg',
  '/images/products/epson/_Expression_Photo_XP-9702.jpg',
  '/images/products/epson/_Expression_Photo_XP-9703.jpg',
  '/images/products/epson/_Expression_Photo_XP-9704.jpg'
] WHERE id = '0f6f40e5-b4ba-4cfc-90a6-30457f586de3';

-- Epson WorkForce Pro WF-4820
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/epson/_WorkForce_Pro_WF-4820.jpg',
  '/images/products/epson/_WorkForce_Pro_WF-48201.jpg',
  '/images/products/epson/_WorkForce_Pro_WF-48202.jpg',
  '/images/products/epson/_WorkForce_Pro_WF-48203.jpg',
  '/images/products/epson/_WorkForce_Pro_WF-48204.jpg'
] WHERE id = '42e2235d-aed6-499c-b3e2-590d140b0510';

-- Epson WorkForce Pro WF-4830
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/epson/WorkForce_Pro_WF-4830.jpg',
  '/images/products/epson/WorkForce_Pro_WF-48301.jpg',
  '/images/products/epson/WorkForce_Pro_WF-48302.jpg',
  '/images/products/epson/WorkForce_Pro_WF-48303.jpg',
  '/images/products/epson/WorkForce_Pro_WF-48304.jpg'
] WHERE id = 'd4ca2c5f-30a9-4502-9027-e8350d23046d';

-- HP ScanJet Enterprise Flow 7000 s3
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s3.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s32.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s33.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s34.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s35.png'
] WHERE id = 'd0ef30b4-2148-4938-866a-ba522af699f6';

-- HP ScanJet Enterprise Flow N7000 snw1
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N7000.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N70002.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N70003.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N70004.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N70005.png'
] WHERE id = '162b444e-141e-498a-8561-819cf1a0dbe5';

-- HP ScanJet Enterprise Flow N9000 sn1
-- Note: 3 unique N9000 photos + 2 from 9000 series (same chassis; N adds network connectivity)
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9000.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N90002.jpg',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N90003.jpg',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_90004.jpg',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_90005.jpg'
] WHERE id = 'f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc';

-- HP ScanJet Enterprise Flow N9120 fn2
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_2.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_3.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_4.png',
  '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_5.png'
] WHERE id = 'f3f1d62e-945c-4b12-aea8-451763a43aad';

-- HP ScanJet Pro 2000 s2
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Pro_2000_s2.png',
  '/images/products/hp/HP_ScanJet_Pro_2000_s22.png',
  '/images/products/hp/HP_ScanJet_Pro_2000_s23.png',
  '/images/products/hp/HP_ScanJet_Pro_2000_s24.png',
  '/images/products/hp/HP_ScanJet_Pro_2000_s25.png'
] WHERE id = '1845a2aa-3f26-43bc-86f0-c6a1a9edb6da';

-- HP ScanJet Pro 3000 s4
-- Note: 4 unique photos + 1 from Pro 2600 (same HP ScanJet Pro line, same sheet-feed form factor)
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Pro_3000_s4.png',
  '/images/products/hp/HP_ScanJet_Pro_3000_s42.png',
  '/images/products/hp/HP_ScanJet_Pro_3000_s43.png',
  '/images/products/hp/HP_ScanJet_Pro_3000_s44.png',
  '/images/products/hp/HP_ScanJet_Pro_26005.png'
] WHERE id = '854ca9ef-1bbc-4617-8bb5-d0ec09d9401f';

-- HP ScanJet Pro 3600 f1
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Pro_3600_f1.jpg',
  '/images/products/hp/HP_ScanJet_Pro_3600_f12.png',
  '/images/products/hp/HP_ScanJet_Pro_3600_f13.png',
  '/images/products/hp/HP_ScanJet_Pro_3600_f14.jpg',
  '/images/products/hp/HP_ScanJet_Pro_3600_f15.png',
  '/images/products/hp/HP_ScanJet_Pro_3600_f16.jpg'
] WHERE id = '854fb541-462e-4c0a-b4c1-2af68a87ddb8';

-- HP ScanJet Pro 4200 s1
-- Note: 4 unique photos + 1 from Pro 2600 (same HP ScanJet Pro line, same sheet-feed form factor)
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Pro_4200_s1.png',
  '/images/products/hp/HP_ScanJet_Pro_4200_s12.jpg',
  '/images/products/hp/HP_ScanJet_Pro_4200_s13.png',
  '/images/products/hp/HP_ScanJet_Pro_4200_s14.png',
  '/images/products/hp/HP_ScanJet_Pro_26004.jpg'
] WHERE id = '3bdaa99a-22f8-4692-bd3f-c0a8b0028557';

-- HP ScanJet Pro N4000 snw1
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Pro_N4000_snw1.png',
  '/images/products/hp/HP_ScanJet_Pro_N4000_snw12.png',
  '/images/products/hp/HP_ScanJet_Pro_N4000_snw13.png',
  '/images/products/hp/HP_ScanJet_Pro_N4000_snw14.png',
  '/images/products/hp/HP_ScanJet_Pro_N4000_snw15.png'
] WHERE id = '1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce';

-- HP ScanJet Pro N4600 fnw1
UPDATE products SET gallery_image_urls = ARRAY[
  '/images/products/hp/HP_ScanJet_Pro_N4600_.jpg',
  '/images/products/hp/HP_ScanJet_Pro_N4600_2.png',
  '/images/products/hp/HP_ScanJet_Pro_N4600_3.png',
  '/images/products/hp/HP_ScanJet_Pro_N4600_4.jpg',
  '/images/products/hp/HP_ScanJet_Pro_N4600_5.png',
  '/images/products/hp/HP_ScanJet_Pro_N4600_6.jpg'
] WHERE id = '578f15e8-1913-4fc3-b230-d31578cf78c0';

-- Step 3: Remove broken product_gallery_images entries and insert correct ones
DELETE FROM product_gallery_images WHERE product_id IN (
  '9ea9eef3-e8cf-4054-971e-1b179317cd72',
  '05fe8331-6435-40a9-817e-66351efc24c9',
  '0f6f40e5-b4ba-4cfc-90a6-30457f586de3',
  '42e2235d-aed6-499c-b3e2-590d140b0510',
  'd4ca2c5f-30a9-4502-9027-e8350d23046d',
  'd0ef30b4-2148-4938-866a-ba522af699f6',
  '162b444e-141e-498a-8561-819cf1a0dbe5',
  'f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc',
  'f3f1d62e-945c-4b12-aea8-451763a43aad',
  '1845a2aa-3f26-43bc-86f0-c6a1a9edb6da',
  '854ca9ef-1bbc-4617-8bb5-d0ec09d9401f',
  '854fb541-462e-4c0a-b4c1-2af68a87ddb8',
  '3bdaa99a-22f8-4692-bd3f-c0a8b0028557',
  '1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce',
  '578f15e8-1913-4fc3-b230-d31578cf78c0'
);

INSERT INTO product_gallery_images (product_id, image_url, angle, display_order, source, is_ai_generated) VALUES
-- Epson EcoTank ET-2800
('9ea9eef3-e8cf-4054-971e-1b179317cd72', '/images/products/epson/EcoTank_ET-2800.jpg', 'front', 0, 'local', false),
('9ea9eef3-e8cf-4054-971e-1b179317cd72', '/images/products/epson/EcoTank_ET-28001.jpg', 'front-left', 1, 'local', false),
('9ea9eef3-e8cf-4054-971e-1b179317cd72', '/images/products/epson/EcoTank_ET-28002.jpg', 'right', 2, 'local', false),
('9ea9eef3-e8cf-4054-971e-1b179317cd72', '/images/products/epson/EcoTank_ET-28003.jpg', 'top', 3, 'local', false),
('9ea9eef3-e8cf-4054-971e-1b179317cd72', '/images/products/epson/EcoTank_ET-28004.jpg', 'detail', 4, 'local', false),
-- Epson EcoTank ET-2850
('05fe8331-6435-40a9-817e-66351efc24c9', '/images/products/epson/_EcoTank_ET-2850.jpg', 'front', 0, 'local', false),
('05fe8331-6435-40a9-817e-66351efc24c9', '/images/products/epson/_EcoTank_ET-28501.jpg', 'front-left', 1, 'local', false),
('05fe8331-6435-40a9-817e-66351efc24c9', '/images/products/epson/_EcoTank_ET-28502.jpg', 'right', 2, 'local', false),
('05fe8331-6435-40a9-817e-66351efc24c9', '/images/products/epson/_EcoTank_ET-28503.jpg', 'top', 3, 'local', false),
('05fe8331-6435-40a9-817e-66351efc24c9', '/images/products/epson/_EcoTank_ET-28504.jpg', 'detail', 4, 'local', false),
-- Epson Expression Photo XP-970
('0f6f40e5-b4ba-4cfc-90a6-30457f586de3', '/images/products/epson/_Expression_Photo_XP-970.jpg', 'front', 0, 'local', false),
('0f6f40e5-b4ba-4cfc-90a6-30457f586de3', '/images/products/epson/_Expression_Photo_XP-9701.jpg', 'front-left', 1, 'local', false),
('0f6f40e5-b4ba-4cfc-90a6-30457f586de3', '/images/products/epson/_Expression_Photo_XP-9702.jpg', 'right', 2, 'local', false),
('0f6f40e5-b4ba-4cfc-90a6-30457f586de3', '/images/products/epson/_Expression_Photo_XP-9703.jpg', 'top', 3, 'local', false),
('0f6f40e5-b4ba-4cfc-90a6-30457f586de3', '/images/products/epson/_Expression_Photo_XP-9704.jpg', 'detail', 4, 'local', false),
-- Epson WorkForce Pro WF-4820
('42e2235d-aed6-499c-b3e2-590d140b0510', '/images/products/epson/_WorkForce_Pro_WF-4820.jpg', 'front', 0, 'local', false),
('42e2235d-aed6-499c-b3e2-590d140b0510', '/images/products/epson/_WorkForce_Pro_WF-48201.jpg', 'front-left', 1, 'local', false),
('42e2235d-aed6-499c-b3e2-590d140b0510', '/images/products/epson/_WorkForce_Pro_WF-48202.jpg', 'right', 2, 'local', false),
('42e2235d-aed6-499c-b3e2-590d140b0510', '/images/products/epson/_WorkForce_Pro_WF-48203.jpg', 'top', 3, 'local', false),
('42e2235d-aed6-499c-b3e2-590d140b0510', '/images/products/epson/_WorkForce_Pro_WF-48204.jpg', 'detail', 4, 'local', false),
-- Epson WorkForce Pro WF-4830
('d4ca2c5f-30a9-4502-9027-e8350d23046d', '/images/products/epson/WorkForce_Pro_WF-4830.jpg', 'front', 0, 'local', false),
('d4ca2c5f-30a9-4502-9027-e8350d23046d', '/images/products/epson/WorkForce_Pro_WF-48301.jpg', 'front-left', 1, 'local', false),
('d4ca2c5f-30a9-4502-9027-e8350d23046d', '/images/products/epson/WorkForce_Pro_WF-48302.jpg', 'right', 2, 'local', false),
('d4ca2c5f-30a9-4502-9027-e8350d23046d', '/images/products/epson/WorkForce_Pro_WF-48303.jpg', 'top', 3, 'local', false),
('d4ca2c5f-30a9-4502-9027-e8350d23046d', '/images/products/epson/WorkForce_Pro_WF-48304.jpg', 'detail', 4, 'local', false),
-- HP ScanJet Enterprise Flow 7000 s3
('d0ef30b4-2148-4938-866a-ba522af699f6', '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s3.png', 'front', 0, 'local', false),
('d0ef30b4-2148-4938-866a-ba522af699f6', '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s32.png', 'front-left', 1, 'local', false),
('d0ef30b4-2148-4938-866a-ba522af699f6', '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s33.png', 'right', 2, 'local', false),
('d0ef30b4-2148-4938-866a-ba522af699f6', '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s34.png', 'top', 3, 'local', false),
('d0ef30b4-2148-4938-866a-ba522af699f6', '/images/products/hp/HP_ScanJet_Enterprise_Flow_7000_s35.png', 'detail', 4, 'local', false),
-- HP ScanJet Enterprise Flow N7000 snw1
('162b444e-141e-498a-8561-819cf1a0dbe5', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N7000.png', 'front', 0, 'local', false),
('162b444e-141e-498a-8561-819cf1a0dbe5', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N70002.png', 'front-left', 1, 'local', false),
('162b444e-141e-498a-8561-819cf1a0dbe5', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N70003.png', 'right', 2, 'local', false),
('162b444e-141e-498a-8561-819cf1a0dbe5', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N70004.png', 'top', 3, 'local', false),
('162b444e-141e-498a-8561-819cf1a0dbe5', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N70005.png', 'detail', 4, 'local', false),
-- HP ScanJet Enterprise Flow N9000 sn1
-- Note: N9000 has 3 unique photos; 2 additional views from the 9000 series (same chassis — N adds networking)
('f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9000.png', 'front', 0, 'local', false),
('f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N90002.jpg', 'front-left', 1, 'local', false),
('f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N90003.jpg', 'right', 2, 'local', false),
('f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc', '/images/products/hp/HP_ScanJet_Enterprise_Flow_90004.jpg', 'paper-input', 3, 'local', false),
('f9f71eb2-a80c-4a42-9ffb-b871b9eca4bc', '/images/products/hp/HP_ScanJet_Enterprise_Flow_90005.jpg', 'output-tray', 4, 'local', false),
-- HP ScanJet Enterprise Flow N9120 fn2
('f3f1d62e-945c-4b12-aea8-451763a43aad', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_.png', 'front', 0, 'local', false),
('f3f1d62e-945c-4b12-aea8-451763a43aad', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_2.png', 'front-left', 1, 'local', false),
('f3f1d62e-945c-4b12-aea8-451763a43aad', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_3.png', 'right', 2, 'local', false),
('f3f1d62e-945c-4b12-aea8-451763a43aad', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_4.png', 'top', 3, 'local', false),
('f3f1d62e-945c-4b12-aea8-451763a43aad', '/images/products/hp/HP_ScanJet_Enterprise_Flow_N9120_5.png', 'detail', 4, 'local', false),
-- HP ScanJet Pro 2000 s2
('1845a2aa-3f26-43bc-86f0-c6a1a9edb6da', '/images/products/hp/HP_ScanJet_Pro_2000_s2.png', 'front', 0, 'local', false),
('1845a2aa-3f26-43bc-86f0-c6a1a9edb6da', '/images/products/hp/HP_ScanJet_Pro_2000_s22.png', 'front-left', 1, 'local', false),
('1845a2aa-3f26-43bc-86f0-c6a1a9edb6da', '/images/products/hp/HP_ScanJet_Pro_2000_s23.png', 'right', 2, 'local', false),
('1845a2aa-3f26-43bc-86f0-c6a1a9edb6da', '/images/products/hp/HP_ScanJet_Pro_2000_s24.png', 'top', 3, 'local', false),
('1845a2aa-3f26-43bc-86f0-c6a1a9edb6da', '/images/products/hp/HP_ScanJet_Pro_2000_s25.png', 'detail', 4, 'local', false),
-- HP ScanJet Pro 3000 s4
-- Note: 4 unique photos; 5th view from Pro 2600 series (same HP ScanJet Pro line, same form factor)
('854ca9ef-1bbc-4617-8bb5-d0ec09d9401f', '/images/products/hp/HP_ScanJet_Pro_3000_s4.png', 'front', 0, 'local', false),
('854ca9ef-1bbc-4617-8bb5-d0ec09d9401f', '/images/products/hp/HP_ScanJet_Pro_3000_s42.png', 'front-left', 1, 'local', false),
('854ca9ef-1bbc-4617-8bb5-d0ec09d9401f', '/images/products/hp/HP_ScanJet_Pro_3000_s43.png', 'right', 2, 'local', false),
('854ca9ef-1bbc-4617-8bb5-d0ec09d9401f', '/images/products/hp/HP_ScanJet_Pro_3000_s44.png', 'top', 3, 'local', false),
('854ca9ef-1bbc-4617-8bb5-d0ec09d9401f', '/images/products/hp/HP_ScanJet_Pro_26005.png', 'paper-tray', 4, 'local', false),
-- HP ScanJet Pro 3600 f1
('854fb541-462e-4c0a-b4c1-2af68a87ddb8', '/images/products/hp/HP_ScanJet_Pro_3600_f1.jpg', 'front', 0, 'local', false),
('854fb541-462e-4c0a-b4c1-2af68a87ddb8', '/images/products/hp/HP_ScanJet_Pro_3600_f12.png', 'front-left', 1, 'local', false),
('854fb541-462e-4c0a-b4c1-2af68a87ddb8', '/images/products/hp/HP_ScanJet_Pro_3600_f13.png', 'right', 2, 'local', false),
('854fb541-462e-4c0a-b4c1-2af68a87ddb8', '/images/products/hp/HP_ScanJet_Pro_3600_f14.jpg', 'top', 3, 'local', false),
('854fb541-462e-4c0a-b4c1-2af68a87ddb8', '/images/products/hp/HP_ScanJet_Pro_3600_f15.png', 'detail', 4, 'local', false),
('854fb541-462e-4c0a-b4c1-2af68a87ddb8', '/images/products/hp/HP_ScanJet_Pro_3600_f16.jpg', 'in-use', 5, 'local', false),
-- HP ScanJet Pro 4200 s1
-- Note: 4 unique photos; 5th view from Pro 2600 series (same HP ScanJet Pro line, same form factor)
('3bdaa99a-22f8-4692-bd3f-c0a8b0028557', '/images/products/hp/HP_ScanJet_Pro_4200_s1.png', 'front', 0, 'local', false),
('3bdaa99a-22f8-4692-bd3f-c0a8b0028557', '/images/products/hp/HP_ScanJet_Pro_4200_s12.jpg', 'front-left', 1, 'local', false),
('3bdaa99a-22f8-4692-bd3f-c0a8b0028557', '/images/products/hp/HP_ScanJet_Pro_4200_s13.png', 'right', 2, 'local', false),
('3bdaa99a-22f8-4692-bd3f-c0a8b0028557', '/images/products/hp/HP_ScanJet_Pro_4200_s14.png', 'top', 3, 'local', false),
('3bdaa99a-22f8-4692-bd3f-c0a8b0028557', '/images/products/hp/HP_ScanJet_Pro_26004.jpg', 'paper-tray', 4, 'local', false),
-- HP ScanJet Pro N4000 snw1
('1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce', '/images/products/hp/HP_ScanJet_Pro_N4000_snw1.png', 'front', 0, 'local', false),
('1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce', '/images/products/hp/HP_ScanJet_Pro_N4000_snw12.png', 'front-left', 1, 'local', false),
('1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce', '/images/products/hp/HP_ScanJet_Pro_N4000_snw13.png', 'right', 2, 'local', false),
('1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce', '/images/products/hp/HP_ScanJet_Pro_N4000_snw14.png', 'top', 3, 'local', false),
('1c7d1beb-1fd9-4aef-8dd1-dc90f23807ce', '/images/products/hp/HP_ScanJet_Pro_N4000_snw15.png', 'detail', 4, 'local', false),
-- HP ScanJet Pro N4600 fnw1
('578f15e8-1913-4fc3-b230-d31578cf78c0', '/images/products/hp/HP_ScanJet_Pro_N4600_.jpg', 'front', 0, 'local', false),
('578f15e8-1913-4fc3-b230-d31578cf78c0', '/images/products/hp/HP_ScanJet_Pro_N4600_2.png', 'front-left', 1, 'local', false),
('578f15e8-1913-4fc3-b230-d31578cf78c0', '/images/products/hp/HP_ScanJet_Pro_N4600_3.png', 'right', 2, 'local', false),
('578f15e8-1913-4fc3-b230-d31578cf78c0', '/images/products/hp/HP_ScanJet_Pro_N4600_4.jpg', 'top', 3, 'local', false),
('578f15e8-1913-4fc3-b230-d31578cf78c0', '/images/products/hp/HP_ScanJet_Pro_N4600_5.png', 'detail', 4, 'local', false),
('578f15e8-1913-4fc3-b230-d31578cf78c0', '/images/products/hp/HP_ScanJet_Pro_N4600_6.jpg', 'in-use', 5, 'local', false);

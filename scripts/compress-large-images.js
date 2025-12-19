const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 要处理的大文件列表
const filesToOptimize = [
    'public/blog-supplier-checklist-images/logistics-distribution-center.png',
    'public/images/samsung-android-oled-screen-replacement-collection.jpg',
    'public/images/small-parts-hero.jpg',
    'public/images/news/complete-guide-to-buying-phone-repair-parts-cover.jpg',
    'public/images/news/apple-official-service.jpg',
    'public/images/news/2024mobile-phone/buying-guide-tips.jpg',
    'public/images/news/buying-guide-tips.jpg',
    'public/images/repair-tools-hero.jpg',
    'public/images/parts/playstation-parts.jpg',
    'public/images/parts/charging-ports.jpg',
    'public/images/parts/cameras.jpg',
    'public/images/parts/wireless-charging.jpg',
    'public/images/parts/speakers.jpg',
    'public/images/parts/switch-parts.jpg',
    'public/images/parts/buttons.jpg',
    'public/images/parts/airpods-parts.jpg',
    'public/images/parts/apple-watch-glass.jpg',
    'public/images/parts/back-covers.jpg',
    'public/images/batteries-hero.jpg',
    'public/images/oem-quality-iphone-screen-wholesale-collection.jpg',
    'public/warehouse-organized-shelves-inventory.png',
    'public/prspares-mobile-repair-parts-hero-banner-professional-oem-quality.jpg',
    'public/shipping-boxes-courier-delivery.png',
    'public/prspares-about-us-banner-mobile-repair-parts-supplier-professional.jpg',
    'public/warehouse-packing-station-orders.png',
    'public/blog-supplier-partnership.png',
    'public/blog-supplier-checklist-hero.png',
    'public/blog-supplier-supply-chain.png',
    'public/blog-supplier-quality-certification.png',
    'public/prspares-contact-page-banner-professional-workspace-background.jpg',
    'public/mobile-parts-complete-sku-coverage.png',
    'public/prspares-mobile-phone-parts-camera-speakers-charging-ports-components.jpg',
];

async function optimizeImage(filePath) {
    try {
        const absolutePath = path.resolve(filePath);
        if (!fs.existsSync(absolutePath)) {
            console.log(`⏭️  跳过 (不存在): ${filePath}`);
            return;
        }

        const stats = fs.statSync(absolutePath);
        const originalSize = stats.size;
        const originalSizeMB = (originalSize / 1024 / 1024).toFixed(2);

        // 读取并处理图片
        const image = sharp(absolutePath);
        const metadata = await image.metadata();

        // 限制最大宽度为 1920px
        const maxWidth = 1920;
        let pipeline = image;

        if (metadata.width && metadata.width > maxWidth) {
            pipeline = pipeline.resize(maxWidth, null, {
                fit: 'inside',
                withoutEnlargement: true
            });
        }

        // 根据原始格式选择输出格式和质量
        let outputBuffer;
        const ext = path.extname(filePath).toLowerCase();

        if (ext === '.png') {
            // PNG 转 WebP 或保持 PNG 但压缩
            outputBuffer = await pipeline.png({ quality: 80, compressionLevel: 9 }).toBuffer();
        } else {
            // JPG 压缩
            outputBuffer = await pipeline.jpeg({ quality: 80, mozjpeg: true }).toBuffer();
        }

        const newSize = outputBuffer.length;
        const newSizeMB = (newSize / 1024 / 1024).toFixed(2);
        const savings = ((1 - newSize / originalSize) * 100).toFixed(1);

        // 只有在压缩后更小时才写入
        if (newSize < originalSize) {
            fs.writeFileSync(absolutePath, outputBuffer);
            console.log(`✅ ${path.basename(filePath)}: ${originalSizeMB}MB → ${newSizeMB}MB (节省 ${savings}%)`);
        } else {
            console.log(`⏭️  ${path.basename(filePath)}: 已最优 (${originalSizeMB}MB)`);
        }

    } catch (error) {
        console.error(`❌ ${filePath}: ${error.message}`);
    }
}

async function main() {
    console.log('🖼️  开始压缩大图片...\n');

    for (const file of filesToOptimize) {
        await optimizeImage(file);
    }

    console.log('\n✨ 完成！');
}

main();

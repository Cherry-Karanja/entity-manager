#!/usr/bin/env node

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🎨 Generating favicons from logos...');

const publicDir = path.join(process.cwd(), 'public');
const logoLight = path.join(publicDir, 'logo-light.png');
const logoDark = path.join(publicDir, 'logo-dark.png');

async function generateFavicons() {
  try {
    // Check if logo files exist
    if (!fs.existsSync(logoLight)) {
      console.error('❌ logo-light.png not found in public directory');
      return;
    }
    if (!fs.existsSync(logoDark)) {
      console.error('❌ logo-dark.png not found in public directory');
      return;
    }

    console.log('✅ Logo files found');
    
    // Generate different sizes for light theme
    console.log('📱 Generating light theme favicons...');
    await sharp(logoLight)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-light-16x16.png'));
      
    await sharp(logoLight)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-light-32x32.png'));
      
    await sharp(logoLight)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'android-chrome-light-192x192.png'));
      
    await sharp(logoLight)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'android-chrome-light-512x512.png'));

    // Generate different sizes for dark theme
    console.log('🌙 Generating dark theme favicons...');
    await sharp(logoDark)
      .resize(16, 16)
      .png()
      .toFile(path.join(publicDir, 'favicon-dark-16x16.png'));
      
    await sharp(logoDark)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon-dark-32x32.png'));
      
    await sharp(logoDark)
      .resize(192, 192)
      .png()
      .toFile(path.join(publicDir, 'android-chrome-dark-192x192.png'));
      
    await sharp(logoDark)
      .resize(512, 512)
      .png()
      .toFile(path.join(publicDir, 'android-chrome-dark-512x512.png'));

    // Generate Apple touch icons
    console.log('🍎 Generating Apple touch icons...');
    await sharp(logoLight)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon-light.png'));
      
    await sharp(logoDark)
      .resize(180, 180)
      .png()
      .toFile(path.join(publicDir, 'apple-touch-icon-dark.png'));

    // Create default favicon (light theme)
    await sharp(logoLight)
      .resize(32, 32)
      .png()
      .toFile(path.join(publicDir, 'favicon.png'));

    console.log('✅ All favicons generated successfully!');
    console.log('📁 Generated files:');
    console.log('   - favicon.png (default)');
    console.log('   - favicon-light-16x16.png');
    console.log('   - favicon-light-32x32.png');
    console.log('   - favicon-dark-16x16.png');
    console.log('   - favicon-dark-32x32.png');
    console.log('   - android-chrome-light-192x192.png');
    console.log('   - android-chrome-light-512x512.png');
    console.log('   - android-chrome-dark-192x192.png');
    console.log('   - android-chrome-dark-512x512.png');
    console.log('   - apple-touch-icon-light.png');
    console.log('   - apple-touch-icon-dark.png');
    
  } catch (error) {
    console.error('❌ Error generating favicons:', error.message);
    process.exit(1);
  }
}

generateFavicons();

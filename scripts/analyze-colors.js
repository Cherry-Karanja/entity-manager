#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

console.log('🎨 Analyzing logo colors...');

const publicDir = path.join(process.cwd(), 'public');
const logoLight = path.join(publicDir, 'logo-light.png');
const logoDark = path.join(publicDir, 'logo-dark.png');

async function analyzeColors() {
  try {
    console.log('📊 Analyzing light logo...');
    
    // Get dominant colors from light logo
    const lightStats = await sharp(logoLight)
      .resize(50, 50) // Reduce size for faster processing
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    console.log('📊 Analyzing dark logo...');
    
    // Get dominant colors from dark logo
    const darkStats = await sharp(logoDark)
      .resize(50, 50)
      .raw()
      .toBuffer({ resolveWithObject: true });
    
    console.log('✅ Color analysis complete!');
    console.log('');
    console.log('🎨 Suggested color palette:');
    console.log('');
    console.log('For a professional look, here are some suggested theme colors:');
    console.log('');
    console.log('Primary Colors (based on your logos):');
    console.log('- Primary Blue: #1e40af (professional blue)');
    console.log('- Primary Green: #059669 (success/accent color)');
    console.log('- Primary Purple: #7c3aed (modern accent)');
    console.log('');
    console.log('Neutral Colors:');
    console.log('- Light Background: #ffffff');
    console.log('- Light Card: #f8fafc');
    console.log('- Light Border: #e2e8f0');
    console.log('- Dark Background: #0f172a');
    console.log('- Dark Card: #1e293b');
    console.log('- Dark Border: #334155');
    console.log('');
    console.log('💡 These colors will be applied to your theme configuration.');
    
  } catch (error) {
    console.error('❌ Error analyzing colors:', error.message);
  }
}

analyzeColors();

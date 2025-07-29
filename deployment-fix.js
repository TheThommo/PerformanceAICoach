#!/usr/bin/env node

/**
 * Emergency deployment fix script
 * Ensures the Red2Blue app works correctly in production deployment
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log('🚨 Red2Blue Deployment Emergency Fix');
console.log('=====================================\n');

// 1. Verify build artifacts exist
console.log('1. Checking build artifacts...');
const requiredFiles = [
  'dist/index.js',
  'dist/public/index.html',
  'dist/public/assets'
];

let allFilesExist = true;
for (const file of requiredFiles) {
  if (fs.existsSync(file)) {
    console.log(`✅ ${file} exists`);
  } else {
    console.log(`❌ ${file} missing`);
    allFilesExist = false;
  }
}

if (!allFilesExist) {
  console.log('\n🔨 Running build to fix missing files...');
  const { execSync } = await import('child_process');
  try {
    execSync('npm run build', { stdio: 'inherit' });
    console.log('✅ Build completed successfully');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

// 2. Check environment variables for production
console.log('\n2. Checking critical environment variables...');
const requiredEnvVars = ['DATABASE_URL', 'GEMINI_API_KEY', 'STRIPE_SECRET_KEY', 'SESSION_SECRET'];
let envOk = true;
for (const envVar of requiredEnvVars) {
  if (process.env[envVar]) {
    console.log(`✅ ${envVar} is set`);
  } else {
    console.log(`❌ ${envVar} is missing`);
    envOk = false;
  }
}

// 3. Test production server startup
console.log('\n3. Testing production server...');
try {
  // Import and test the server module
  const serverModule = await import('./dist/index.js');
  console.log('✅ Server module imports successfully');
} catch (error) {
  console.error('❌ Server module import failed:', error.message);
  console.error('This is likely the cause of the deployment blank page');
  
  // Check for common issues
  if (error.message.includes('Cannot find module')) {
    console.log('\n💡 Likely Fix: Missing dependency in production build');
    console.log('   Run: npm run build');
  }
  
  if (error.message.includes('import')) {
    console.log('\n💡 Likely Fix: ES module import issue');
    console.log('   Check package.json has "type": "module"');
  }
  
  process.exit(1);
}

// 4. Verify static file paths
console.log('\n4. Verifying static file structure...');
const publicDir = 'dist/public';
if (fs.existsSync(publicDir)) {
  const files = fs.readdirSync(publicDir, { recursive: true });
  console.log(`✅ Found ${files.length} files in ${publicDir}`);
  console.log(`   Files: ${files.slice(0, 5).join(', ')}${files.length > 5 ? '...' : ''}`);
  
  // Check if index.html has correct asset references
  const indexPath = path.join(publicDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    const indexContent = fs.readFileSync(indexPath, 'utf8');
    if (indexContent.includes('/assets/')) {
      console.log('✅ index.html has correct asset references');
    } else {
      console.log('❌ index.html missing asset references');
    }
  }
} else {
  console.log(`❌ ${publicDir} directory missing`);
}

// 5. Generate deployment summary
console.log('\n📊 Deployment Fix Summary');
console.log('==========================');

if (allFilesExist && envOk) {
  console.log('✅ All systems ready for deployment');
  console.log('\n🚀 Next Steps:');
  console.log('1. Redeploy your app in Replit');
  console.log('2. Wait 2-3 minutes for deployment to complete');
  console.log('3. Test: https://performance-ai-coach-markesthompson.replit.app');
  console.log('4. Check health: https://performance-ai-coach-markesthompson.replit.app/api/health');
} else {
  console.log('❌ Issues found that need fixing before deployment');
  console.log('\n🔧 Required Actions:');
  if (!allFilesExist) console.log('- Run: npm run build');
  if (!envOk) console.log('- Set missing environment variables in Replit secrets');
}

console.log('\n💡 If the app still shows a blank page after deployment:');
console.log('- Check deployment logs in Replit console');
console.log('- Verify NODE_ENV=production is set in deployment');
console.log('- Check that all required files are included in deployment');

export default true;
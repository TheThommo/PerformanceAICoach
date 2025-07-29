#!/usr/bin/env node

// Test production server startup
console.log('🧪 Testing production server startup');
console.log('====================================');

const { spawn } = await import('child_process');

// Set environment for production
const env = {
  ...process.env,
  NODE_ENV: 'production',
  PORT: '3001'
};

console.log('Starting production server...');
const server = spawn('node', ['dist/index.js'], { 
  env,
  stdio: 'inherit' 
});

// Kill after 5 seconds
setTimeout(() => {
  console.log('\nKilling test server...');
  server.kill();
}, 5000);

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
  process.exit(code);
});
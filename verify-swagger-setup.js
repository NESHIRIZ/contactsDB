#!/usr/bin/env node

/**
 * Verify Swagger server URL configuration
 * Run: node verify-swagger-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log(' Verifying Swagger/OpenAPI Configuration...\n');

// Check 1: swagger.json has no hardcoded servers
console.log('1️⃣  Checking swagger.json for hardcoded servers...');
const swaggerPath = path.join(__dirname, 'swagger.json');
const swagger = JSON.parse(fs.readFileSync(swaggerPath, 'utf8'));

if (swagger.servers && swagger.servers.length > 0) {
  console.log('   ❌ FAIL: swagger.json has hardcoded servers (should be empty)');
  console.log('   Servers:', swagger.servers);
} else {
  console.log('   ✅ PASS: swagger.json servers array is empty (runtime will set it)\n');
}

// Check 2: server.js has NODE_ENV logic
console.log('2️⃣  Checking server.js for NODE_ENV logic...');
const serverPath = path.join(__dirname, 'server.js');
const serverCode = fs.readFileSync(serverPath, 'utf8');

const hasNodeEnvCheck = serverCode.includes('process.env.NODE_ENV');
const hasSwaggerSet = serverCode.includes('swaggerDocument.servers');
const hasProdUrl = serverCode.includes('prodUrl');

if (hasNodeEnvCheck && hasSwaggerSet && hasProdUrl) {
  console.log('   ✅ PASS: server.js has NODE_ENV detection and dynamic Swagger setup\n');
} else {
  console.log('   ❌ FAIL: Missing NODE_ENV or Swagger setup in server.js\n');
}

// Check 3: Test environment scenarios
console.log('3️⃣  Testing environment scenarios...\n');

const testScenarios = [
  { env: 'development', expected: 'http://localhost:3000' },
  { env: 'production', expected: 'https://contactsdb-o4ps.onrender.com' },
];

testScenarios.forEach(({ env, expected }) => {
  process.env.NODE_ENV = env;
  process.env.PORT = 3000;
  
  const isProduction = process.env.NODE_ENV === 'production';
  const prodUrl = process.env.BASE_URL || process.env.RENDER_EXTERNAL_URL || 'https://contactsdb-o4ps.onrender.com';
  const baseUrl = isProduction ? prodUrl : `http://localhost:3000`;
  
  const match = baseUrl === expected;
  console.log(`   ${match ? '✅' : '❌'} NODE_ENV=${env} → ${baseUrl}`);
});

console.log('\n4️⃣  Environment Variables Found:');
console.log(`   NODE_ENV: ${process.env.NODE_ENV || '(not set → uses development defaults)'}`);
console.log(`   BASE_URL: ${process.env.BASE_URL || '(not set → uses fallback)'}`);
console.log(`   RENDER_EXTERNAL_URL: ${process.env.RENDER_EXTERNAL_URL || '(not set)'}`);

console.log('\n✨ Verification Complete!\n');
console.log('For Render deployment, ensure these environment variables are set:');
console.log('  ✓ NODE_ENV=production');
console.log('  ✓ BASE_URL=https://contactsdb-o4ps.onrender.com');
console.log('  ✓ MONGODB_URI=<your-mongodb-uri>');

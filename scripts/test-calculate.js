// Quick test script for /api/calculate endpoint with mixed formats
// Run with: node scripts/test-calculate.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testCalculateEndpoint() {
  console.log('🧪 Testing /api/calculate with ID-like names...\n');

  // Test Case: "khadaan flow 001" (spaces) matching "khadaan-flow-001" (hyphens)
  console.log('📤 Test: "khadaan flow 001" matching "khadaan-flow-001"');
  const request = {
    teamName: "khadaan",
    flowName: "khadaan flow 001", // User's requested format
    status_code: "200",
    body: "Testing ID matching with spaces"
  };
  
  console.log('   Request:', JSON.stringify(request, null, 2));
  
  let response = await fetch('http://localhost:3000/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request)
  });
  
  let result = await response.json();
  console.log('   Response:', JSON.stringify(result, null, 2));
  console.log('   ✅ Result:', result.success ? 'PASSED' : 'FAILED');

  if (result.success) {
    console.log(`   Matched Flow: ${result.result.flowName} (${result.result.flowId})`);
  }
}

testCalculateEndpoint().catch(console.error);

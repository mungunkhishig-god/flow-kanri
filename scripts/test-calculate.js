// Quick test script for /api/calculate endpoint with new format
// Run with: node scripts/test-calculate.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testCalculateEndpoint() {
  console.log('🧪 Testing /api/calculate with new format...\n');

  // Test Case 1: Success (200)
  console.log('📤 Test 1: Success case (status 200)');
  const successRequest = {
    teamName: "khadaan",
    flowName: "Daily Mining Report",
    status_code: "200",
    body: "All systems operational"
  };
  
  console.log('   Request:', JSON.stringify(successRequest, null, 2));
  
  let response = await fetch('http://localhost:3000/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(successRequest)
  });
  
  let result = await response.json();
  console.log('   Response:', JSON.stringify(result, null, 2));
  console.log('   ✅ Test 1:', result.success ? 'PASSED' : 'FAILED');
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test Case 2: Error (500)
  console.log('\n📤 Test 2: Error case (status 500)');
  const errorRequest = {
    teamName: "tenger",
    flowName: "Satellite Data",
    status_code: "500",
    body: "Connection timeout to satellite API - unable to retrieve data"
  };
  
  console.log('   Request:', JSON.stringify(errorRequest, null, 2));
  
  response = await fetch('http://localhost:3000/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorRequest)
  });
  
  result = await response.json();
  console.log('   Response:', JSON.stringify(result, null, 2));
  console.log('   ✅ Test 2:', result.success ? 'PASSED' : 'FAILED');
  
  // Wait a bit
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Test Case 3: 404 Error
  console.log('\n📤 Test 3: Not Found case (status 404)');
  const notFoundRequest = {
    teamName: "nomads",
    flowName: "Route Planning",
    status_code: "404",
    body: "Route data not found in database"
  };
  
  console.log('   Request:', JSON.stringify(notFoundRequest, null, 2));
  
  response = await fetch('http://localhost:3000/api/calculate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(notFoundRequest)
  });
  
  result = await response.json();
  console.log('   Response:', JSON.stringify(result, null, 2));
  console.log('   ✅ Test 3:', result.success ? 'PASSED' : 'FAILED');
  
  console.log('\n🎉 All tests completed!');
  console.log('👉 Check the UI at http://localhost:3000 to see the updates (within 5-10 seconds)');
}

testCalculateEndpoint().catch(console.error);

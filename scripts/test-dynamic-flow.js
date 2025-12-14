// Test script for dynamic flow creation / updates
// Run with: node scripts/test-dynamic-flow.js

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

async function testDynamicFlows() {
  console.log('🧪 Testing /api/calculate with dynamic flow creation...\n');

  // Test 1: Update existing flow (Success case)
  /*
  body: {
    status_code: '200',
    flowName: 'khadaan flow 001', // Should match existing
    teamName: 'khadaan',
    data: { status: '' }
  }
  */
  console.log('📤 Test 1: Update existing flow (200 OK)');
  
  const updateRequest = {
    status_code: '200',
    flowName: 'khadaan flow 001',
    teamName: 'khadaan',
    data: { status: '' }
  };
  
  await sendRequest(updateRequest);
  
  
  // Test 2: Create NEW flow (Success case)
  // "khadaan new process" does not exist seeded
  console.log('\n📤 Test 2: Create NEW flow');
  const createRequest = {
    status_code: '200',
    flowName: 'New Mining Process 2025',
    teamName: 'khadaan',
    data: { status: 'started' }
  };
  
  await sendRequest(createRequest);
  
  // Test 3: Update existing flow with ERROR
  /*
  body: {
    status_code: '400',
    flowName: 'khadaan flow 001',
    teamName: 'khadaan',
    data: {
      error: { code: 'ExitError', message: 'error: lorem ipsum  \r\n \r\n' }
    }
  }
  */
  console.log('\n📤 Test 3: Update flow with ERROR (400)');
  const errorRequest = {
    status_code: '400',
    flowName: 'khadaan flow 001',
    teamName: 'khadaan',
    data: {
       error: { code: 'ExitError', message: 'error: CRITICAL FAILURE detected' }
    }
  };
  
  await sendRequest(errorRequest);

}

async function sendRequest(body) {
    console.log('   Request:', JSON.stringify(body, null, 2));
    try {
        const response = await fetch('http://127.0.0.1:3005/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        
        const result = await response.json();
        console.log('   Response Status:', response.status);
        console.log('   Response Body:', JSON.stringify(result, null, 2));
        
        if (result.success) {
            console.log('   ✅ PASSED');
        } else {
            console.log('   ❌ FAILED');
        }
    } catch (e) {
        console.error("   ❌ Request Error:", e.message);
    }
}

testDynamicFlows().catch(console.error);

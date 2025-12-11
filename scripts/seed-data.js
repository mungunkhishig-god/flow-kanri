/**
 * MongoDB Data Seeding Script with Timestamps
 * Run this script to populate your MongoDB database with sample team data
 * 
 * Usage: node scripts/seed-data.js
 */

const { MongoClient } = require('mongodb');
require('dotenv').config({ path: '.env.local' });

// Helper to generate random dates - mostly today, some yesterday
function getRandomDate() {
  const now = new Date();
  const random = Math.random();
  
  // 70% chance of today, 30% chance of yesterday or older
  if (random < 0.7) {
    // Today - random time
    const hoursAgo = Math.floor(Math.random() * 24);
    const date = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    return date.toISOString();
  } else {
    // Yesterday or within last 7 days
    const daysAgo = Math.floor(Math.random() * 7) + 1;
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    return date.toISOString();
  }
}

const teams = [
  {
    name: "ハダーン",
    flows: [
      {
        id: "khadaan-flow-001",
        "flow-name": "Daily Mining Report",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: "khadaan-flow-002",
        "flow-name": "Equipment Status",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      }
    ]
  },
  {
    name: "ノマッズ",
    flows: [
      {
        id: "nomads-flow-001",
        "flow-name": "Travel Logistics",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: "nomads-flow-002",
        "flow-name": "Route Planning",
        "status-code": 404,
        "error-message": "Route data not found",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      }
    ]
  },
  {
    name: "テンゲル",
    flows: [
      {
        id: "tenger-flow-001",
        "flow-name": "Sky Monitoring",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: "tenger-flow-002",
        "flow-name": "Weather Analysis",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: "tenger-flow-003",
        "flow-name": "Satellite Data",
        "status-code": 500,
        "error-message": "Connection timeout to satellite API",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      }
    ]
  },
  {
    name: "カシミア",
    flows: [
      {
        id: "cashmere-flow-001",
        "flow-name": "Production Report",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: "cashmere-flow-002",
        "flow-name": "Quality Check",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      }
    ]
  },
  {
    name: "バヤン",
    flows: [
      {
        id: "bayan-flow-001",
        "flow-name": "Resource Allocation",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: "bayan-flow-002",
        "flow-name": "Budget Review",
        "status-code": 403,
        "error-message": "Access denied - insufficient permissions",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      },
      {
        id: "bayan-flow-003",
        "flow-name": "Financial Summary",
        "status-code": 200,
        "error-message": "",
        timestamp: getRandomDate(),
        lastUpdated: new Date().toISOString()
      }
    ]
  }
];

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI not found in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    console.log('🔌 Connecting to MongoDB...');
    await client.connect();
    console.log('✅ Connected successfully');

    const db = client.db('flow-kanri');
    const collection = db.collection('teams');

    // Clear existing data
    console.log('🗑️  Clearing existing teams...');
    await collection.deleteMany({});

    // Insert new data
    console.log('📝 Inserting team data with timestamps (70% today, 30% older)...');
    const result = await collection.insertMany(teams);
    
    console.log(`✅ Successfully inserted ${result.insertedCount} teams:`);
    teams.forEach((team, index) => {
      const todayCount = team.flows.filter(f => {
        const flowDate = new Date(f.timestamp);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return flowDate >= today;
      }).length;
      console.log(`   ${index + 1}. ${team.name} (${team.flows.length} flows, ${todayCount} today)`);
    });

    console.log('\n🎉 Database seeding completed!');
    console.log('👉 Run "yarn dev" and visit http://localhost:3000 to see your teams');
    console.log('👉 Dashboard shows only TODAY\'s flows');
    console.log('👉 Visit http://localhost:3000/logs to see ALL flows with filters');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('🔌 Connection closed');
  }
}

seedDatabase();

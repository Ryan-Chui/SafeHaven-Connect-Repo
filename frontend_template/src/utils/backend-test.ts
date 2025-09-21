import { api } from '../services/api';
import { Shelter, User } from '../types';

/**
 * Simple backend integration test
 * Run this to verify the backend is working correctly
 */
export async function testBackendIntegration(): Promise<boolean> {
  try {
    console.log('🧪 Testing backend integration...');

    // Test 1: Create a test shelter
    const testShelter: Shelter = {
      id: 'test-shelter-' + Date.now(),
      name: 'Test Emergency Shelter',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Test St, New York, NY'
      },
      capacity: {
        current: 25,
        maximum: 100
      },
      needs: {
        food: 3,
        water: 4,
        medicalSupplies: 2,
        blankets: 3,
        clothing: 1,
        other: 'Baby formula needed'
      },
      status: 'no-action',
      otherInformation: 'Test shelter for backend integration',
      lastUpdated: new Date().toISOString()
    };

    console.log('📝 Creating test shelter...');
    const createdShelter = await api.createShelter(testShelter);
    console.log('✅ Shelter created:', createdShelter.name);

    // Test 2: Create a test user
    const testUser: User = {
      id: 'test-user-' + Date.now(),
      name: 'Test Responder',
      type: 'responder',
      location: {
        latitude: 40.7589,
        longitude: -73.9851
      },
      address: 'Times Square, New York, NY'
    };

    console.log('👤 Creating test user...');
    const createdUser = await api.createUser(testUser);
    console.log('✅ User created:', createdUser.name);

    // Test 3: Fetch all shelters
    console.log('📋 Fetching all shelters...');
    const shelters = await api.getShelters();
    console.log(`✅ Found ${shelters.length} shelters`);

    // Test 4: Update shelter status
    console.log('🔄 Updating shelter status...');
    await api.updateShelterStatus(createdShelter.id, 'acknowledged');
    console.log('✅ Shelter status updated');

    // Test 5: Fetch all users
    console.log('👥 Fetching all users...');
    const users = await api.getUsers();
    console.log(`✅ Found ${users.length} users`);

    console.log('🎉 All backend tests passed!');
    return true;

  } catch (error) {
    console.error('❌ Backend test failed:', error);
    return false;
  }
}

/**
 * Test real-time subscriptions
 */
export function testRealTimeSubscriptions(): () => void {
  console.log('🔄 Testing real-time subscriptions...');
  
  let shelterCount = 0;
  let userCount = 0;

  const shelterSub = api.subscribeShelters((shelters) => {
    shelterCount = shelters.length;
    console.log(`📡 Real-time update: ${shelterCount} shelters`);
  });

  const userSub = api.subscribeUsers((users) => {
    userCount = users.length;
    console.log(`📡 Real-time update: ${userCount} users`);
  });

  // Return cleanup function
  return () => {
    shelterSub.unsubscribe();
    userSub.unsubscribe();
    console.log('🔌 Subscriptions cleaned up');
  };
}
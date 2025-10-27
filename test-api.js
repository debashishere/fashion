import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const test = async (name, fn) => {
  try {
    await fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
};

const runTests = async () => {
  console.log('🚀 Starting API Tests...\n');

  // Test 1: Health Check
  await test('Health Check', async () => {
    const response = await axios.get(`${API_BASE}/health`);
    if (!response.data.success) throw new Error('Health check failed');
  });

  // Test 2: User Registration
  await test('User Registration', async () => {
    const userData = {
      username: `testuser_${Date.now()}`,
      email: `test_${Date.now()}@example.com`,
      password: 'password123',
      fullName: 'Test User'
    };

    const response = await axios.post(`${API_BASE}/auth/register`, userData);
    if (!response.data.success) throw new Error('Registration failed');
    console.log(`   👤 User ID: ${response.data.data.user._id}`);
  });

  console.log('\n🎉 Basic tests completed!');
};

runTests().catch(console.error);
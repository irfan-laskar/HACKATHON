// Automated test suite for MarketSphere Backend APIs
const assert = require('assert');

const BASE_URL = 'http://localhost:5000/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const headers = { 'Content-Type': 'application/json', ...(options.headers || {}) };
  const res = await fetch(url, { ...options, headers });
  const data = await res.json();
  return { status: res.status, data };
}

async function runTests() {
  console.log('🧪 Starting MarketSphere Comprehensive Test Suite...\n');
  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ FAIL: ${name}`);
      console.error(`     Error: ${err.message}`);
      failed++;
    }
  }

  // 1. Health check
  await test('GET /health returns online status', async () => {
    const { status, data } = await request('/health');
    assert.strictEqual(status, 200);
    assert.strictEqual(data.status, 'online');
  });

  // 2. Categories
  await test('GET /categories returns 10 educational categories', async () => {
    const { status, data } = await request('/categories');
    assert.strictEqual(status, 200);
    assert(Array.isArray(data.categories));
    assert(data.categories.length >= 10);
  });

  // 3. Articles retrieval & filter
  await test('GET /articles returns educational articles', async () => {
    const { status, data } = await request('/articles');
    assert.strictEqual(status, 200);
    assert(data.articles.length > 0);
    assert(data.articles[0].title);
    assert(data.articles[0].slug);
  });

  // 4. Article slug retrieval
  await test('GET /articles/:slug returns article with checklists and related', async () => {
    const { status, data } = await request('/articles/marketing-fundamentals-4ps-7ps-stp-framework');
    assert.strictEqual(status, 200);
    assert(data.article);
    assert.strictEqual(data.article.slug, 'marketing-fundamentals-4ps-7ps-stp-framework');
    assert(Array.isArray(data.article.checklists));
    assert(Array.isArray(data.related));
  });

  // 5. Video platform retrieval
  await test('GET /videos returns educational video library', async () => {
    const { status, data } = await request('/videos');
    assert.strictEqual(status, 200);
    assert(data.videos.length >= 6);
    assert(data.videos[0].videoUrl);
  });

  // 6. Video watch details
  await test('GET /videos/:slug returns video with learning objectives', async () => {
    const { status, data } = await request('/videos/mastering-4ps-marketing-real-case-studies');
    assert.strictEqual(status, 200);
    assert(data.video);
    assert(data.video.creator);
    assert(Array.isArray(data.video.learningObjectives));
  });

  // 7. Global Search
  await test('GET /search?q=marketing returns multi-category results', async () => {
    const { status, data } = await request('/search?q=marketing');
    assert.strictEqual(status, 200);
    assert(data.totalCount > 0);
    assert(data.results.articles.length > 0 || data.results.videos.length > 0);
  });

  // 8. Search Auto-complete Suggestions
  await test('GET /search/suggestions?q=mark returns quick suggestions', async () => {
    const { status, data } = await request('/search/suggestions?q=mark');
    assert.strictEqual(status, 200);
    assert(Array.isArray(data.suggestions));
    assert(data.suggestions.length > 0);
  });

  // 8b. Direct YouTube Search Integration
  await test('GET /search/youtube?q=marketing returns YouTube video results', async () => {
    const { status, data } = await request('/search/youtube?q=marketing');
    assert.strictEqual(status, 200);
    assert(Array.isArray(data.videos));
    assert(data.videos.length > 0);
    assert(data.videos[0].videoUrl);
    assert(data.videos[0].embedUrl);
  });

  // 8c. Universal Knowledge Brief Search
  await test('GET /search/knowledge?q=marketing returns encyclopedic knowledge brief', async () => {
    const { status, data } = await request('/search/knowledge?q=marketing');
    assert.strictEqual(status, 200);
    assert(data.success);
    if (data.knowledge) {
      assert(data.knowledge.title);
      assert(data.knowledge.extract);
    }
  });

  // 9. Auth Registration
  const testUserEmail = `test.founder.${Date.now()}@example.com`;
  let userToken = '';
  await test('POST /auth/register creates new learner account', async () => {
    const { status, data } = await request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Test Founder',
        email: testUserEmail,
        password: 'password123',
        role: 'user',
      }),
    });
    assert([200, 201].includes(status));
    assert(data.token);
    userToken = data.token;
  });

  // 10. Auth Login
  await test('POST /auth/login validates credentials and issues JWT', async () => {
    const { status, data } = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: testUserEmail,
        password: 'password123',
      }),
    });
    assert.strictEqual(status, 200);
    assert(data.token);
  });

  // 11. Auth Me
  await test('GET /auth/me returns authenticated profile with token', async () => {
    const { status, data } = await request('/auth/me', {
      headers: { Authorization: `Bearer ${userToken}` },
    });
    assert.strictEqual(status, 200);
    assert.strictEqual(data.user.email, testUserEmail);
  });

  // 12. Interactions: Like content
  await test('POST /interactions/like toggles like on article', async () => {
    const { status, data } = await request('/interactions/like', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        targetType: 'article',
        targetId: '661100000000000000000001',
      }),
    });
    assert.strictEqual(status, 200);
    assert.strictEqual(typeof data.isLiked, 'boolean');
  });

  // 13. Interactions: Post Comment
  await test('POST /interactions/comments posts discussion comment', async () => {
    const { status, data } = await request('/interactions/comments', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        targetType: 'article',
        targetId: '661100000000000000000001',
        content: 'Automated test suite verifying discussion forum functionality.',
      }),
    });
    assert([200, 201].includes(status));
    assert(data.comment);
  });

  // 14. Interactions: Report Content to Moderation
  await test('POST /interactions/report submits flag to moderation queue', async () => {
    const { status, data } = await request('/interactions/report', {
      method: 'POST',
      headers: { Authorization: `Bearer ${userToken}` },
      body: JSON.stringify({
        targetType: 'video',
        targetId: '662200000000000000000001',
        reason: 'not_educational',
        details: 'Automated quality assurance test of reporting queue.',
      }),
    });
    assert([200, 201].includes(status));
    assert(data.report);
  });

  // 15. Admin Portal Stats & Access
  let adminToken = '';
  await test('POST /auth/login with Admin credentials', async () => {
    const { status, data } = await request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        email: 'admin@marketsphere.com',
        password: 'admin123456',
      }),
    });
    assert.strictEqual(status, 200);
    assert(data.token);
    assert.strictEqual(data.user.role, 'admin');
    adminToken = data.token;
  });

  await test('GET /admin/stats returns platform aggregation metrics', async () => {
    const { status, data } = await request('/admin/stats', {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    assert.strictEqual(status, 200);
    assert(data.stats);
    assert(data.stats.totalUsers > 0);
  });

  // 16. User Feedback Endpoints
  let createdFeedbackId = '';
  await test('GET /feedback returns public feedback wall and metrics', async () => {
    const { status, data } = await request('/feedback');
    assert.strictEqual(status, 200);
    assert(Array.isArray(data.feedbacks));
    assert(data.stats);
    assert(typeof data.stats.averageRating === 'number');
  });

  await test('POST /feedback submits new restaurateur feedback', async () => {
    const { status, data } = await request('/feedback', {
      method: 'POST',
      body: JSON.stringify({
        name: 'Kabir Oberoi',
        email: 'kabir@biryanibox.in',
        restaurantName: 'Biryani Box & Co.',
        businessType: 'Cloud Kitchen',
        category: 'tool_suggestion',
        rating: 5,
        title: 'Include packaging weight tare in recipe cards',
        message: 'It would be super helpful to automatically include corrugated box tare weights in food cost calculations.',
        tags: ['Packaging', 'Cloud Kitchen'],
      }),
    });
    assert.strictEqual(status, 201);
    assert(data.success);
    assert(data.feedback);
    assert.strictEqual(data.feedback.title, 'Include packaging weight tare in recipe cards');
    createdFeedbackId = data.feedback._id;
  });

  await test('POST /feedback/:id/upvote toggles endorsement upvote', async () => {
    assert(createdFeedbackId, 'Feedback ID should be defined');
    const { status, data } = await request(`/feedback/${createdFeedbackId}/upvote`, {
      method: 'POST',
      body: JSON.stringify({ voterId: 'test_runner_user' }),
    });
    assert.strictEqual(status, 200);
    assert.strictEqual(data.hasUpvoted, true);
    assert.strictEqual(data.upvotes, 1);
  });

  console.log(`\n========================================`);
  console.log(`📊 Test Results: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});

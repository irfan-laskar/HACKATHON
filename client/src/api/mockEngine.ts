import { mockUsers, mockCategories, mockArticles, mockVideos, mockReports } from './mockData';
import { User, Article, Video, Comment } from '../types';

// Helper to retrieve registered users from local storage
const getRegisteredUsers = (): (User & { password?: string })[] => {
  try {
    const raw = localStorage.getItem('ms_registered_users');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveRegisteredUser = (user: User & { password?: string }) => {
  try {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('ms_registered_users', JSON.stringify(users));
  } catch {}
};

const getCurrentMockUser = (): User | null => {
  try {
    const raw = localStorage.getItem('ms_current_user');
    if (raw) return JSON.parse(raw);
    const token = localStorage.getItem('token');
    if (token) {
      if (token.includes('admin')) return mockUsers[0];
      if (token.includes('creator')) return mockUsers[1];
      if (token.includes('user')) return mockUsers[4];
    }
    return null;
  } catch {
    return null;
  }
};

export const handleMockRequest = (config: any): any => {
  const url: string = config.url || '';
  const method: string = (config.method || 'get').toLowerCase();
  let data: any = {};

  try {
    if (typeof config.data === 'string' && config.data.trim()) {
      data = JSON.parse(config.data);
    } else if (typeof config.data === 'object' && config.data !== null) {
      data = config.data;
    }
  } catch {}

  const cleanPath = url.replace(/^[a-zA-Z]+:\/\/[^/]+/, '').replace(/^\/api/, '');

  console.log(`[MarketSphere Demo Fallback] Intercepted: ${method.toUpperCase()} ${cleanPath}`);

  // 1. AUTH: LOGIN
  if (cleanPath.startsWith('/auth/login') && method === 'post') {
    const email = (data.email || '').toLowerCase().trim();
    const password = data.password || '';

    const allUsers = [...mockUsers, ...getRegisteredUsers()];
    const found = allUsers.find(
      (u) => u.email.toLowerCase() === email && (u.password === password || !u.password)
    );

    if (found) {
      const userSafe: User = {
        _id: found._id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar,
        bio: found.bio,
        channelName: found.channelName,
        website: found.website,
        followersCount: found.followersCount || 0,
        followingCount: found.followingCount || 0,
        isVerified: found.isVerified ?? true,
      };

      const token = `ms_demo_token_${found.role}_${found._id}`;
      localStorage.setItem('ms_current_user', JSON.stringify(userSafe));

      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: {
          success: true,
          message: 'Welcome back to MarketSphere (Demo Resilient Mode)!',
          token,
          user: userSafe,
        },
      };
    }

    // Invalid credentials
    const err: any = new Error('Invalid email or password.');
    err.response = {
      status: 401,
      statusText: 'Unauthorized',
      data: { success: false, message: 'Invalid email or password. Please check your credentials.' },
      headers: {},
      config,
    };
    throw err;
  }

  // 2. AUTH: CURRENT USER (ME)
  if (cleanPath.startsWith('/auth/me') && method === 'get') {
    const user = getCurrentMockUser();
    if (user) {
      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: {
          success: true,
          user,
        },
      };
    }

    const err: any = new Error('Not authenticated.');
    err.response = {
      status: 401,
      statusText: 'Unauthorized',
      data: { success: false, message: 'Please log in to continue.' },
      headers: {},
      config,
    };
    throw err;
  }

  // 3. AUTH: REGISTER
  if (cleanPath.startsWith('/auth/register') && method === 'post') {
    const role = data.role === 'creator' ? 'creator' : 'user';
    const newUser: User & { password?: string } = {
      _id: `user_${Date.now()}`,
      name: data.name || 'New Learner',
      email: (data.email || '').toLowerCase().trim(),
      password: data.password || 'password123',
      role,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      bio: data.bio || (role === 'creator' ? 'Educational Creator on MarketSphere' : 'Learner & Entrepreneur on MarketSphere'),
      channelName: data.channelName || (role === 'creator' ? `${data.name}'s Academy` : undefined),
      followersCount: 0,
      followingCount: 0,
      isVerified: false,
    };

    saveRegisteredUser(newUser);
    const token = `ms_demo_token_${newUser.role}_${newUser._id}`;
    localStorage.setItem('ms_current_user', JSON.stringify(newUser));

    return {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        message: 'Account created successfully! Welcome to MarketSphere.',
        token,
        user: newUser,
      },
    };
  }

  // 4. AUTH: LOGOUT
  if (cleanPath.startsWith('/auth/logout') && method === 'post') {
    localStorage.removeItem('ms_current_user');
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, message: 'Logged out successfully.' },
    };
  }

  // 5. AUTH: BECOME CREATOR
  if (cleanPath.startsWith('/auth/become-creator') && method === 'post') {
    const cur = getCurrentMockUser();
    if (cur) {
      cur.role = 'creator';
      cur.channelName = data.channelName || `${cur.name}'s Academy`;
      cur.bio = data.bio || cur.bio;
      localStorage.setItem('ms_current_user', JSON.stringify(cur));
      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: { success: true, user: cur },
      };
    }
  }

  // 6. CATEGORIES
  if (cleanPath.startsWith('/categories') && method === 'get') {
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        categories: mockCategories,
      },
    };
  }

  // 7. ARTICLES
  if (cleanPath.startsWith('/articles') && method === 'get') {
    const slugMatch = cleanPath.match(/\/articles\/([a-zA-Z0-9_-]+)/);
    if (slugMatch && slugMatch[1] && !cleanPath.includes('?')) {
      const slug = slugMatch[1];
      const article = mockArticles.find((a) => a.slug === slug || a._id === slug) || mockArticles[0];
      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: {
          success: true,
          article,
          related: mockArticles.filter((a) => a._id !== article._id).slice(0, 3),
        },
      };
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        articles: mockArticles,
        total: mockArticles.length,
      },
    };
  }

  // 8. VIDEOS
  if (cleanPath.startsWith('/videos/creator/dashboard') && method === 'get') {
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        stats: {
          totalViews: 16940,
          totalLikes: 1410,
          totalComments: 104,
          videoCount: mockVideos.length,
        },
        videos: mockVideos,
      },
    };
  }

  if (cleanPath.startsWith('/videos') && method === 'get') {
    const slugMatch = cleanPath.match(/\/videos\/([a-zA-Z0-9_-]+)/);
    if (slugMatch && slugMatch[1] && !cleanPath.includes('?')) {
      const slug = slugMatch[1];
      const video = mockVideos.find((v) => v.slug === slug || v._id === slug) || mockVideos[0];
      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: {
          success: true,
          video,
          relatedVideos: mockVideos.filter((v) => v._id !== video._id).slice(0, 3),
        },
      };
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        videos: mockVideos,
        total: mockVideos.length,
      },
    };
  }

  // 9. SEARCH
  if (cleanPath.startsWith('/search') && method === 'get') {
    if (cleanPath.includes('/suggestions')) {
      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: {
          success: true,
          suggestions: [
            'Marketing Fundamentals 4Ps',
            'Smartphone Photography Lighting',
            'Business Registration GST India',
            'Influencer Collaboration Pitch',
            '12-Step Startup Roadmap',
          ],
        },
      };
    }

    if (cleanPath.includes('/youtube')) {
      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: {
          success: true,
          videos: [
            {
              id: 'youtube_1',
              title: 'Marketing 101: Understanding Customer Psychology & Value',
              description: 'Comprehensive breakdown of customer value proposition and positioning.',
              thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80',
              channelTitle: 'MarketSphere Academy',
              publishedAt: '2026-01-15T00:00:00Z',
              videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
              embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
            },
          ],
        },
      };
    }

    if (cleanPath.includes('/knowledge')) {
      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: {
          success: true,
          knowledge: {
            query: 'Marketing',
            title: 'Marketing Strategy & Commerce',
            extract: 'Marketing is the process of exploring, creating, and delivering value to meet the needs of a target market in terms of goods and services.',
            relatedTopics: ['Product Strategy', 'Brand Architecture', 'Sales Funnels', 'Customer Lifetime Value'],
            keyTakeaways: [
              'Align Product, Price, Place, and Promotion with consumer demand.',
              'Build sustainable gross margins before investing in paid advertising.',
              'Establish strong brand positioning to avoid competing solely on price.',
            ],
          },
        },
      };
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        results: {
          articles: mockArticles,
          videos: mockVideos,
          categories: mockCategories,
        },
      },
    };
  }

  // 10. ADMIN DASHBOARD
  if (cleanPath.startsWith('/admin/stats') && method === 'get') {
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        stats: {
          totalUsers: 48,
          totalArticles: mockArticles.length,
          totalVideos: mockVideos.length,
          totalViews: 45280,
          pendingReports: 2,
        },
      },
    };
  }

  if (cleanPath.startsWith('/admin/users') && method === 'get') {
    const allUsers = [...mockUsers, ...getRegisteredUsers()];
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        users: allUsers,
      },
    };
  }

  if (cleanPath.startsWith('/admin/reports') && method === 'get') {
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        reports: mockReports,
      },
    };
  }

  if (cleanPath.includes('/role') && method === 'put') {
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, message: 'User role updated successfully.' },
    };
  }

  if (cleanPath.includes('/suspend') && method === 'put') {
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, message: 'User suspension status updated.' },
    };
  }

  if (cleanPath.includes('/resolve') && method === 'put') {
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, message: 'Report resolved successfully.' },
    };
  }

  // 11. INTERACTIONS: LIKES & COMMENTS
  if (cleanPath.startsWith('/interactions/like') && method === 'post') {
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, isLiked: true, likesCount: 42 },
    };
  }

  if (cleanPath.startsWith('/interactions/comments') && method === 'get') {
    const sampleComments: Comment[] = [
      {
        _id: 'comm_01',
        user: mockUsers[4],
        targetType: 'article',
        targetId: 'art_01',
        content: 'This 4Ps breakdown cleared up so many misconceptions I had about pricing my home spice kits!',
        likesCount: 8,
        createdAt: '2026-02-14T10:00:00Z',
      },
      {
        _id: 'comm_02',
        user: mockUsers[1],
        targetType: 'article',
        targetId: 'art_01',
        content: 'Glad it helped Vikram! Focus on preserving a 50%+ gross margin on the packaging early on.',
        likesCount: 5,
        createdAt: '2026-02-14T12:30:00Z',
      },
    ];

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, comments: sampleComments },
    };
  }

  if (cleanPath.startsWith('/interactions/comments') && method === 'post') {
    const cur = getCurrentMockUser() || mockUsers[4];
    const newComm: Comment = {
      _id: `comm_${Date.now()}`,
      user: cur,
      targetType: data.targetType || 'article',
      targetId: data.targetId || 'art_01',
      content: data.content || '',
      likesCount: 0,
      createdAt: new Date().toISOString(),
    };

    return {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, comment: newComm },
    };
  }

  if (cleanPath.startsWith('/interactions/report') && method === 'post') {
    return {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, message: 'Report submitted to moderation queue.' },
    };
  }

  // DEFAULT FALLBACK
  return {
    status: 200,
    statusText: 'OK',
    headers: { 'content-type': 'application/json' },
    config,
    data: { success: true, message: 'Action completed (Demo Mode).' },
  };
};

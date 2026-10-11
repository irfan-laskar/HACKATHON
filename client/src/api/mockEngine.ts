import { mockUsers, mockCategories, mockArticles, mockVideos, mockReports, mockFeedbacks } from './mockData';
import { User, Article, Video, Comment, Feedback } from '../types';

// Helper to retrieve and persist feedbacks
const getStoredFeedbacks = (): Feedback[] => {
  try {
    const raw = localStorage.getItem('ms_user_feedbacks');
    if (raw) return JSON.parse(raw);
    localStorage.setItem('ms_user_feedbacks', JSON.stringify(mockFeedbacks));
    return [...mockFeedbacks];
  } catch {
    return [...mockFeedbacks];
  }
};

const saveStoredFeedbacks = (feedbacks: Feedback[]) => {
  try {
    localStorage.setItem('ms_user_feedbacks', JSON.stringify(feedbacks));
  } catch {}
};

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

  console.log(`[Scaletrix Demo Fallback] Intercepted: ${method.toUpperCase()} ${cleanPath}`);

  // 1. AUTH: LOGIN
  if (cleanPath.startsWith('/auth/login') && method === 'post') {
    const rawEmail = (data.email || '').toLowerCase().trim();
    const email = rawEmail.replace(/@marketsphere\.com$/, '@scaletrix.com');
    const password = data.password || '';

    const allUsers = [...mockUsers, ...getRegisteredUsers()];
    const found = allUsers.find(
      (u) => (u.email.toLowerCase() === email || u.email.toLowerCase() === rawEmail) && (u.password === password || !u.password)
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
          message: 'Welcome back to Scaletrix (Demo Resilient Mode)!',
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
      bio: data.bio || (role === 'creator' ? 'Educational Creator on Scaletrix' : 'Learner & Entrepreneur on Scaletrix'),
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
        message: 'Account created successfully! Welcome to Scaletrix.',
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
              channelTitle: 'Scaletrix Academy',
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

  // 12. FEEDBACK ENDPOINTS
  if ((cleanPath === '/feedback' || cleanPath.startsWith('/feedback?')) && method === 'get') {
    const urlParams = new URLSearchParams(cleanPath.includes('?') ? cleanPath.split('?')[1] : '');
    const category = urlParams.get('category');
    const rating = urlParams.get('rating');
    const search = urlParams.get('search');
    const sort = urlParams.get('sort') || 'recent';
    const page = parseInt(urlParams.get('page') || '1', 10);
    const limit = parseInt(urlParams.get('limit') || '12', 10);

    let list = getStoredFeedbacks().filter((fb) => fb.isPublic !== false);

    if (category && category !== 'all') {
      list = list.filter((fb) => fb.category === category);
    }
    if (rating && rating !== 'all') {
      list = list.filter((fb) => fb.rating === Number(rating));
    }
    if (search && search.trim()) {
      const term = search.trim().toLowerCase();
      list = list.filter(
        (fb) =>
          fb.title.toLowerCase().includes(term) ||
          fb.message.toLowerCase().includes(term) ||
          fb.restaurantName?.toLowerCase().includes(term) ||
          fb.tags?.some((t) => t.toLowerCase().includes(term))
      );
    }

    if (sort === 'top') {
      list.sort((a, b) => b.upvotes - a.upvotes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sort === 'rating') {
      list.sort((a, b) => b.rating - a.rating || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    const allPublic = getStoredFeedbacks().filter((fb) => fb.isPublic !== false);
    const totalCount = list.length;
    const paginated = list.slice((page - 1) * limit, page * limit);
    const sum = allPublic.reduce((acc, curr) => acc + curr.rating, 0);
    const averageRating = allPublic.length > 0 ? Number((sum / allPublic.length).toFixed(1)) : 5.0;

    const categoryCounts: Record<string, number> = {};
    const statusCounts: Record<string, number> = { new: 0, reviewed: 0, planned: 0, completed: 0 };
    allPublic.forEach((fb) => {
      categoryCounts[fb.category] = (categoryCounts[fb.category] || 0) + 1;
      if (fb.status in statusCounts) {
        statusCounts[fb.status] = (statusCounts[fb.status] || 0) + 1;
      }
    });

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        feedbacks: paginated,
        page,
        totalPages: Math.ceil(totalCount / limit),
        totalCount,
        stats: {
          averageRating,
          totalFeedbacks: allPublic.length,
          categoryCounts,
          statusCounts,
        },
      },
    };
  }

  if (cleanPath === '/feedback' && method === 'post') {
    const cur = getCurrentMockUser();
    const feedbacks = getStoredFeedbacks();
    const newFb: Feedback = {
      _id: `fb_${Date.now()}`,
      user: cur || undefined,
      name: data.name?.trim() || cur?.name || 'Anonymous Restaurateur',
      email: data.email?.trim() || cur?.email || '',
      restaurantName: data.restaurantName?.trim() || '',
      businessType: data.businessType || 'Casual Dine-in',
      category: data.category || 'general',
      rating: Math.max(1, Math.min(5, Number(data.rating) || 5)),
      title: data.title?.trim() || 'Valuable Feedback',
      message: data.message?.trim() || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      status: 'new',
      upvotes: 0,
      upvotedBy: [],
      adminResponse: '',
      isPublic: data.isPublic !== false,
      createdAt: new Date().toISOString(),
    };

    feedbacks.unshift(newFb);
    saveStoredFeedbacks(feedbacks);

    return {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        message: 'Thank you for your valuable feedback! It has been received.',
        feedback: newFb,
      },
    };
  }

  if (cleanPath.includes('/feedback/') && cleanPath.endsWith('/upvote') && method === 'post') {
    const id = cleanPath.split('/feedback/')[1].replace('/upvote', '');
    const feedbacks = getStoredFeedbacks();
    const fb = feedbacks.find((f) => f._id === id);
    let upvotes = 0;
    let hasUpvoted = false;

    if (fb) {
      const cur = getCurrentMockUser();
      const voterId = cur?._id || 'anon_voter';
      if (!fb.upvotedBy) fb.upvotedBy = [];

      const idx = fb.upvotedBy.indexOf(voterId);
      if (idx > -1) {
        fb.upvotedBy.splice(idx, 1);
        fb.upvotes = Math.max(0, (fb.upvotes || 0) - 1);
        hasUpvoted = false;
      } else {
        fb.upvotedBy.push(voterId);
        fb.upvotes = (fb.upvotes || 0) + 1;
        hasUpvoted = true;
      }
      upvotes = fb.upvotes;
      saveStoredFeedbacks(feedbacks);
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, upvotes, hasUpvoted },
    };
  }

  if ((cleanPath === '/feedback/admin/all' || cleanPath.startsWith('/feedback/admin/all?')) && method === 'get') {
    const list = getStoredFeedbacks();
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        feedbacks: list,
        page: 1,
        totalPages: 1,
        totalCount: list.length,
      },
    };
  }

  if (cleanPath.startsWith('/feedback/admin/') && method === 'put') {
    const id = cleanPath.split('/feedback/admin/')[1];
    const feedbacks = getStoredFeedbacks();
    const fb = feedbacks.find((f) => f._id === id);
    if (fb) {
      if (data.status) fb.status = data.status;
      if (typeof data.adminResponse === 'string') fb.adminResponse = data.adminResponse;
      if (typeof data.isPublic === 'boolean') fb.isPublic = data.isPublic;
      fb.updatedAt = new Date().toISOString();
      saveStoredFeedbacks(feedbacks);
    }
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: { success: true, message: 'Feedback updated successfully.', feedback: fb },
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

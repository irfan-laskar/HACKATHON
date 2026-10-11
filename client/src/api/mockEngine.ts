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

const getCustomVideos = (): Video[] => {
  try {
    const raw = localStorage.getItem('ms_uploaded_videos');
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
};

const saveCustomVideo = (video: Video) => {
  try {
    const current = getCustomVideos();
    const updated = [video, ...current.filter((v) => v._id !== video._id)];
    localStorage.setItem('ms_uploaded_videos', JSON.stringify(updated));
  } catch {}
};

const removeCustomVideo = (videoId: string) => {
  try {
    const current = getCustomVideos();
    const updated = current.filter((v) => v._id !== videoId);
    localStorage.setItem('ms_uploaded_videos', JSON.stringify(updated));
    const raw = localStorage.getItem('ms_deleted_video_ids');
    const deleted: string[] = raw ? JSON.parse(raw) : [];
    if (!deleted.includes(videoId)) {
      deleted.push(videoId);
      localStorage.setItem('ms_deleted_video_ids', JSON.stringify(deleted));
    }
  } catch {}
};

const getAllVideos = (): Video[] => {
  const custom = getCustomVideos();
  const deletedIds: string[] = (() => {
    try {
      const raw = localStorage.getItem('ms_deleted_video_ids');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  })();
  const filteredMock = mockVideos.filter((v) => !deletedIds.includes(v._id));
  return [...custom, ...filteredMock];
};

const slugifyVideo = (text: string): string => {
  return (
    text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-') +
    '-' +
    Math.floor(1000 + Math.random() * 9000)
  );
};

const getYouTubeVideoId = (url: string): string | null => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
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

  // 8. VIDEOS: CREATOR DASHBOARD
  if (cleanPath.startsWith('/videos/creator/dashboard') && method === 'get') {
    const allVids = getAllVideos();
    const totalViews = allVids.reduce((acc, v) => acc + (v.viewsCount || 0), 0);
    const totalLikes = allVids.reduce((acc, v) => acc + (v.likesCount || 0), 0);
    const totalComments = allVids.reduce((acc, v) => acc + (v.commentsCount || 0), 0);

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        stats: {
          totalVideos: allVids.length,
          totalViews,
          totalLikes,
          totalComments,
        },
        videos: allVids,
      },
    };
  }

  // 8. VIDEOS: UPLOAD & PUBLISH (Support both POST /videos and POST /videos/upload)
  if ((cleanPath === '/videos' || cleanPath === '/videos/' || cleanPath.startsWith('/videos/upload')) && method === 'post') {
    let title = '';
    let description = '';
    let category = 'Digital Marketing';
    let duration = '10:00';
    let tags: string[] = [];
    let learningObjectives: string[] = [];
    let videoUrl = '';
    let thumbnailUrl = '';

    if (config.data instanceof FormData) {
      title = (config.data.get('title') as string) || '';
      description = (config.data.get('description') as string) || '';
      category = (config.data.get('category') as string) || 'Digital Marketing';
      duration = (config.data.get('duration') as string) || '10:00';
      const rawTags = (config.data.get('tags') as string) || '';
      tags = rawTags.split(',').map((t) => t.trim()).filter(Boolean);
      const rawObjectives = (config.data.get('learningObjectives') as string) || '';
      learningObjectives = rawObjectives.split('\n').map((o) => o.trim()).filter(Boolean);

      const videoFile = config.data.get('video');
      const manualVideoUrl = (config.data.get('videoUrl') as string) || '';
      if (videoFile instanceof File && typeof window !== 'undefined' && window.URL) {
        videoUrl = window.URL.createObjectURL(videoFile);
      } else if (manualVideoUrl) {
        videoUrl = manualVideoUrl.trim();
      }

      const thumbnailFile = config.data.get('thumbnail');
      const manualThumbnailUrl = (config.data.get('thumbnailUrl') as string) || '';
      if (thumbnailFile instanceof File && typeof window !== 'undefined' && window.URL) {
        thumbnailUrl = window.URL.createObjectURL(thumbnailFile);
      } else if (manualThumbnailUrl) {
        thumbnailUrl = manualThumbnailUrl.trim();
      }
    } else if (data) {
      title = data.title || '';
      description = data.description || '';
      category = data.category || 'Digital Marketing';
      duration = data.duration || '10:00';
      tags = Array.isArray(data.tags)
        ? data.tags
        : typeof data.tags === 'string'
        ? data.tags.split(',').map((t: string) => t.trim()).filter(Boolean)
        : [];
      learningObjectives = Array.isArray(data.learningObjectives)
        ? data.learningObjectives
        : typeof data.learningObjectives === 'string'
        ? data.learningObjectives.split('\n').map((o: string) => o.trim()).filter(Boolean)
        : [];
      videoUrl = data.videoUrl || '';
      thumbnailUrl = data.thumbnailUrl || '';
    }

    if (!videoUrl) {
      videoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    }

    // Auto-detect YouTube thumbnail if not provided
    const ytId = getYouTubeVideoId(videoUrl);
    if (ytId && !thumbnailUrl) {
      thumbnailUrl = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    } else if (!thumbnailUrl) {
      thumbnailUrl = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';
    }

    const currentUser = getCurrentMockUser() || mockUsers[1];
    const newVideo: Video = {
      _id: `vid_${Date.now()}`,
      title: title || 'Untitled Educational Masterclass',
      slug: slugifyVideo(title || `video-${Date.now()}`),
      description: description || 'Educational lesson shared with the Scaletrix community.',
      videoUrl,
      thumbnailUrl,
      duration: duration || '10:00',
      category,
      tags: tags.length > 0 ? tags : ['Educational', category],
      creator: {
        _id: currentUser._id,
        name: currentUser.name,
        email: currentUser.email || 'creator@scaletrix.com',
        role: currentUser.role || 'creator',
        avatar: currentUser.avatar,
        channelName: currentUser.channelName || currentUser.name,
        isVerified: Boolean(currentUser.isVerified),
        followersCount: currentUser.followersCount || 0,
      },
      viewsCount: 1,
      likesCount: 0,
      commentsCount: 0,
      status: 'published',
      isFeatured: false,
      learningObjectives,
      createdAt: new Date().toISOString(),
    };

    saveCustomVideo(newVideo);

    return {
      status: 201,
      statusText: 'Created',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        message: 'Educational video published successfully!',
        video: newVideo,
      },
    };
  }

  // 8. VIDEOS: DELETE
  if (cleanPath.match(/\/videos\/([a-zA-Z0-9_-]+)/) && method === 'delete') {
    const match = cleanPath.match(/\/videos\/([a-zA-Z0-9_-]+)/);
    const videoId = match ? match[1] : '';
    if (videoId) {
      removeCustomVideo(videoId);
    }
    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        message: 'Video deleted successfully.',
      },
    };
  }

  // 8. VIDEOS: GET SINGLE & GET LIST
  if (cleanPath.startsWith('/videos') && method === 'get') {
    const allVids = getAllVideos();
    const slugMatch = cleanPath.match(/\/videos\/([a-zA-Z0-9_-]+)/);

    if (slugMatch && slugMatch[1] && !cleanPath.includes('?') && slugMatch[1] !== 'creator') {
      const slug = slugMatch[1];
      const video = allVids.find((v) => v.slug === slug || v._id === slug) || allVids[0];
      return {
        status: 200,
        statusText: 'OK',
        headers: { 'content-type': 'application/json' },
        config,
        data: {
          success: true,
          video,
          related: allVids.filter((v) => v._id !== video._id).slice(0, 4),
          relatedVideos: allVids.filter((v) => v._id !== video._id).slice(0, 4),
        },
      };
    }

    // Listing with search, category & sorting
    const urlObj = new URL(url.startsWith('http') ? url : `http://localhost${url}`);
    const categoryParam = urlObj.searchParams.get('category');
    const searchParam = urlObj.searchParams.get('search');
    const sortParam = urlObj.searchParams.get('sort');

    let filtered = allVids.filter((v) => v.status === 'published');

    if (categoryParam && categoryParam !== 'All') {
      filtered = filtered.filter(
        (v) => v.category.toLowerCase() === categoryParam.toLowerCase()
      );
    }

    if (searchParam) {
      const s = searchParam.toLowerCase();
      filtered = filtered.filter(
        (v) =>
          v.title.toLowerCase().includes(s) ||
          v.description.toLowerCase().includes(s) ||
          (v.tags && v.tags.some((t) => t.toLowerCase().includes(s)))
      );
    }

    if (sortParam === 'likes') {
      filtered.sort((a, b) => b.likesCount - a.likesCount);
    } else if (sortParam === 'popular') {
      filtered.sort((a, b) => b.viewsCount - a.viewsCount);
    } else if (sortParam === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    } else {
      filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }

    return {
      status: 200,
      statusText: 'OK',
      headers: { 'content-type': 'application/json' },
      config,
      data: {
        success: true,
        videos: filtered,
        total: filtered.length,
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

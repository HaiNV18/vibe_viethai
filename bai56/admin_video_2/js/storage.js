/**
 * Storage Manager - Unified Supabase Cloud & Local Persistence
 */

const Storage = {
  KEYS: {
    USERS: 'video_admin_users',
    VIDEOS: 'video_admin_videos',
    CATEGORIES: 'video_admin_categories',
    VIEWS: 'video_admin_video_views',
    CURRENT_USER: 'video_admin_current_user',
    LEGACY_CURRENT_USER: 'currentUser'
  },

  get client() {
    if (!window.supabaseClient && typeof window.supabase !== 'undefined' && window.SUPABASE_CONFIG) {
      try {
        window.supabaseClient = window.supabase.createClient(
          window.SUPABASE_CONFIG.url, 
          window.SUPABASE_CONFIG.anonKey
        );
      } catch (e) {
        console.warn('[Storage] Supabase client init error:', e);
      }
    }
    return window.supabaseClient;
  },

  isSupabaseEnabled() {
    return Boolean(
      window.SUPABASE_CONFIG && 
      window.SUPABASE_CONFIG.isConfigured() && 
      this.client
    );
  },

  /**
   * Initialize data layer: if Supabase enabled, test connection & sync
   */
  async initData(force = false) {
    if (this.isSupabaseEnabled()) {
      console.log('[Storage] Connecting to Supabase database at', window.SUPABASE_CONFIG.url);
      try {
        // Quick health check on videos table
        const { data, error } = await this.client.from('videos').select('id').limit(1);
        if (error) {
          console.warn('[Storage] Supabase connection returned error, falling back to local storage:', error.message);
        } else {
          console.log('[Storage] Supabase database connected successfully!');
          return;
        }
      } catch (e) {
        console.warn('[Storage] Supabase health check failed:', e);
      }
    } else {
      console.log('[Storage] Supabase not yet configured with valid anonKey. Using local mode.');
    }

    // Fallback: seed localStorage if empty
    const hasUsers = localStorage.getItem(this.KEYS.USERS);
    const hasVideos = localStorage.getItem(this.KEYS.VIDEOS);
    const hasCategories = localStorage.getItem(this.KEYS.CATEGORIES);
    const hasViews = localStorage.getItem(this.KEYS.VIEWS);

    if (force || !hasUsers || !hasVideos || !hasCategories || !hasViews) {
      if (typeof CSV !== 'undefined' && CSV.FALLBACK_SEEDS) {
        if (force || !hasUsers) localStorage.setItem(this.KEYS.USERS, JSON.stringify(CSV.parse(CSV.FALLBACK_SEEDS.users)));
        if (force || !hasCategories) localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(CSV.parse(CSV.FALLBACK_SEEDS.categories)));
        if (force || !hasVideos) localStorage.setItem(this.KEYS.VIDEOS, JSON.stringify(CSV.parse(CSV.FALLBACK_SEEDS.videos)));
        if (force || !hasViews) localStorage.setItem(this.KEYS.VIEWS, JSON.stringify(CSV.parse(CSV.FALLBACK_SEEDS.video_views)));
      }
    }
  },

  /**
   * Reset / sync demo data
   */
  async resetDemoData() {
    localStorage.removeItem(this.KEYS.USERS);
    localStorage.removeItem(this.KEYS.VIDEOS);
    localStorage.removeItem(this.KEYS.CATEGORIES);
    localStorage.removeItem(this.KEYS.VIEWS);

    if (this.isSupabaseEnabled()) {
      await Promise.all([
        this.getUsers(),
        this.getCategories(),
        this.getVideos(),
        this.getVideoViews()
      ]);
    } else {
      await this.initData(true);
    }
  },

  /* =========================================================================
     VIDEOS
     ========================================================================= */
  async getVideos() {
    if (this.isSupabaseEnabled()) {
      try {
        const { data, error } = await this.client
          .from('videos')
          .select('*')
          .order('id', { ascending: false });

        if (!error && data) {
          localStorage.setItem(this.KEYS.VIDEOS, JSON.stringify(data));
          return data;
        }
        console.error('[Storage] Error fetching videos from Supabase:', error);
      } catch (err) {
        console.error('[Storage] Supabase getVideos error:', err);
      }
    }
    const raw = localStorage.getItem(this.KEYS.VIDEOS);
    return raw ? JSON.parse(raw) : [];
  },

  async getVideoById(id) {
    if (this.isSupabaseEnabled()) {
      try {
        const { data, error } = await this.client
          .from('videos')
          .select('*')
          .eq('id', id)
          .single();

        if (!error && data) return data;
      } catch (err) {
        console.error('[Storage] Supabase getVideoById error:', err);
      }
    }
    const videos = await this.getVideos();
    return videos.find(v => String(v.id) === String(id));
  },

  async addVideo(video) {
    if (this.isSupabaseEnabled()) {
      try {
        const payload = {
          title: video.title,
          description: video.description || '',
          category_id: video.category_id ? Number(video.category_id) : null,
          thumbnail_url: video.thumbnail_url || '',
          video_url: video.video_url || '',
          duration: video.duration || '00:00',
          file_size_bytes: Number(video.file_size_bytes) || 0,
          status: video.status || 'PUBLISHED',
          views: Number(video.views) || 0
        };

        const { data, error } = await this.client
          .from('videos')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[Storage] Supabase addVideo error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.VIDEOS);
    const videos = raw ? JSON.parse(raw) : [];
    const nextId = videos.length ? Math.max(...videos.map(v => Number(v.id) || 0)) + 1 : 1;
    const newVideo = {
      id: String(nextId),
      views: 0,
      status: 'PUBLISHED',
      created_at: Utils.getTodayDateString(),
      ...video
    };
    videos.push(newVideo);
    localStorage.setItem(this.KEYS.VIDEOS, JSON.stringify(videos));
    return newVideo;
  },

  async updateVideo(id, updates) {
    if (this.isSupabaseEnabled()) {
      try {
        const payload = { ...updates };
        if (payload.category_id) payload.category_id = Number(payload.category_id);
        if (payload.file_size_bytes) payload.file_size_bytes = Number(payload.file_size_bytes);
        delete payload.id;
        delete payload.created_at;

        const { data, error } = await this.client
          .from('videos')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[Storage] Supabase updateVideo error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.VIDEOS);
    const videos = raw ? JSON.parse(raw) : [];
    const idx = videos.findIndex(v => String(v.id) === String(id));
    if (idx !== -1) {
      videos[idx] = { ...videos[idx], ...updates };
      localStorage.setItem(this.KEYS.VIDEOS, JSON.stringify(videos));
      return videos[idx];
    }
    return null;
  },

  async deleteVideo(id) {
    if (this.isSupabaseEnabled()) {
      try {
        const { error } = await this.client
          .from('videos')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('[Storage] Supabase deleteVideo error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.VIDEOS);
    let videos = raw ? JSON.parse(raw) : [];
    videos = videos.filter(v => String(v.id) !== String(id));
    localStorage.setItem(this.KEYS.VIDEOS, JSON.stringify(videos));
    return true;
  },

  /* =========================================================================
     CATEGORIES
     ========================================================================= */
  async getCategories() {
    if (this.isSupabaseEnabled()) {
      try {
        const { data, error } = await this.client
          .from('categories')
          .select('*')
          .order('id', { ascending: true });

        if (!error && data) {
          localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.error('[Storage] Supabase getCategories error:', err);
      }
    }
    const raw = localStorage.getItem(this.KEYS.CATEGORIES);
    return raw ? JSON.parse(raw) : [];
  },

  async getCategoryById(id) {
    const categories = await this.getCategories();
    return categories.find(c => String(c.id) === String(id));
  },

  async addCategory(category) {
    if (this.isSupabaseEnabled()) {
      try {
        const payload = {
          name: category.name,
          slug: category.slug || Utils.slugify(category.name),
          description: category.description || '',
          status: category.status || 'ACTIVE'
        };

        const { data, error } = await this.client
          .from('categories')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[Storage] Supabase addCategory error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.CATEGORIES);
    const categories = raw ? JSON.parse(raw) : [];
    const nextId = categories.length ? Math.max(...categories.map(c => Number(c.id) || 0)) + 1 : 1;
    const newCat = {
      id: String(nextId),
      slug: category.slug || Utils.slugify(category.name),
      status: 'ACTIVE',
      ...category
    };
    categories.push(newCat);
    localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
    return newCat;
  },

  async updateCategory(id, updates) {
    if (this.isSupabaseEnabled()) {
      try {
        const payload = { ...updates };
        delete payload.id;
        delete payload.created_at;

        const { data, error } = await this.client
          .from('categories')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[Storage] Supabase updateCategory error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.CATEGORIES);
    const categories = raw ? JSON.parse(raw) : [];
    const idx = categories.findIndex(c => String(c.id) === String(id));
    if (idx !== -1) {
      categories[idx] = { ...categories[idx], ...updates };
      localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
      return categories[idx];
    }
    return null;
  },

  async deleteCategory(id) {
    if (this.isSupabaseEnabled()) {
      try {
        const { error } = await this.client
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('[Storage] Supabase deleteCategory error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.CATEGORIES);
    let categories = raw ? JSON.parse(raw) : [];
    categories = categories.filter(c => String(c.id) !== String(id));
    localStorage.setItem(this.KEYS.CATEGORIES, JSON.stringify(categories));
    return true;
  },

  /* =========================================================================
     USERS
     ========================================================================= */
  async getUsers() {
    if (this.isSupabaseEnabled()) {
      try {
        const { data, error } = await this.client
          .from('users')
          .select('*')
          .order('id', { ascending: true });

        if (!error && data) {
          localStorage.setItem(this.KEYS.USERS, JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.error('[Storage] Supabase getUsers error:', err);
      }
    }
    const raw = localStorage.getItem(this.KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  },

  async getUserById(id) {
    const users = await this.getUsers();
    return users.find(u => String(u.id) === String(id));
  },

  async addUser(user) {
    if (this.isSupabaseEnabled()) {
      try {
        const payload = {
          username: user.username,
          email: user.email,
          password: user.password,
          role: user.role || 'USER',
          status: user.status || 'ACTIVE'
        };

        const { data, error } = await this.client
          .from('users')
          .insert([payload])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[Storage] Supabase addUser error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.USERS);
    const users = raw ? JSON.parse(raw) : [];
    const nextId = users.length ? Math.max(...users.map(u => Number(u.id) || 0)) + 1 : 1;
    const newUser = {
      id: String(nextId),
      created_at: Utils.getTodayDateString(),
      status: 'ACTIVE',
      role: 'USER',
      ...user
    };
    users.push(newUser);
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    return newUser;
  },

  async updateUser(id, updates) {
    if (this.isSupabaseEnabled()) {
      try {
        const payload = { ...updates };
        delete payload.id;
        delete payload.created_at;

        const { data, error } = await this.client
          .from('users')
          .update(payload)
          .eq('id', id)
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (err) {
        console.error('[Storage] Supabase updateUser error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.USERS);
    const users = raw ? JSON.parse(raw) : [];
    const idx = users.findIndex(u => String(u.id) === String(id));
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...updates };
      localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
      return users[idx];
    }
    return null;
  },

  async deleteUser(id) {
    if (this.isSupabaseEnabled()) {
      try {
        const { error } = await this.client
          .from('users')
          .delete()
          .eq('id', id);

        if (error) throw error;
        return true;
      } catch (err) {
        console.error('[Storage] Supabase deleteUser error:', err);
        throw err;
      }
    }

    // Local fallback
    const raw = localStorage.getItem(this.KEYS.USERS);
    let users = raw ? JSON.parse(raw) : [];
    users = users.filter(u => String(u.id) !== String(id));
    localStorage.setItem(this.KEYS.USERS, JSON.stringify(users));
    return true;
  },

  /* =========================================================================
     VIEWS & TIME-SERIES
     ========================================================================= */
  async getVideoViews() {
    if (this.isSupabaseEnabled()) {
      try {
        const { data, error } = await this.client
          .from('video_views')
          .select('*')
          .order('view_date', { ascending: true });

        if (!error && data) {
          localStorage.setItem(this.KEYS.VIEWS, JSON.stringify(data));
          return data;
        }
      } catch (err) {
        console.error('[Storage] Supabase getVideoViews error:', err);
      }
    }
    const raw = localStorage.getItem(this.KEYS.VIEWS);
    return raw ? JSON.parse(raw) : [];
  },

  /* =========================================================================
     SESSION MANAGEMENT (Local Session)
     ========================================================================= */
  getCurrentUser() {
    const raw = localStorage.getItem(this.KEYS.CURRENT_USER) || 
                localStorage.getItem(this.KEYS.LEGACY_CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  },

  setCurrentUser(user) {
    const data = JSON.stringify(user);
    localStorage.setItem(this.KEYS.CURRENT_USER, data);
    localStorage.setItem(this.KEYS.LEGACY_CURRENT_USER, data);
  },

  removeCurrentUser() {
    localStorage.removeItem(this.KEYS.CURRENT_USER);
    localStorage.removeItem(this.KEYS.LEGACY_CURRENT_USER);
  }
};

window.Storage = Storage;

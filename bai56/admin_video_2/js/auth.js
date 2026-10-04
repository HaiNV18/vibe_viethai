/**
 * Authentication Module (Login, Register, Forgot Password simulation, Logout)
 */

const Auth = {
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  },

  /**
   * Handle user login
   */
  async login(identifier, password, rememberMe = false) {
    const cleanId = String(identifier || '').trim();
    const cleanPass = String(password || '').trim();

    if (!cleanId || !cleanPass) {
      return { success: false, message: 'Please enter both username/email and password.' };
    }

    const users = await Storage.getUsers();
    const user = users.find(u => 
      (u.username && u.username.toLowerCase() === cleanId.toLowerCase()) || 
      (u.email && u.email.toLowerCase() === cleanId.toLowerCase())
    );

    if (!user) {
      return { success: false, message: 'Account not found with this username or email.' };
    }

    if (user.password !== cleanPass) {
      return { success: false, message: 'Incorrect password. Please try again.' };
    }

    if (user.status && user.status.toUpperCase() === 'INACTIVE') {
      return { success: false, message: 'This account has been deactivated. Please contact an administrator.' };
    }

    Storage.setCurrentUser(user);

    if (rememberMe) {
      localStorage.setItem('video_admin_remember', cleanId);
    } else {
      localStorage.removeItem('video_admin_remember');
    }

    return { success: true, message: 'Login successful!', user };
  },

  /**
   * Handle user registration
   */
  async register({ username, email, password, confirmPassword }) {
    const cleanUser = String(username || '').trim();
    const cleanEmail = String(email || '').trim();
    const cleanPass = String(password || '').trim();
    const cleanConfirm = String(confirmPassword || '').trim();

    if (!cleanUser) {
      return { success: false, message: 'Username is required.' };
    }

    if (cleanUser.length < 3) {
      return { success: false, message: 'Username must be at least 3 characters.' };
    }

    if (!cleanEmail || !this.isValidEmail(cleanEmail)) {
      return { success: false, message: 'Please provide a valid email address.' };
    }

    if (!cleanPass || cleanPass.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters long.' };
    }

    if (cleanPass !== cleanConfirm) {
      return { success: false, message: 'Passwords do not match.' };
    }

    const users = await Storage.getUsers();

    if (users.some(u => u.username && u.username.toLowerCase() === cleanUser.toLowerCase())) {
      return { success: false, message: 'Username is already taken. Please choose another.' };
    }

    if (users.some(u => u.email && u.email.toLowerCase() === cleanEmail.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    const newUser = await Storage.addUser({
      username: cleanUser,
      email: cleanEmail,
      password: cleanPass,
      role: 'USER',
      status: 'ACTIVE'
    });

    return { success: true, message: 'Account created successfully! You can now log in.', user: newUser };
  },

  /**
   * Simulated Forgot Password handler
   */
  async forgotPassword(email) {
    const cleanEmail = String(email || '').trim();

    if (!cleanEmail || !this.isValidEmail(cleanEmail)) {
      return { success: false, message: 'Please enter a valid email address.' };
    }

    const users = await Storage.getUsers();
    const user = users.find(u => u.email && u.email.toLowerCase() === cleanEmail.toLowerCase());

    if (!user) {
      return { success: false, message: 'Email not found in our records.' };
    }

    return {
      success: true,
      message: `Password reset simulation: In this demo environment, your password is "${user.password}". You can use it to log in now.`
    };
  },

  logout() {
    Storage.removeCurrentUser();
    const isPagesDir = window.location.pathname.includes('/pages/') || 
                       window.location.href.includes('/pages/');
    const target = isPagesDir ? 'login.html' : 'pages/login.html';
    window.location.replace(target);
  }
};

window.Auth = Auth;

// Authentication Module
console.log("Auth.js file loading...");
window.authModule = {
    currentUser: null,
    userData: null,

    // Initialize authentication
    init: function() {
        console.log("Auth module initializing...");
        try {
            this.setupEventListeners();
            
            // Set up auth state listener
            auth.onAuthStateChanged(async (user) => {
                console.log("Auth state changed:", user ? "User logged in" : "User logged out");
                if (user) {
                    console.log("Current user:", user.email, user.uid);
                    await this.loadUserData(user.uid);
                } else {
                    console.log("No user, showing auth screen");
                    this.showAuthScreen();
                }
            });
            console.log("Auth state listener set up successfully");
        } catch (error) {
            console.error("Error initializing auth module:", error);
        }
    },

    // Setup event listeners
    setupEventListeners: function() {
        // Add event listeners for auth forms
        document.addEventListener('click', (e) => {
            if (e.target.id === 'signInBtn') {
                this.handleSignIn();
            } else if (e.target.id === 'signUpBtn') {
                this.handleSignUp();
            } else if (e.target.id === 'googleSignInBtn') {
                this.handleGoogleSignIn();
            } else if (e.target.id === 'signOutBtn') {
                this.handleSignOut();
            } else if (e.target.id === 'forgotPasswordBtn') {
                this.handleForgotPassword();
            } else if (e.target.id === 'switchToSignUp') {
                this.showSignUpForm();
            } else if (e.target.id === 'switchToSignIn') {
                this.showSignInForm();
            }
        });

        // Enter key handling for forms
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                if (e.target.id === 'signInEmail' || e.target.id === 'signInPassword') {
                    this.handleSignIn();
                } else if (e.target.id === 'signUpEmail' || e.target.id === 'signUpPassword' || e.target.id === 'signUpName') {
                    this.handleSignUp();
                }
            }
        });
    },

    // Check authentication state
    checkAuthState: function() {
        console.log("Checking auth state...");
        const user = firebaseAuth.getCurrentUser();
        console.log("Current user from getCurrentUser:", user);
        if (user) {
            console.log("User found, loading data for:", user.uid);
            this.loadUserData(user.uid);
        } else {
            console.log("No user found, showing auth screen");
            this.showAuthScreen();
        }
    },

    // Load user data from Firestore
    loadUserData: async function(userId) {
        try {
            console.log("Loading user data for userId:", userId);
            const result = await firestoreDB.getUserData(userId);
            console.log("User data result:", result);
            
            if (result.success) {
                this.currentUser = firebaseAuth.getCurrentUser();
                this.userData = result.data;
                console.log("User data loaded successfully:", this.userData);
                
                // Hide auth screen and initialize app
                this.hideAuthScreen();
                if (window.app) {
                    window.app.initializeApp(this.currentUser, this.userData);
                } else {
                    console.error("App module not found");
                }
            } else {
                console.error("Failed to load user data:", result.error);
                // Try to create basic user data if not found
                if (result.error === "User not found") {
                    await this.createUserDataIfMissing(userId);
                } else {
                    this.handleSignOut();
                }
            }
        } catch (error) {
            console.error("Error loading user data:", error);
            this.handleSignOut();
        }
    },

    // Create user data if missing
    createUserDataIfMissing: async function(userId) {
        try {
            const user = firebaseAuth.getCurrentUser();
            if (user) {
                await firestoreDB.updateUserData(userId, {
                    uid: userId,
                    email: user.email,
                    name: user.displayName || user.email.split('@')[0],
                    role: 'PATIENT',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    profileImage: null,
                    phone: null,
                    address: null
                });
                
                // Retry loading user data
                this.loadUserData(userId);
            }
        } catch (error) {
            console.error("Error creating user data:", error);
            this.handleSignOut();
        }
    },

    // Show authentication screen
    showAuthScreen: function() {
        const modal = document.getElementById('authModal');
        const content = document.getElementById('authContent');
        
        modal.classList.remove('hidden');
        content.innerHTML = this.getSignInForm();
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
    },

    // Hide authentication screen
    hideAuthScreen: function() {
        const modal = document.getElementById('authModal');
        modal.classList.add('hidden');
    },

    // Get sign in form HTML
    getSignInForm: function() {
        return `
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <i class="fas fa-hospital text-purple-600 text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Welcome Back</h2>
                <p class="text-gray-600 mt-2">Sign in to your medical portal</p>
            </div>

            <form id="signInForm" class="space-y-4">
                <div class="form-group">
                    <label for="signInEmail" class="form-label">Email Address</label>
                    <input type="email" id="signInEmail" class="form-input" placeholder="Enter your email" required>
                </div>

                <div class="form-group">
                    <label for="signInPassword" class="form-label">Password</label>
                    <input type="password" id="signInPassword" class="form-input" placeholder="Enter your password" required>
                </div>

                <button type="button" id="signInBtn" class="form-button">
                    <span id="signInBtnText">Sign In</span>
                    <div id="signInSpinner" class="loading-spinner hidden ml-2"></div>
                </button>
            </form>

            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div class="mt-6">
                    <button type="button" id="googleSignInBtn" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </div>

            <div class="mt-6 text-center">
                <button type="button" id="forgotPasswordBtn" class="text-purple-600 hover:text-purple-700 text-sm font-medium">
                    Forgot your password?
                </button>
            </div>

            <div class="mt-6 text-center border-t pt-6">
                <p class="text-gray-600 text-sm">
                    Don't have an account? 
                    <button type="button" id="switchToSignUp" class="text-purple-600 hover:text-purple-700 font-medium">
                        Sign up
                    </button>
                </p>
            </div>
        `;
    },

    // Get sign up form HTML
    getSignUpForm: function() {
        return `
            <div class="text-center mb-6">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                    <i class="fas fa-user-plus text-purple-600 text-2xl"></i>
                </div>
                <h2 class="text-2xl font-bold text-gray-900">Create Account</h2>
                <p class="text-gray-600 mt-2">Join our medical portal</p>
            </div>

            <form id="signUpForm" class="space-y-4">
                <div class="form-group">
                    <label for="signUpName" class="form-label">Full Name</label>
                    <input type="text" id="signUpName" class="form-input" placeholder="Enter your full name" required>
                </div>

                <div class="form-group">
                    <label for="signUpEmail" class="form-label">Email Address</label>
                    <input type="email" id="signUpEmail" class="form-input" placeholder="Enter your email" required>
                </div>

                <div class="form-group">
                    <label for="signUpPassword" class="form-label">Password</label>
                    <input type="password" id="signUpPassword" class="form-input" placeholder="Create a password" required>
                </div>

                <div class="form-group">
                    <label for="userRole" class="form-label">I am a:</label>
                    <select id="userRole" class="form-input">
                        <option value="PATIENT">Patient</option>
                        <option value="DOCTOR">Doctor</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="userPhone" class="form-label">Phone Number (Optional)</label>
                    <input type="tel" id="userPhone" class="form-input" placeholder="Enter your phone number">
                </div>

                <button type="button" id="signUpBtn" class="form-button">
                    <span id="signUpBtnText">Create Account</span>
                    <div id="signUpSpinner" class="loading-spinner hidden ml-2"></div>
                </button>
            </form>

            <div class="mt-6">
                <div class="relative">
                    <div class="absolute inset-0 flex items-center">
                        <div class="w-full border-t border-gray-300"></div>
                    </div>
                    <div class="relative flex justify-center text-sm">
                        <span class="px-2 bg-white text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div class="mt-6">
                    <button type="button" id="googleSignInBtn" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                        <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        Continue with Google
                    </button>
                </div>
            </div>

            <div class="mt-6 text-center border-t pt-6">
                <p class="text-gray-600 text-sm">
                    Already have an account? 
                    <button type="button" id="switchToSignIn" class="text-purple-600 hover:text-purple-700 font-medium">
                        Sign in
                    </button>
                </p>
            </div>
        `;
    },

    // Show sign up form
    showSignUpForm: function() {
        const content = document.getElementById('authContent');
        content.innerHTML = this.getSignUpForm();
    },

    // Show sign in form
    showSignInForm: function() {
        const content = document.getElementById('authContent');
        content.innerHTML = this.getSignInForm();
    },

    // Handle sign in
    handleSignIn: async function() {
        const email = document.getElementById('signInEmail').value;
        const password = document.getElementById('signInPassword').value;
        const btnText = document.getElementById('signInBtnText');
        const spinner = document.getElementById('signInSpinner');

        if (!email || !password) {
            window.utils.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Show loading state
        btnText.textContent = 'Signing in...';
        spinner.classList.remove('hidden');

        try {
            const result = await firebaseAuth.signIn(email, password);
            if (result.success) {
                window.utils.showNotification('Sign in successful!', 'success');
                // Auth state listener will handle the rest
            } else {
                window.utils.showNotification(result.error, 'error');
            }
        } catch (error) {
            window.utils.showNotification('An error occurred during sign in', 'error');
        } finally {
            // Reset loading state
            btnText.textContent = 'Sign In';
            spinner.classList.add('hidden');
        }
    },

    // Handle sign up
    handleSignUp: async function() {
        const name = document.getElementById('signUpName').value;
        const email = document.getElementById('signUpEmail').value;
        const password = document.getElementById('signUpPassword').value;
        const role = document.getElementById('userRole').value;
        const phone = document.getElementById('userPhone').value;
        const btnText = document.getElementById('signUpBtnText');
        const spinner = document.getElementById('signUpSpinner');

        if (!name || !email || !password) {
            window.utils.showNotification('Please fill in all required fields', 'error');
            return;
        }

        if (password.length < 6) {
            window.utils.showNotification('Password must be at least 6 characters', 'error');
            return;
        }

        // Show loading state
        btnText.textContent = 'Creating account...';
        spinner.classList.remove('hidden');

        try {
            const userData = {
                name: name,
                role: role,
                phone: phone
            };

            const result = await firebaseAuth.signUp(email, password, userData);
            if (result.success) {
                window.utils.showNotification('Account created successfully!', 'success');
                // Auth state listener will handle the rest
            } else {
                window.utils.showNotification(result.error, 'error');
            }
        } catch (error) {
            window.utils.showNotification('An error occurred during sign up', 'error');
        } finally {
            // Reset loading state
            btnText.textContent = 'Create Account';
            spinner.classList.add('hidden');
        }
    },

    // Handle Google sign in
    handleGoogleSignIn: async function() {
        try {
            const result = await firebaseAuth.signInWithGoogle();
            if (result.success) {
                window.utils.showNotification('Sign in successful!', 'success');
                // Auth state listener will handle the rest
            } else {
                window.utils.showNotification(result.error, 'error');
            }
        } catch (error) {
            window.utils.showNotification('An error occurred during Google sign in', 'error');
        }
    },

    // Handle sign out
    handleSignOut: async function() {
        try {
            const result = await firebaseAuth.signOut();
            if (result.success) {
                this.currentUser = null;
                this.userData = null;
                window.utils.showNotification('Signed out successfully', 'success');
                this.showAuthScreen();
                // Clear app content
                const app = document.getElementById('app');
                app.innerHTML = '';
            } else {
                window.utils.showNotification(result.error, 'error');
            }
        } catch (error) {
            window.utils.showNotification('An error occurred during sign out', 'error');
        }
    },

    // Handle forgot password
    handleForgotPassword: async function() {
        const email = document.getElementById('signInEmail').value;
        
        if (!email) {
            window.utils.showNotification('Please enter your email address', 'error');
            return;
        }

        try {
            const result = await firebaseAuth.resetPassword(email);
            if (result.success) {
                window.utils.showNotification('Password reset email sent!', 'success');
            } else {
                window.utils.showNotification(result.error, 'error');
            }
        } catch (error) {
            window.utils.showNotification('An error occurred', 'error');
        }
    },

    // Get current user data
    getCurrentUser: function() {
        return {
            user: this.currentUser,
            userData: this.userData
        };
    },

    // Check if user is doctor
    isDoctor: function() {
        return this.userData && this.userData.role === 'DOCTOR';
    },

    // Check if user is patient
    isPatient: function() {
        return this.userData && this.userData.role === 'PATIENT';
    }
};

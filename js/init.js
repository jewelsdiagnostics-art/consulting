// Simple, direct application initialization
// This file handles the core app startup logic

// Wait for Firebase to be ready
function initApp() {
    console.log('Initializing application...');
    
    // Check authentication state
    auth.onAuthStateChanged(async (user) => {
        console.log('Auth state changed:', user ? 'User signed in' : 'No user');
        
        if (user) {
            console.log('Loading user data...');
            try {
                const result = await firestoreDB.getUserData(user.uid);
                
                if (result.success) {
                    // User data found - show app
                    console.log('User data loaded:', result.data);
                    showApp(user, result.data);
                } else {
                    // Create user data if missing
                    console.log('Creating user data...');
                    await firestoreDB.updateUserData(user.uid, {
                        uid: user.uid,
                        email: user.email,
                        name: user.displayName || user.email.split('@')[0],
                        role: 'PATIENT',
                        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                        profileImage: null,
                        phone: null,
                        address: null
                    });
                    
                    // Retry loading
                    const retry = await firestoreDB.getUserData(user.uid);
                    if (retry.success) {
                        showApp(user, retry.data);
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
                showAuth();
            }
        } else {
            // No user - show auth screen
            showAuth();
        }
    });
}

// Show the main application
function showApp(user, userData) {
    console.log('Showing app...');
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Hide auth modal
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.style.display = 'none';
        authModal.classList.add('hidden');
    }
    
    // Initialize the app module
    if (window.app && window.app.initializeApp) {
        window.app.initializeApp(user, userData);
    } else {
        console.error('App module not found');
        // Fallback: render basic app
        renderBasicApp(user, userData);
    }
}

// Show authentication screen
function showAuth() {
    console.log('Showing auth screen...');
    
    // Hide loading screen
    const loadingScreen = document.getElementById('loadingScreen');
    if (loadingScreen) {
        loadingScreen.style.display = 'none';
    }
    
    // Show auth modal
    const authModal = document.getElementById('authModal');
    const authContent = document.getElementById('authContent');
    
    if (authModal && authContent && window.authModule) {
        authModal.style.display = 'flex';
        authModal.classList.remove('hidden');
        authContent.innerHTML = window.authModule.getSignInForm();
    }
}

// Fallback app rendering if main app module fails
function renderBasicApp(user, userData) {
    const app = document.getElementById('app');
    if (app) {
        app.innerHTML = `
            <div class="min-h-screen bg-gray-50">
                <header class="bg-purple-600 text-white p-4">
                    <div class="flex justify-between items-center">
                        <h1 class="text-xl font-bold">Medical Portal</h1>
                        <div class="flex items-center gap-4">
                            <span>${userData.name || user.email}</span>
                            <button onclick="auth.signOut().then(() => location.reload())" 
                                    class="bg-white text-purple-600 px-4 py-2 rounded-lg font-medium">
                                Sign Out
                            </button>
                        </div>
                    </div>
                </header>
                <main class="p-6">
                    <h2 class="text-2xl font-bold mb-4">Welcome ${userData.name || 'User'}</h2>
                    <p class="text-gray-600 mb-4">You are signed in as a ${userData.role || 'PATIENT'}</p>
                    <div class="bg-white rounded-lg shadow p-6">
                        <p>The main application is loading. Please refresh if this persists.</p>
                    </div>
                </main>
            </div>
        `;
    }
}

// Start the app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting app...');
    
    // Give Firebase a moment to initialize
    setTimeout(initApp, 500);
});

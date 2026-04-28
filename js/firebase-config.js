// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDBlikgKVw_GhbKHvlZtI47rMYygaa8M1g",
    authDomain: "hospital-app-2026-c9285.firebaseapp.com",
    projectId: "hospital-app-2026-c9285",
    storageBucket: "hospital-app-2026-c9285.firebasestorage.app",
    messagingSenderId: "1009724734893",
    appId: "1:1009724734893:web:43569b45e2b58d37373524",
    measurementId: "G-WLFWTJENP6"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Enable offline persistence
db.enablePersistence()
    .then(() => {
        console.log("Firestore offline persistence enabled");
    })
    .catch((err) => {
        console.error("Firestore persistence error:", err);
    });

// Firebase Auth helper functions
window.firebaseAuth = {
    // Sign up with email and password
    signUp: async (email, password, userData) => {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Store additional user data in Firestore
            await db.collection('users').doc(user.uid).set({
                uid: user.uid,
                email: email,
                name: userData.name,
                role: userData.role || 'PATIENT',
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                profileImage: userData.profileImage || null,
                phone: userData.phone || null,
                address: userData.address || null
            });
            
            return { success: true, user: user };
        } catch (error) {
            console.error("Signup error:", error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with email and password
    signIn: async (email, password) => {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error("Signin error:", error);
            return { success: false, error: error.message };
        }
    },

    // Sign in with Google
    signInWithGoogle: async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const result = await auth.signInWithPopup(provider);
            
            // Check if user exists in Firestore, if not create
            const userDoc = await db.collection('users').doc(result.user.uid).get();
            if (!userDoc.exists) {
                await db.collection('users').doc(result.user.uid).set({
                    uid: result.user.uid,
                    email: result.user.email,
                    name: result.user.displayName,
                    role: 'PATIENT',
                    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                    profileImage: result.user.photoURL,
                    phone: null,
                    address: null
                });
            }
            
            return { success: true, user: result.user };
        } catch (error) {
            console.error("Google signin error:", error);
            return { success: false, error: error.message };
        }
    },

    // Sign out
    signOut: async () => {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            console.error("Signout error:", error);
            return { success: false, error: error.message };
        }
    },

    // Get current user
    getCurrentUser: () => {
        return auth.currentUser;
    },

    // Reset password
    resetPassword: async (email) => {
        try {
            await auth.sendPasswordResetEmail(email);
            return { success: true };
        } catch (error) {
            console.error("Password reset error:", error);
            return { success: false, error: error.message };
        }
    },

    // Update user profile
    updateProfile: async (userData) => {
        try {
            const user = auth.currentUser;
            if (!user) return { success: false, error: "No user logged in" };

            await db.collection('users').doc(user.uid).update({
                ...userData,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });

            return { success: true };
        } catch (error) {
            console.error("Profile update error:", error);
            return { success: false, error: error.message };
        }
    }
};

// Firestore helper functions
window.firestoreDB = {
    // Get user data
    getUserData: async (userId) => {
        try {
            const doc = await db.collection('users').doc(userId).get();
            if (doc.exists) {
                return { success: true, data: doc.data() };
            } else {
                return { success: false, error: "User not found" };
            }
        } catch (error) {
            console.error("Get user data error:", error);
            return { success: false, error: error.message };
        }
    },

    // Update user data
    updateUserData: async (userId, userData) => {
        try {
            await db.collection('users').doc(userId).set(userData, { merge: true });
            return { success: true };
        } catch (error) {
            console.error("Update user data error:", error);
            return { success: false, error: error.message };
        }
    },

    // Create appointment
    createAppointment: async (appointmentData) => {
        try {
            const docRef = await db.collection('appointments').add({
                ...appointmentData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'scheduled'
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Create appointment error:", error);
            return { success: false, error: error.message };
        }
    },

    // Get appointments for user
    getUserAppointments: async (userId, userRole) => {
        try {
            let query;
            if (userRole === 'DOCTOR') {
                query = db.collection('appointments').where('doctorId', '==', userId);
            } else {
                query = db.collection('appointments').where('patientId', '==', userId);
            }
            
            const snapshot = await query.orderBy('dateTime', 'desc').get();
            const appointments = [];
            snapshot.forEach(doc => {
                appointments.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, data: appointments };
        } catch (error) {
            console.error("Get appointments error:", error);
            return { success: false, error: error.message };
        }
    },

    // Get patients for doctor
    getDoctorPatients: async (doctorId) => {
        try {
            const snapshot = await db.collection('users')
                .where('role', '==', 'PATIENT')
                .orderBy('name')
                .get();
            
            const patients = [];
            snapshot.forEach(doc => {
                patients.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, data: patients };
        } catch (error) {
            console.error("Get patients error:", error);
            return { success: false, error: error.message };
        }
    },

    // Create prescription
    createPrescription: async (prescriptionData) => {
        try {
            const docRef = await db.collection('prescriptions').add({
                ...prescriptionData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'active'
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Create prescription error:", error);
            return { success: false, error: error.message };
        }
    },

    // Get prescriptions for user
    getUserPrescriptions: async (userId, userRole) => {
        try {
            let query;
            if (userRole === 'DOCTOR') {
                query = db.collection('prescriptions').where('doctorId', '==', userId);
            } else {
                query = db.collection('prescriptions').where('patientId', '==', userId);
            }
            
            const snapshot = await query.orderBy('createdAt', 'desc').get();
            const prescriptions = [];
            snapshot.forEach(doc => {
                prescriptions.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, data: prescriptions };
        } catch (error) {
            console.error("Get prescriptions error:", error);
            return { success: false, error: error.message };
        }
    },

    // Create lab test
    createLabTest: async (labTestData) => {
        try {
            const docRef = await db.collection('labTests').add({
                ...labTestData,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                status: 'pending'
            });
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error("Create lab test error:", error);
            return { success: false, error: error.message };
        }
    },

    // Get lab tests for user
    getUserLabTests: async (userId, userRole) => {
        try {
            let query;
            if (userRole === 'DOCTOR') {
                query = db.collection('labTests').where('doctorId', '==', userId);
            } else {
                query = db.collection('labTests').where('patientId', '==', userId);
            }
            
            const snapshot = await query.orderBy('createdAt', 'desc').get();
            const labTests = [];
            snapshot.forEach(doc => {
                labTests.push({ id: doc.id, ...doc.data() });
            });
            
            return { success: true, data: labTests };
        } catch (error) {
            console.error("Get lab tests error:", error);
            return { success: false, error: error.message };
        }
    },

    // Update document
    updateDocument: async (collection, docId, data) => {
        try {
            await db.collection(collection).doc(docId).update({
                ...data,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp()
            });
            return { success: true };
        } catch (error) {
            console.error("Update document error:", error);
            return { success: false, error: error.message };
        }
    },

    // Delete document
    deleteDocument: async (collection, docId) => {
        try {
            await db.collection(collection).doc(docId).delete();
            return { success: true };
        } catch (error) {
            console.error("Delete document error:", error);
            return { success: false, error: error.message };
        }
    }
};

// Auth state observer
auth.onAuthStateChanged((user) => {
    if (user) {
        console.log("User is signed in:", user.uid);
        // Trigger app initialization with user
        if (window.initializeApp) {
            window.initializeApp(user);
        }
    } else {
        console.log("User is signed out");
        // Show login screen
        if (window.showAuthScreen) {
            window.showAuthScreen();
        }
    }
});

console.log("Firebase initialized successfully");

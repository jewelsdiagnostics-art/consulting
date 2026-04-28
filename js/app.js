// Main Application Module
window.app = {
    currentUser: null,
    userData: null,
    currentPage: 'home',

    // Initialize application
    initializeApp: function(user, userData) {
        this.currentUser = user;
        this.userData = userData;
        
        // Hide loading screen
        const loadingScreen = document.getElementById('loadingScreen');
        if (loadingScreen) {
            loadingScreen.classList.add('hidden');
        }
        
        // Render the app
        this.renderApp();
        
        // Setup navigation
        this.setupNavigation();
    },

    // Render the main application
    renderApp: function() {
        const appContainer = document.getElementById('app');
        appContainer.innerHTML = this.getAppLayout();
        
        // Load initial page
        this.loadPage('home');
    },

    // Get app layout HTML
    getAppLayout: function() {
        return `
            <div class="min-h-screen pb-20">
                <!-- Header -->
                <header class="header">
                    <div class="header-content">
                        <div class="logo">
                            <i class="fas fa-hospital"></i>
                            <span>Medical Portal</span>
                        </div>
                        <div class="user-info">
                            <span class="hidden md:block">${this.userData.name}</span>
                            <div class="user-avatar">
                                ${this.getUserInitials()}
                            </div>
                        </div>
                    </div>
                </header>

                <!-- Main Content -->
                <main id="mainContent">
                    <!-- Content will be loaded here -->
                </main>

                <!-- Bottom Navigation -->
                <nav class="bottom-nav">
                    <div class="bottom-nav-content">
                        <a href="#" class="nav-item" data-page="home">
                            <i class="fas fa-home nav-icon"></i>
                            <span class="nav-label">Home</span>
                        </a>
                        <a href="#" class="nav-item" data-page="appointments">
                            <i class="fas fa-calendar nav-icon"></i>
                            <span class="nav-label">Appointments</span>
                        </a>
                        <a href="#" class="nav-item" data-page="prescriptions">
                            <i class="fas fa-pills nav-icon"></i>
                            <span class="nav-label">Prescriptions</span>
                        </a>
                        <a href="#" class="nav-item" data-page="lab">
                            <i class="fas fa-flask nav-icon"></i>
                            <span class="nav-label">Lab Tests</span>
                        </a>
                        <a href="#" class="nav-item" data-page="profile">
                            <i class="fas fa-user nav-icon"></i>
                            <span class="nav-label">Profile</span>
                        </a>
                    </div>
                </nav>
            </div>
        `;
    },

    // Get user initials
    getUserInitials: function() {
        if (!this.userData.name) return 'U';
        const names = this.userData.name.split(' ');
        if (names.length >= 2) {
            return names[0][0] + names[names.length - 1][0];
        }
        return names[0][0];
    },

    // Setup navigation
    setupNavigation: function() {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const page = item.dataset.page;
                this.loadPage(page);
                
                // Update active state
                navItems.forEach(nav => nav.classList.remove('active'));
                item.classList.add('active');
            });
        });

        // Set initial active nav item
        document.querySelector(`[data-page="${this.currentPage}"]`)?.classList.add('active');
    },

    // Load page content
    loadPage: function(pageName) {
        this.currentPage = pageName;
        const mainContent = document.getElementById('mainContent');
        
        switch(pageName) {
            case 'home':
                mainContent.innerHTML = this.getHomePage();
                this.setupHomePage();
                break;
            case 'appointments':
                mainContent.innerHTML = this.getAppointmentsPage();
                this.setupAppointmentsPage();
                break;
            case 'prescriptions':
                mainContent.innerHTML = this.getPrescriptionsPage();
                this.setupPrescriptionsPage();
                break;
            case 'lab':
                mainContent.innerHTML = this.getLabPage();
                this.setupLabPage();
                break;
            case 'profile':
                mainContent.innerHTML = this.getProfilePage();
                this.setupProfilePage();
                break;
            default:
                mainContent.innerHTML = '<div class="p-4 text-center"><p>Page not found</p></div>';
        }
    },

    // Get home page HTML
    getHomePage: function() {
        const isDoctor = this.userData.role === 'DOCTOR';
        
        return `
            <div class="hero-section">
                <div class="hero-content">
                    <div class="hero-text">
                        <h1>Welcome, ${this.userData.name}</h1>
                        <p>Your complete healthcare portal with real-time notifications and updates for clinics and medical teams.</p>
                    </div>
                    <img src="https://via.placeholder.com/120x120/7C3AED/FFFFFF?text=👨‍⚕️" alt="Medical" class="hero-image">
                </div>
            </div>

            <div class="search-container">
                <div class="search-bar">
                    <i class="fas fa-search text-gray-400"></i>
                    <input type="text" placeholder="Search here..." id="searchInput">
                </div>
            </div>

            <div class="categories-container">
                <div class="categories-grid">
                    <div class="category-card" data-action="${isDoctor ? 'appointments' : 'appointments'}">
                        <div class="category-icon">
                            <i class="fas fa-calendar-check"></i>
                        </div>
                        <h3 class="category-title">${isDoctor ? 'Your Appointments' : 'Appointments'}</h3>
                        <p class="category-description">Manage and view your scheduled appointments</p>
                    </div>

                    <div class="category-card" data-action="${isDoctor ? 'patients' : 'lab'}">
                        <div class="category-icon">
                            <i class="fas ${isDoctor ? 'fa-users' : 'fa-flask'}"></i>
                        </div>
                        <h3 class="category-title">${isDoctor ? 'Patients Lab Test' : 'Lab Test'}</h3>
                        <p class="category-description">${isDoctor ? 'View patient lab results' : 'View your lab test results'}</p>
                    </div>

                    <div class="category-card" data-action="${isDoctor ? 'profile' : 'payment'}">
                        <div class="category-icon">
                            <i class="fas ${isDoctor ? 'fa-user-md' : 'fa-credit-card'}"></i>
                        </div>
                        <h3 class="category-title">${isDoctor ? 'Your Biography' : 'Payment'}</h3>
                        <p class="category-description">${isDoctor ? 'Update your professional information' : 'Manage payments and billing'}</p>
                    </div>

                    <div class="category-card" data-action="prescriptions">
                        <div class="category-icon">
                            <i class="fas ${isDoctor ? 'fa-stethoscope' : 'fa-pills'}"></i>
                        </div>
                        <h3 class="category-title">${isDoctor ? 'Diagnostics & Treatment' : 'Prescriptions & Medication'}</h3>
                        <p class="category-description">${isDoctor ? 'Manage diagnostics and treatments' : 'View your prescriptions'}</p>
                    </div>

                    <div class="category-card" data-action="history">
                        <div class="category-icon">
                            <i class="fas fa-history"></i>
                        </div>
                        <h3 class="category-title">History</h3>
                        <p class="category-description">View your medical history</p>
                    </div>

                    <div class="category-card" data-action="downloads">
                        <div class="category-icon">
                            <i class="fas fa-download"></i>
                        </div>
                        <h3 class="category-title">Downloads</h3>
                        <p class="category-description">Download medical documents</p>
                    </div>
                </div>
            </div>
        `;
    },

    // Setup home page
    setupHomePage: function() {
        // Setup search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Setup category card clicks
        const categoryCards = document.querySelectorAll('.category-card');
        categoryCards.forEach(card => {
            card.addEventListener('click', () => {
                const action = card.dataset.action;
                this.handleCategoryAction(action);
            });
        });
    },

    // Handle search
    handleSearch: function(query) {
        console.log('Searching for:', query);
        // Implement search functionality
    },

    // Handle category action
    handleCategoryAction: function(action) {
        switch(action) {
            case 'appointments':
                this.loadPage('appointments');
                break;
            case 'patients':
                if (this.userData.role === 'DOCTOR') {
                    this.showPatientsList();
                }
                break;
            case 'lab':
                this.loadPage('lab');
                break;
            case 'payment':
                this.showPaymentPage();
                break;
            case 'prescriptions':
                this.loadPage('prescriptions');
                break;
            case 'profile':
                this.loadPage('profile');
                break;
            case 'history':
                this.showHistoryPage();
                break;
            case 'downloads':
                this.showDownloadsPage();
                break;
        }
    },

    // Get appointments page HTML
    getAppointmentsPage: function() {
        return `
            <div class="p-4">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold">Appointments</h1>
                    <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors" onclick="app.showNewAppointmentForm()">
                        <i class="fas fa-plus mr-2"></i>New Appointment
                    </button>
                </div>

                <div class="space-y-4" id="appointmentsList">
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p class="mt-2 text-gray-600">Loading appointments...</p>
                    </div>
                </div>
            </div>
        `;
    },

    // Setup appointments page
    setupAppointmentsPage: async function() {
        await this.loadAppointments();
    },

    // Load appointments
    loadAppointments: async function() {
        const appointmentsList = document.getElementById('appointmentsList');
        
        try {
            const result = await firestoreDB.getUserAppointments(this.currentUser.uid, this.userData.role);
            
            if (result.success) {
                if (result.data.length === 0) {
                    appointmentsList.innerHTML = `
                        <div class="text-center py-8">
                            <i class="fas fa-calendar-times text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">No appointments found</p>
                        </div>
                    `;
                } else {
                    appointmentsList.innerHTML = result.data.map(appointment => this.getAppointmentCard(appointment)).join('');
                }
            } else {
                appointmentsList.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-red-600">Error loading appointments</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading appointments:', error);
            appointmentsList.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                    <p class="text-red-600">Error loading appointments</p>
                </div>
            `;
        }
    },

    // Get appointment card HTML
    getAppointmentCard: function(appointment) {
        const date = appointment.dateTime ? new Date(appointment.dateTime.toDate()) : new Date();
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${appointment.title || 'Appointment'}</h3>
                        <p class="text-sm text-gray-600">${dateStr} at ${timeStr}</p>
                    </div>
                    <span class="badge badge-info">${appointment.status || 'scheduled'}</span>
                </div>
                <div class="card-content">
                    <p class="text-gray-700">${appointment.description || 'No description available'}</p>
                    ${appointment.location ? `<p class="text-sm text-gray-600 mt-2"><i class="fas fa-map-marker-alt mr-1"></i>${appointment.location}</p>` : ''}
                </div>
            </div>
        `;
    },

    // Get prescriptions page HTML
    getPrescriptionsPage: function() {
        return `
            <div class="p-4">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold">Prescriptions</h1>
                    ${this.userData.role === 'DOCTOR' ? `
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors" onclick="app.showNewPrescriptionForm()">
                            <i class="fas fa-plus mr-2"></i>New Prescription
                        </button>
                    ` : ''}
                </div>

                <div class="space-y-4" id="prescriptionsList">
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p class="mt-2 text-gray-600">Loading prescriptions...</p>
                    </div>
                </div>
            </div>
        `;
    },

    // Setup prescriptions page
    setupPrescriptionsPage: async function() {
        await this.loadPrescriptions();
    },

    // Load prescriptions
    loadPrescriptions: async function() {
        const prescriptionsList = document.getElementById('prescriptionsList');
        
        try {
            const result = await firestoreDB.getUserPrescriptions(this.currentUser.uid, this.userData.role);
            
            if (result.success) {
                if (result.data.length === 0) {
                    prescriptionsList.innerHTML = `
                        <div class="text-center py-8">
                            <i class="fas fa-pills text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">No prescriptions found</p>
                        </div>
                    `;
                } else {
                    prescriptionsList.innerHTML = result.data.map(prescription => this.getPrescriptionCard(prescription)).join('');
                }
            } else {
                prescriptionsList.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-red-600">Error loading prescriptions</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading prescriptions:', error);
            prescriptionsList.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                    <p class="text-red-600">Error loading prescriptions</p>
                </div>
            `;
        }
    },

    // Get prescription card HTML
    getPrescriptionCard: function(prescription) {
        const date = prescription.createdAt ? new Date(prescription.createdAt.toDate()) : new Date();
        const dateStr = date.toLocaleDateString();
        
        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${prescription.medicationName || 'Prescription'}</h3>
                        <p class="text-sm text-gray-600">Prescribed on ${dateStr}</p>
                    </div>
                    <span class="badge badge-success">${prescription.status || 'active'}</span>
                </div>
                <div class="card-content">
                    <p class="text-gray-700"><strong>Dosage:</strong> ${prescription.dosage || 'Not specified'}</p>
                    <p class="text-gray-700"><strong>Instructions:</strong> ${prescription.instructions || 'No instructions'}</p>
                    ${prescription.doctorName ? `<p class="text-sm text-gray-600 mt-2"><i class="fas fa-user-md mr-1"></i>Dr. ${prescription.doctorName}</p>` : ''}
                </div>
            </div>
        `;
    },

    // Get lab page HTML
    getLabPage: function() {
        return `
            <div class="p-4">
                <div class="flex justify-between items-center mb-6">
                    <h1 class="text-2xl font-bold">Lab Tests</h1>
                    ${this.userData.role === 'DOCTOR' ? `
                        <button class="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors" onclick="app.showNewLabTestForm()">
                            <i class="fas fa-plus mr-2"></i>New Lab Test
                        </button>
                    ` : ''}
                </div>

                <div class="space-y-4" id="labTestsList">
                    <div class="text-center py-8">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
                        <p class="mt-2 text-gray-600">Loading lab tests...</p>
                    </div>
                </div>
            </div>
        `;
    },

    // Setup lab page
    setupLabPage: async function() {
        await this.loadLabTests();
    },

    // Load lab tests
    loadLabTests: async function() {
        const labTestsList = document.getElementById('labTestsList');
        
        try {
            const result = await firestoreDB.getUserLabTests(this.currentUser.uid, this.userData.role);
            
            if (result.success) {
                if (result.data.length === 0) {
                    labTestsList.innerHTML = `
                        <div class="text-center py-8">
                            <i class="fas fa-flask text-4xl text-gray-400 mb-4"></i>
                            <p class="text-gray-600">No lab tests found</p>
                        </div>
                    `;
                } else {
                    labTestsList.innerHTML = result.data.map(labTest => this.getLabTestCard(labTest)).join('');
                }
            } else {
                labTestsList.innerHTML = `
                    <div class="text-center py-8">
                        <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                        <p class="text-red-600">Error loading lab tests</p>
                    </div>
                `;
            }
        } catch (error) {
            console.error('Error loading lab tests:', error);
            labTestsList.innerHTML = `
                <div class="text-center py-8">
                    <i class="fas fa-exclamation-triangle text-4xl text-red-400 mb-4"></i>
                    <p class="text-red-600">Error loading lab tests</p>
                </div>
            `;
        }
    },

    // Get lab test card HTML
    getLabTestCard: function(labTest) {
        const date = labTest.createdAt ? new Date(labTest.createdAt.toDate()) : new Date();
        const dateStr = date.toLocaleDateString();
        
        return `
            <div class="card">
                <div class="card-header">
                    <div>
                        <h3 class="card-title">${labTest.testName || 'Lab Test'}</h3>
                        <p class="text-sm text-gray-600">Tested on ${dateStr}</p>
                    </div>
                    <span class="badge ${labTest.status === 'completed' ? 'badge-success' : labTest.status === 'pending' ? 'badge-warning' : 'badge-info'}">${labTest.status || 'pending'}</span>
                </div>
                <div class="card-content">
                    <p class="text-gray-700"><strong>Test Type:</strong> ${labTest.testType || 'Not specified'}</p>
                    ${labTest.results ? `<p class="text-gray-700"><strong>Results:</strong> ${labTest.results}</p>` : ''}
                    ${labTest.doctorName ? `<p class="text-sm text-gray-600 mt-2"><i class="fas fa-user-md mr-1"></i>Dr. ${labTest.doctorName}</p>` : ''}
                </div>
            </div>
        `;
    },

    // Get profile page HTML
    getProfilePage: function() {
        return `
            <div class="p-4">
                <h1 class="text-2xl font-bold mb-6">Profile</h1>
                
                <div class="card">
                    <div class="flex items-center space-x-4 mb-6">
                        <div class="user-avatar text-2xl">
                            ${this.getUserInitials()}
                        </div>
                        <div>
                            <h2 class="text-xl font-semibold">${this.userData.name}</h2>
                            <p class="text-gray-600">${this.userData.email}</p>
                            <span class="badge badge-info">${this.userData.role}</span>
                        </div>
                    </div>
                    
                    <div class="space-y-4">
                        <div>
                            <label class="form-label">Full Name</label>
                            <input type="text" class="form-input" id="profileName" value="${this.userData.name || ''}">
                        </div>
                        
                        <div>
                            <label class="form-label">Email Address</label>
                            <input type="email" class="form-input" value="${this.userData.email || ''}" readonly>
                        </div>
                        
                        <div>
                            <label class="form-label">Phone Number</label>
                            <input type="tel" class="form-input" id="profilePhone" value="${this.userData.phone || ''}" placeholder="Enter your phone number">
                        </div>
                        
                        <div>
                            <label class="form-label">Address</label>
                            <textarea class="form-input" id="profileAddress" rows="3" placeholder="Enter your address">${this.userData.address || ''}</textarea>
                        </div>
                        
                        <button class="form-button" onclick="app.updateProfile()">
                            Update Profile
                        </button>
                    </div>
                </div>
                
                <div class="mt-6">
                    <button class="w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors" onclick="authModule.handleSignOut()">
                        <i class="fas fa-sign-out-alt mr-2"></i>Sign Out
                    </button>
                </div>
            </div>
        `;
    },

    // Setup profile page
    setupProfilePage: function() {
        // Profile page is already set up
    },

    // Update profile
    updateProfile: async function() {
        const name = document.getElementById('profileName').value;
        const phone = document.getElementById('profilePhone').value;
        const address = document.getElementById('profileAddress').value;
        
        if (!name) {
            window.utils.showNotification('Please enter your name', 'error');
            return;
        }
        
        try {
            const result = await firebaseAuth.updateProfile({
                name: name,
                phone: phone,
                address: address
            });
            
            if (result.success) {
                window.utils.showNotification('Profile updated successfully!', 'success');
                // Update local user data
                this.userData.name = name;
                this.userData.phone = phone;
                this.userData.address = address;
                // Refresh profile page
                this.loadPage('profile');
            } else {
                window.utils.showNotification(result.error, 'error');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            window.utils.showNotification('Error updating profile', 'error');
        }
    },

    // Show new appointment form (placeholder)
    showNewAppointmentForm: function() {
        window.utils.showNotification('New appointment form coming soon!', 'info');
    },

    // Show new prescription form (placeholder)
    showNewPrescriptionForm: function() {
        window.utils.showNotification('New prescription form coming soon!', 'info');
    },

    // Show new lab test form (placeholder)
    showNewLabTestForm: function() {
        window.utils.showNotification('New lab test form coming soon!', 'info');
    },

    // Show patients list (for doctors)
    showPatientsList: function() {
        window.utils.showNotification('Patients list coming soon!', 'info');
    },

    // Show payment page
    showPaymentPage: function() {
        window.utils.showNotification('Payment page coming soon!', 'info');
    },

    // Show history page
    showHistoryPage: function() {
        window.utils.showNotification('History page coming soon!', 'info');
    },

    // Show downloads page
    showDownloadsPage: function() {
        window.utils.showNotification('Downloads page coming soon!', 'info');
    }
};

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    if (typeof authModule !== 'undefined') {
        authModule.init();
    }
});

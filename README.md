# Hospital Management System - Web Application

A comprehensive healthcare portal web application built with HTML, CSS, and JavaScript, featuring Firebase authentication and real-time data management. This is the web version of the Flutter hospital management app, converted for deployment on Netlify.

## 🌟 Features

### 🔐 Authentication & Authorization
- Secure user registration and login system
- Email/password authentication
- Google Sign-In integration
- Role-based access control (Doctor/Patient)
- Password reset functionality

### 👤 User Management
- Complete user profile management
- Role-specific interfaces (Doctor vs Patient views)
- Personal information updates
- Profile image support

### 📅 Appointment Management
- Schedule and manage appointments
- View upcoming and past appointments
- Real-time appointment status updates
- Doctor-patient appointment coordination

### 💊 Prescription Management
- Create and manage prescriptions (Doctors)
- View prescription history (Patients)
- Medication tracking and dosage information
- Treatment planning tools

### 🔬 Laboratory & Imaging
- Order and manage lab tests
- View lab results and reports
- Test status tracking
- Medical imaging integration

### 💳 Payment System
- Invoice management
- Payment processing integration
- Billing history
- Support for mobile money (Orange Money/MTN)

### 📱 Responsive Design
- Mobile-first responsive design
- Works seamlessly on desktop, tablet, and mobile
- Touch-friendly interface
- Progressive Web App features

## 🛠️ Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Tailwind CSS + Custom CSS
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Icons**: Font Awesome
- **Deployment**: Netlify
- **CI/CD**: GitHub Actions

## 📋 Prerequisites

- Modern web browser (Chrome, Firefox, Safari, Edge)
- Firebase project setup
- Netlify account for deployment
- GitHub repository for version control

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/hospital-management-web.git
cd hospital-management-web
```

### 2. Firebase Setup
1. Create a new Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Authentication (Email/Password and Google providers)
3. Enable Firestore Database
4. Get your Firebase configuration details
5. Update the Firebase configuration in `js/firebase-config.js`

### 3. Local Development
Simply open `web-app/index.html` in your web browser or use a local server:
```bash
# Using Python
python -m http.server 8000

# Using Node.js (if you have http-server installed)
npx http-server web-app

# Using PHP
php -S localhost:8000 -t web-app
```

### 4. Deployment to Netlify

#### Automatic Deployment (Recommended)
1. Push your code to GitHub
2. Connect your GitHub repository to Netlify
3. Set up the following environment variables in Netlify:
   - `NETLIFY_AUTH_TOKEN`: Your Netlify auth token
   - `NETLIFY_SITE_ID`: Your Netlify site ID
4. Deploy automatically on push to main branch

#### Manual Deployment
1. Drag and drop the `web-app` folder to Netlify
2. Or use the Netlify CLI:
```bash
npm install -g netlify-cli
netlify login
netlify init
netlify deploy --prod --dir=web-app
```

## 📁 Project Structure

```
web-app/
├── index.html              # Main HTML file
├── css/
│   └── styles.css          # Custom styles and Tailwind CSS
├── js/
│   ├── firebase-config.js  # Firebase configuration and helpers
│   ├── auth.js             # Authentication module
│   ├── app.js              # Main application logic
│   └── utils.js            # Utility functions
├── assets/                 # Static assets (images, icons)
├── netlify.toml           # Netlify configuration
└── README.md              # This file
```

## 🔧 Configuration

### Firebase Configuration
Update the Firebase configuration in `js/firebase-config.js`:

```javascript
const firebaseConfig = {
    apiKey: "your-api-key",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "your-sender-id",
    appId: "your-app-id"
};
```

### Firestore Security Rules
Configure appropriate security rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read and write their own profile
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Authenticated users can read appointments they're involved in
    match /appointments/{appointmentId} {
      allow read: if request.auth != null && 
        (resource.data.patientId == request.auth.uid || 
         resource.data.doctorId == request.auth.uid);
      allow write: if request.auth != null;
    }
    
    // Similar rules for prescriptions, labTests, etc.
  }
}
```

## 🔒 Security Features

- Firebase Authentication for secure user management
- Firestore security rules for data protection
- XSS protection headers
- HTTPS enforcement
- Input validation and sanitization
- Session management
- CSRF protection

## 📱 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🚀 Deployment Guide

### Netlify Deployment Steps:

1. **Prepare Your Repository**
   - Ensure all files are committed to GitHub
   - Verify the `web-app` directory contains all necessary files

2. **Set Up Netlify**
   - Sign up/login to Netlify
   - Click "Add new site" → "Import an existing project"
   - Connect your GitHub repository
   - Set build settings:
     - Build command: `echo 'No build command needed'`
     - Publish directory: `web-app`
     - Add environment variables for Firebase if needed

3. **Configure Domain**
   - Choose a custom domain or use the default Netlify domain
   - Set up SSL certificate (automatic with Netlify)

4. **Test Deployment**
   - Visit your deployed site
   - Test authentication flow
   - Verify all features work correctly

### GitHub Actions Configuration

The `.github/workflows/deploy.yml` file provides automatic deployment:

1. **Set up Secrets in GitHub**
   - `NETLIFY_AUTH_TOKEN`: Get from Netlify dashboard → Site settings → Build & deploy → API
   - `NETLIFY_SITE_ID`: Get from Netlify dashboard → Site settings → General

2. **Automatic Deployment**
   - Push to `main` or `master` branch triggers deployment
   - Pull requests create deploy previews
   - Deployment status is shown in GitHub

## 🔄 Continuous Integration

The GitHub Actions workflow provides:
- Automatic deployment on code changes
- Deploy previews for pull requests
- Environment-specific configurations
- Error handling and logging

## 📊 Performance Optimization

- Lazy loading of images and content
- Optimized CSS and JavaScript delivery
- Firebase offline persistence
- Efficient data fetching patterns
- Minimal bundle size

## 🐛 Troubleshooting

### Common Issues:

1. **Firebase Configuration Error**
   - Verify Firebase project settings
   - Check API keys and permissions
   - Ensure Authentication and Firestore are enabled

2. **Authentication Issues**
   - Check Firebase Auth configuration
   - Verify email/password providers are enabled
   - Check CORS settings if needed

3. **Deployment Issues**
   - Verify Netlify configuration
   - Check environment variables
   - Review build logs for errors

4. **Performance Issues**
   - Check network requests in browser dev tools
   - Verify Firebase rules aren't blocking access
   - Optimize image sizes and formats

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Original Flutter App**: NDE HURICH DILAN
- **Web Conversion**: Your Name
- **Firebase Integration**: Your Name

## 📞 Support

For support and questions:
- Email: your-email@example.com
- GitHub Issues: [Create an issue](https://github.com/your-username/hospital-management-web/issues)

## 🔮 Future Enhancements

- [ ] Real-time notifications
- [ ] Video consultation integration
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] Offline mode capabilities
- [ ] Integration with external medical systems
- [ ] Mobile app (PWA) features
- [ ] Advanced payment gateways

---

**Built with ❤️ for the healthcare community**

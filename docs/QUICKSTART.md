# Smart Issue Board - Quick Start Guide

Welcome! This guide will help you set up and run the Smart Issue Board locally.

## Step 1: Firebase Setup (5 minutes)

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add Project" or "Create a project"
3. Enter project name (e.g., "smart-issue-board")
4. Disable Google Analytics (optional)
5. Click "Create Project"

### Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get Started"
3. Click "Email/Password" under Sign-in providers
4. Enable "Email/Password"
5. Click "Save"

### Create Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode" (we'll add rules later)
4. Choose a location close to your users
5. Click "Enable"

### Get Firebase Configuration

1. Click the gear icon (⚙️) next to "Project Overview"
2. Click "Project settings"
3. Scroll down to "Your apps"
4. Click the web icon (</>) to create a web app
5. Register app with nickname (e.g., "Smart Issue Board Web")
6. Copy the Firebase configuration object

## Step 2: Local Environment Setup

1. **Create `.env` file** in the project root:
   ```bash
   cp .env.example .env
   ```

2. **Edit `.env` file** with your Firebase configuration:
   ```
   VITE_FIREBASE_API_KEY=your_api_key_here
   VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

5. **Open your browser**:
   ```
   http://localhost:5173
   ```

## Step 3: Test the Application

1. Click "Sign up" to create a new account
2. Enter an email and password (minimum 6 characters)
3. After signup, you'll be logged in automatically
4. Try creating your first issue!
5. Test the similar issue detection by creating an issue with a similar title
6. Test the filters and status changes

## Step 4: Deploy to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit - Smart Issue Board"
   git branch -M main
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository
   - Configure project:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - Add Environment Variables (all your VITE_FIREBASE_* variables)
   - Click "Deploy"

3. **Update Firebase Auth Domain**:
   - After deployment, copy your Vercel URL (e.g., `your-app.vercel.app`)
   - Go to Firebase Console → Authentication → Settings → Authorized domains
   - Add your Vercel domain

## Optional: Firestore Security Rules

For better security, update your Firestore rules:

1. Go to Firestore Database → Rules
2. Replace with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /issues/{issue} {
      // Allow authenticated users to read, create, and update issues
      allow read, create, update: if request.auth != null;
      // Only allow deletion by the creator
      allow delete: if request.auth != null && request.auth.token.email == resource.data.createdBy;
    }
  }
}
```

3. Click "Publish"

## Troubleshooting

### Issue: "Firebase: Error (auth/configuration-not-found)"
- **Solution**: Make sure all environment variables are set correctly in `.env`
- Restart the dev server after changing `.env`

### Issue: "Missing or insufficient permissions"
- **Solution**: Check Firestore security rules
- Make sure you're logged in

### Issue: Build fails on Vercel
- **Solution**: Check that all environment variables are added in Vercel project settings
- Make sure they have the `VITE_` prefix

### Issue: Can't sign up/login
- **Solution**: Check that Email/Password authentication is enabled in Firebase Console
- Check browser console for detailed error messages

## Next Steps

- Customize the UI colors in the CSS files
- Add more features from the "Future Improvements" section in README.md
- Set up Firestore indexes for better query performance
- Add your own branding and styling

## Support

If you encounter any issues:
1. Check the browser console for errors
2. Review the Firebase Console for authentication/database issues
3. Ensure all environment variables are correctly set
4. Check the DEPLOYMENT.md file for more deployment details

---

Happy Coding! 🚀

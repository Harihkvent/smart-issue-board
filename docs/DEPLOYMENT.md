# Smart Issue Board Deployment Guide

## Vercel Deployment Steps

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create a Firebase Project**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Email/Password authentication in Authentication > Sign-in method
   - Create a Firestore database in Firestore Database (start in production mode)
   - Get your Firebase config from Project Settings

3. **Deploy to Vercel**
   - Go to [Vercel](https://vercel.com)
   - Import your GitHub repository
   - Add the following environment variables in Project Settings:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Deploy!

4. **Firestore Security Rules** (Optional but recommended)
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /issues/{issue} {
         allow read: if request.auth != null;
         allow create: if request.auth != null;
         allow update: if request.auth != null;
         allow delete: if request.auth != null;
       }
     }
   }
   ```

## Local Development

1. Create a `.env` file in the root directory (copy from `.env.example`)
2. Fill in your Firebase credentials
3. Run `npm install`
4. Run `npm run dev`

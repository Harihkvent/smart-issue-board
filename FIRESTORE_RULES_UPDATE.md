# Update Firestore Security Rules

## Quick Fix - Update via Firebase Console

Since Firebase CLI is not initialized, update the rules directly in the Firebase Console:

### Steps:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Firestore Database** in the left sidebar
4. Click on the **Rules** tab at the top
5. Replace the existing rules with the content from `firestore.rules` in this project
6. Click **Publish** to deploy the changes

### What Changed:

Added a new section for the `comments` collection:

```javascript
// Comments collection rules
match /comments/{comment} {
  // Allow authenticated users to read all comments
  allow read: if request.auth != null;
  
  // Allow authenticated users to create comments
  // Ensure createdBy field matches the authenticated user
  allow create: if request.auth != null 
                && request.resource.data.createdBy == request.auth.token.email
                && request.resource.data.keys().hasAll(['issueId', 'text', 'createdBy', 'createdAt']);
  
  // Allow comment creators to update their own comments
  allow update: if request.auth != null
                && request.auth.token.email == resource.data.createdBy;
  
  // Allow comment creators to delete their own comments
  allow delete: if request.auth != null 
                && request.auth.token.email == resource.data.createdBy;
}
```

## Why This Fixes the Issue

The "Add Comment" button wasn't working because Firestore was rejecting write operations to the `comments` collection due to missing security rules. Once you publish these updated rules, comments will work immediately.

## After Publishing

1. Refresh your application page
2. Open an issue modal
3. Type a comment and click "Add Comment"
4. The comment should now appear immediately

No code changes or app restart needed!

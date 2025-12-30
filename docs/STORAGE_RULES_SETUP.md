# Deploy Firebase Storage Rules

Since Firebase CLI is not initialized in this project, you need to deploy Storage rules manually through the Firebase Console.

## Steps to Enable Firebase Storage and Deploy Rules:

### 1. Enable Firebase Storage
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Navigate to **Storage** in the left sidebar under **Build**
4. Click **Get Started**
5. Choose a location for your storage bucket and click **Done**

### 2. Update Storage Rules
1. After Storage is enabled, go to the **Rules** tab
2. Replace the default rules with the content from `storage.rules` in this project:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // Allow authenticated users to upload images to comments folder
    match /comments/{imageId} {
      // Allow uploads only for authenticated users
      allow write: if request.auth != null
                   && request.resource.size < 5 * 1024 * 1024 // Max 5MB
                   && request.resource.contentType.matches('image/.*');
      
      // Allow all authenticated users to read images
      allow read: if request.auth != null;
    }
  }
}
```

3. Click **Publish** to deploy the rules

### 3. Verify Storage Bucket
Make sure your `.env` file has the correct `VITE_FIREBASE_STORAGE_BUCKET` value. It should look like:
```
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
```

## What This Enables

- **Image Uploads**: Users can now upload images in comments (max 5MB)
- **Image Display**: Uploaded images are displayed inline in comments using markdown format
- **Security**: Only authenticated users can upload/view images

## Testing

1. Refresh your application
2. Open any issue modal
3. Click the 📷 Image button below the comment textarea
4. Select an image file
5. The image URL will be inserted as markdown in the comment
6. Submit the comment to see the image displayed

No code restart needed!

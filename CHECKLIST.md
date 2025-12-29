# Pre-Deployment Checklist

## ✅ Before You Deploy

Use this checklist to ensure everything is ready for deployment.

### 1. Firebase Setup
- [ ] Created Firebase project
- [ ] Enabled Email/Password authentication
- [ ] Created Firestore database
- [ ] Copied Firebase configuration
- [ ] (Optional) Updated Firestore security rules

### 2. Local Environment
- [ ] Created `.env` file from `.env.example`
- [ ] Added all Firebase configuration values to `.env`
- [ ] Verified all environment variables have `VITE_` prefix
- [ ] Ran `npm install` successfully
- [ ] Started dev server with `npm run dev`
- [ ] Tested signup functionality
- [ ] Tested login functionality
- [ ] Tested issue creation
- [ ] Tested similar issue detection
- [ ] Tested issue filtering
- [ ] Tested status change validation (Open → Done blocked)
- [ ] Tested logout functionality

### 3. Code Quality
- [ ] No console errors in browser
- [ ] No Firebase configuration errors
- [ ] All features working as expected
- [ ] Responsive design tested (resize browser)
- [ ] Form validation working
- [ ] Error messages displaying correctly
- [ ] Success messages displaying correctly

### 4. Git & GitHub
- [ ] Initialized git repository (`git init`)
- [ ] Added all files (`git add .`)
- [ ] Made initial commit (`git commit -m "Initial commit"`)
- [ ] Created public GitHub repository
- [ ] Added remote origin (`git remote add origin <url>`)
- [ ] Pushed to GitHub (`git push -u origin main`)
- [ ] Verified all files are on GitHub
- [ ] Confirmed `.env` is NOT on GitHub (check .gitignore)

### 5. Vercel Deployment
- [ ] Created Vercel account (or logged in)
- [ ] Imported GitHub repository to Vercel
- [ ] Added all environment variables in Vercel:
  - [ ] `VITE_FIREBASE_API_KEY`
  - [ ] `VITE_FIREBASE_AUTH_DOMAIN`
  - [ ] `VITE_FIREBASE_PROJECT_ID`
  - [ ] `VITE_FIREBASE_STORAGE_BUCKET`
  - [ ] `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - [ ] `VITE_FIREBASE_APP_ID`
- [ ] Deployed to production
- [ ] Visited deployed URL
- [ ] Tested signup on production
- [ ] Tested login on production
- [ ] Tested issue creation on production

### 6. Firebase Authorized Domains
- [ ] Copied Vercel production URL
- [ ] Added Vercel domain to Firebase Authorized Domains
  - Location: Firebase Console → Authentication → Settings → Authorized domains
- [ ] Verified authentication works on production

### 7. Documentation
- [ ] README.md is complete
- [ ] README.md includes:
  - [ ] Live demo link (update after deployment)
  - [ ] Frontend stack explanation
  - [ ] Firestore data structure explanation
  - [ ] Similar issue handling explanation
  - [ ] Challenges faced
  - [ ] Future improvements
- [ ] DEPLOYMENT.md is included
- [ ] QUICKSTART.md is included
- [ ] PROJECT_SUMMARY.md is included

### 8. Final Testing on Production
- [ ] Signup with new account
- [ ] Create first issue
- [ ] Create second issue with similar title
- [ ] Verify similar issue warning appears
- [ ] Create issue anyway
- [ ] Test Status filter
- [ ] Test Priority filter
- [ ] Try to change Open → Done (should show error)
- [ ] Change Open → In Progress (should work)
- [ ] Change In Progress → Done (should work)
- [ ] Verify logged-in email displays
- [ ] Test logout
- [ ] Test login again

### 9. Repository & Submission
- [ ] GitHub repository is public
- [ ] README.md is visible on GitHub
- [ ] Latest code is pushed
- [ ] Repository URL is ready to submit
- [ ] Vercel deployment URL is ready to submit
- [ ] (Optional) Added README.md live demo link

## 🎉 Ready to Submit!

If all checkboxes are checked, your project is ready for submission.

### Submission Checklist
- [ ] Public GitHub repository URL
- [ ] Live Vercel deployment URL
- [ ] Both URLs are accessible and working
- [ ] README.md explains all required points

## 🔧 Common Issues & Solutions

### Issue: "Auth domain is not authorized"
**Solution**: Add your Vercel domain to Firebase Authorized Domains
- Firebase Console → Authentication → Settings → Authorized domains
- Click "Add domain" and enter your Vercel URL (without https://)

### Issue: Environment variables not working on Vercel
**Solution**: 
- Ensure all variables have `VITE_` prefix
- Redeploy after adding environment variables
- Check for typos in variable names

### Issue: Build fails on Vercel
**Solution**:
- Check build logs for specific error
- Ensure all dependencies are in package.json
- Test build locally: `npm run build`

### Issue: Can't create issues in production
**Solution**:
- Check browser console for errors
- Verify Firestore security rules allow write access
- Ensure user is authenticated

### Issue: Similar issue detection not working
**Solution**:
- Create at least one issue first
- Type at least 6 characters in title
- Check browser console for errors

## 📞 Need Help?

Review these documents:
1. README.md - Full project documentation
2. QUICKSTART.md - Step-by-step setup guide
3. DEPLOYMENT.md - Deployment instructions
4. PROJECT_SUMMARY.md - Feature overview

Good luck with your deployment! 🚀

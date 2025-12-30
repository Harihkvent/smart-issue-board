# Smart Issue Board

A modern, intelligent issue tracking system built with React, Firebase, and deployed on Vercel.

## 🚀 Live Demo

[View Live Application](https://smart-issue-board-sage.vercel.app) 

## 📋 Features

- ✅ User Authentication (Sign up / Login)
- ✅ Create Issues with Title, Description, Priority, Status, Assigned To
- ✅ Intelligent Similar Issue Detection
- ✅ Real-time Issue List with Filtering (Status & Priority)
- ✅ Status Transition Validation (prevents Open → Done)
- ✅ Responsive Design

## 🛠️ Tech Stack Choice

### Frontend: React + Vite

**Why I chose this stack:**

1. **React**: Industry-standard library with:
   - Large ecosystem and community support
   - Component-based architecture for maintainability
   - Excellent developer experience
   - Easy integration with Firebase

2. **Vite**: Modern build tool offering:
   - Lightning-fast hot module replacement (HMR)
   - Optimized production builds
   - Native ES modules support
   - Better performance than Create React App
   - Zero-config TypeScript support if needed

3. **React Router**: De facto standard for React navigation with:
   - Declarative routing
   - Protected route implementation
   - Clean URL management

**Alternative Considered**: Next.js was considered but Vite + React was chosen for:
- Simpler setup for this project scope
- Faster development iteration
- No need for SSR in this use case
- Direct deployment to Vercel works seamlessly

## 🗄️ Firestore Data Structure

### Collection: `issues`

```javascript
{
  id: "auto-generated-doc-id",
  title: string,              // Issue title
  description: string,         // Detailed description
  priority: "Low" | "Medium" | "High",
  status: "Open" | "In Progress" | "Done",
  assignedTo: string,         // Email or name (optional)
  createdBy: string,          // User email from Firebase Auth
  createdAt: string,          // ISO timestamp
  updatedAt: string           // ISO timestamp
}
```

### Design Decisions:

1. **Flat Structure**: Single collection for simplicity and performance
   - No subcollections needed for this scale
   - Easy to query and filter
   - Reduces read operations

2. **Timestamps as Strings**: ISO format for:
   - Easy sorting and filtering
   - Human-readable in Firestore console
   - Simple date parsing in JavaScript

3. **User Identification**: Using email (from Firebase Auth) because:
   - Already authenticated
   - No need for separate user collection at this stage
   - Reduces complexity

4. **Indexing Strategy** (for Firestore):
   - Composite index on `status` + `createdAt` (desc)
   - Composite index on `priority` + `createdAt` (desc)
   - Supports efficient filtered queries

## 🔍 Similar Issue Handling

### Implementation Strategy:

I implemented a **client-side similarity detection** system that:

1. **Triggers on Title Input**: When user types a title (>5 characters), the system searches existing issues

2. **Similarity Algorithm**:
   ```javascript
   - Exact substring matching (high weight: 0.8 similarity)
   - Word overlap analysis (for partial matches)
   - Only considers words >3 characters (filters noise)
   - Calculates similarity score based on common words
   ```

3. **User Experience Flow**:
   - ⚠️ **Warning Display**: Shows similar issues with their current status
   - 🚫 **Form Disabled**: User cannot submit until they acknowledge
   - ✅ **Continue Anyway**: Button to override and create the issue
   - 💡 **Suggestions**: Lists similar issues for user review

### Why This Approach?

- **Proactive**: Prevents duplicate creation before it happens
- **Non-Blocking**: Users can still proceed if issues are legitimately different
- **Informative**: Shows status of similar issues (might be already done)
- **Performance**: Client-side matching is instant, no backend calls needed

### Alternative Approaches Considered:

1. **Fuzzy String Matching** (Levenshtein distance): Too computationally expensive for real-time
2. **Natural Language Processing**: Overkill for this scope, adds complexity
3. **Backend ML Model**: Requires additional infrastructure and cost

## 😅 Challenges & Confusing Parts

### Challenges Faced:

1. **Similar Issue Detection Algorithm**
   - Initially tried complex string similarity algorithms
   - Realized simpler word-overlap approach works better for typical issue titles
   - Balance between false positives and missing duplicates

2. **Firebase Security Rules**
   - Had to learn Firestore security rules syntax
   - Ensuring authenticated users can only perform allowed operations

3. **Status Transition Logic**
   - Implementing validation that feels natural
   - Showing helpful error messages without being annoying

4. **Real-time Updates vs Performance**
   - Balancing between real-time listeners and cost
   - Decided on fetch-on-action approach instead of live listeners

### Confusing Aspects:

1. **Firebase Environment Variables in Vite**
   - Different from Create React App (`VITE_` prefix required)
   - Had to ensure proper `.env` setup

2. **React Router v6 Changes**
   - Protected routes pattern different from v5
   - Learned the new `Navigate` component approach

## 🚧 Future Improvements

### High Priority:

1. **Real-time Collaboration**
   - Use Firestore real-time listeners for live updates
   - Show who's currently viewing/editing issues

2. **Advanced Similar Issue Detection**
   - Implement vector embeddings for semantic similarity
   - Use Firebase Functions with OpenAI API for intelligent matching

3. **Issue Comments & History**
   - Add comment threads to issues
   - Track status change history

### Medium Priority:

4. **User Profiles**
   - Separate users collection
   - Display names, avatars
   - User assignment autocomplete

5. **Bulk Operations**
   - Select multiple issues
   - Bulk status updates
   - Bulk assignment

6. **Search & Advanced Filters**
   - Full-text search across title and description
   - Date range filters
   - Assigned to me / Created by me filters

### Low Priority:

7. **Email Notifications**
   - Notify assigned users
   - Status change notifications

8. **Export Functionality**
   - Export to CSV/Excel
   - Print view

9. **Dark Mode**
   - Toggle between light/dark themes
   - Persist preference

10. **Performance Optimizations**
    - Implement virtual scrolling for large issue lists
    - Pagination or infinite scroll
    - Image optimization if file attachments added

## 🏃‍♂️ Getting Started

### Prerequisites

- Node.js 16+
- Firebase account
- Vercel account (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-issue-board
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Firebase**
   - Create a Firebase project
   - Enable Email/Password authentication
   - Create a Firestore database
   - Copy Firebase config

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

5. **Run development server**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:5173
   ```

## 📦 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
# Then deploy production
vercel --prod
```

## 📁 Project Structure

```
smart-issue-board/
├── src/
│   ├── components/
│   │   └── PrivateRoute.jsx      # Protected route wrapper
│   ├── contexts/
│   │   └── AuthContext.jsx       # Authentication context
│   ├── firebase/
│   │   └── config.js             # Firebase initialization
│   ├── pages/
│   │   ├── Auth.css              # Authentication styles
│   │   ├── Dashboard.css         # Dashboard styles
│   │   ├── Dashboard.jsx         # Main issue board
│   │   ├── Login.jsx            # Login page
│   │   └── Signup.jsx           # Signup page
│   ├── App.css                   # Global app styles
│   ├── App.jsx                   # Main app component
│   ├── index.css                 # Root styles
│   └── main.jsx                  # App entry point
├── .env.example                  # Environment variables template
├── .gitignore
├── DEPLOYMENT.md                 # Deployment guide
├── index.html
├── package.json
├── README.md
├── vercel.json                   # Vercel configuration
└── vite.config.js               # Vite configuration
```

## 🔐 Security Considerations

1. **Environment Variables**: All Firebase credentials stored in environment variables
2. **Authentication**: All routes protected except login/signup
3. **Firestore Rules**: Implement security rules to restrict data access
4. **Input Validation**: Client-side validation for all form inputs

## 📝 License

This project is created as an assignment and is free to use.

## 👨‍💻 Author

Built with ❤️ using React, Firebase, and Vercel

---

**Note**: Remember to add your Firebase configuration and deploy to Vercel with environment variables set!

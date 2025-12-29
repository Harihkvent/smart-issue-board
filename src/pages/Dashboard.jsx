import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../firebase/config';
import './Dashboard.css';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [similarIssues, setSimilarIssues] = useState([]);
  const [showSimilarWarning, setShowSimilarWarning] = useState(false);

  // Filter states
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'Open',
    assignedTo: ''
  });

  useEffect(() => {
    fetchIssues();
  }, []);

  useEffect(() => {
    filterIssues();
  }, [issues, statusFilter, priorityFilter]);

  const fetchIssues = async () => {
    try {
      const q = query(collection(db, 'issues'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const issuesData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setIssues(issuesData);
    } catch (error) {
      setError('Failed to fetch issues: ' + error.message);
    }
  };

  const filterIssues = () => {
    let filtered = [...issues];

    if (statusFilter !== 'all') {
      filtered = filtered.filter(issue => issue.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(issue => issue.priority === priorityFilter);
    }

    setFilteredIssues(filtered);
  };

  const calculateSimilarity = (str1, str2) => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    
    // Check for exact substring match
    if (s1.includes(s2) || s2.includes(s1)) {
      return 0.8;
    }

    // Simple word overlap check
    const words1 = s1.split(/\s+/);
    const words2 = s2.split(/\s+/);
    const commonWords = words1.filter(word => words2.includes(word) && word.length > 3);
    
    if (commonWords.length > 0) {
      return commonWords.length / Math.max(words1.length, words2.length);
    }

    return 0;
  };

  const findSimilarIssues = (title, description) => {
    const similar = issues.filter(issue => {
      const titleSimilarity = calculateSimilarity(title, issue.title);
      const descSimilarity = calculateSimilarity(description, issue.description);
      return titleSimilarity > 0.5 || descSimilarity > 0.4;
    });

    return similar;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check for similar issues when title or description changes
    if (name === 'title' && value.length > 5) {
      const similar = findSimilarIssues(value, formData.description);
      if (similar.length > 0) {
        setSimilarIssues(similar);
        setShowSimilarWarning(true);
      } else {
        setSimilarIssues([]);
        setShowSimilarWarning(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // If there are similar issues and user hasn't been warned, show warning
    if (similarIssues.length > 0 && showSimilarWarning) {
      // Warning is already shown, user needs to confirm
      return;
    }

    try {
      setLoading(true);
      setError('');
      
      const issueData = {
        ...formData,
        createdBy: currentUser.email,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await addDoc(collection(db, 'issues'), issueData);
      
      setSuccess('Issue created successfully!');
      setFormData({
        title: '',
        description: '',
        priority: 'Medium',
        status: 'Open',
        assignedTo: ''
      });
      setSimilarIssues([]);
      setShowSimilarWarning(false);
      setShowForm(false);
      
      // Refresh issues
      await fetchIssues();
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to create issue: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleContinueAnyway = () => {
    setShowSimilarWarning(false);
    setSimilarIssues([]);
  };

  const handleStatusChange = async (issueId, currentStatus, newStatus) => {
    // Check if trying to go from Open to Done
    if (currentStatus === 'Open' && newStatus === 'Done') {
      setError('Cannot move issue directly from Open to Done. Please set it to In Progress first.');
      setTimeout(() => setError(''), 5000);
      return;
    }

    try {
      const issueRef = doc(db, 'issues', issueId);
      await updateDoc(issueRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      
      await fetchIssues();
      setSuccess('Status updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Failed to update status: ' + error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      setError('Failed to log out');
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div>
          <h1>Smart Issue Board</h1>
          <p className="user-email">Logged in as: {currentUser?.email}</p>
        </div>
        <button onClick={handleLogout} className="btn-logout">Logout</button>
      </header>

      <div className="dashboard-content">
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="actions-bar">
          <button 
            onClick={() => setShowForm(!showForm)} 
            className="btn-primary"
          >
            {showForm ? 'Cancel' : 'Create New Issue'}
          </button>

          <div className="filters">
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="Open">Open</option>
              <option value="In Progress">In Progress</option>
              <option value="Done">Done</option>
            </select>

            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Priority</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>

        {showForm && (
          <div className="issue-form-container">
            <h2>Create New Issue</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {showSimilarWarning && similarIssues.length > 0 && (
                <div className="warning-message">
                  <strong>⚠️ Similar issues found:</strong>
                  <ul>
                    {similarIssues.map(issue => (
                      <li key={issue.id}>
                        {issue.title} - <span className="issue-status">{issue.status}</span>
                      </li>
                    ))}
                  </ul>
                  <button 
                    type="button" 
                    onClick={handleContinueAnyway}
                    className="btn-secondary"
                  >
                    Continue Anyway
                  </button>
                </div>
              )}

              <div className="form-group">
                <label>Description *</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority *</label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Assigned To</label>
                <input
                  type="text"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleInputChange}
                  placeholder="Email or name"
                />
              </div>

              <button 
                type="submit" 
                disabled={loading || showSimilarWarning}
                className="btn-primary"
              >
                {loading ? 'Creating...' : 'Create Issue'}
              </button>
            </form>
          </div>
        )}

        <div className="issues-list">
          <h2>Issues ({filteredIssues.length})</h2>
          {filteredIssues.length === 0 ? (
            <p className="no-issues">No issues found. Create your first issue!</p>
          ) : (
            <div className="issues-grid">
              {filteredIssues.map(issue => (
                <div key={issue.id} className="issue-card">
                  <div className="issue-header">
                    <h3>{issue.title}</h3>
                    <span className={`priority-badge priority-${issue.priority.toLowerCase()}`}>
                      {issue.priority}
                    </span>
                  </div>
                  
                  <p className="issue-description">{issue.description}</p>
                  
                  <div className="issue-meta">
                    <div className="issue-field">
                      <strong>Status:</strong>
                      <select
                        value={issue.status}
                        onChange={(e) => handleStatusChange(issue.id, issue.status, e.target.value)}
                        className="status-select"
                      >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                    
                    {issue.assignedTo && (
                      <div className="issue-field">
                        <strong>Assigned To:</strong> {issue.assignedTo}
                      </div>
                    )}
                    
                    <div className="issue-field">
                      <strong>Created By:</strong> {issue.createdBy}
                    </div>
                    
                    <div className="issue-field">
                      <strong>Created:</strong> {new Date(issue.createdAt).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

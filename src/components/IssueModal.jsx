import { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, query, where, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { useAuth } from '../contexts/AuthContext';
import './IssueModal.css';

export default function IssueModal({ issue, onClose, onUpdate }) {
  const { currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: issue.title,
    description: issue.description
  });
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editCommentText, setEditCommentText] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [issue.id]);

  const fetchComments = async () => {
    try {
      const q = query(
        collection(db, 'comments'),
        where('issueId', '==', issue.id)
      );
      const querySnapshot = await getDocs(q);
      const commentsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      // Sort comments by date on the client side
      commentsData.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      setComments(commentsData);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setLoading(true);
      await addDoc(collection(db, 'comments'), {
        issueId: issue.id,
        text: newComment,
        createdBy: currentUser.email,
        createdAt: new Date().toISOString()
      });
      
      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveEdit = () => {
    onUpdate(issue.id, editData);
    setIsEditing(false);
  };

  const handleDeleteComment = async (commentId) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteDoc(doc(db, 'comments', commentId));
      await fetchComments();
    } catch (error) {
      console.error('Failed to delete comment:', error);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditCommentText(comment.text);
  };

  const handleSaveComment = async (commentId) => {
    if (!editCommentText.trim()) return;
    try {
      await updateDoc(doc(db, 'comments', commentId), {
        text: editCommentText,
        updatedAt: new Date().toISOString()
      });
      setEditingCommentId(null);
      await fetchComments();
    } catch (error) {
      console.error('Failed to update comment:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Image size should be less than 2MB for Firestore storage');
      return;
    }

    try {
      setUploadingImage(true);
      
      // Convert image to base64
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64Image = event.target.result;
        setNewComment(prev => prev + (prev ? '\n' : '') + `![image](${base64Image})`);
        setUploadingImage(false);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
        setUploadingImage(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Failed to process image:', error);
      alert(`Failed to upload image: ${error.message}`);
      setUploadingImage(false);
    }
  };

  const getUserName = (email) => {
    return email.split('@')[0];
  };

  const renderCommentText = (text) => {
    // Convert markdown image syntax to HTML img tags
    return text.replace(/!\[image\]\((data:image\/[^)]+)\)/g, '<img src="$1" alt="comment image" style="max-width: 100%; border-radius: 8px; margin-top: 8px;" />');
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          {isEditing ? (
            <input
              type="text"
              value={editData.title}
              onChange={(e) => setEditData({ ...editData, title: e.target.value })}
              className="edit-title-input"
            />
          ) : (
            <h2>{issue.title}</h2>
          )}
          <button onClick={onClose} className="close-btn">✕</button>
        </div>

        <div className="modal-body">
          <div className="issue-details">
            <div className="detail-section">
              <label>Description</label>
              {isEditing ? (
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="edit-description-textarea"
                  rows={4}
                />
              ) : (
                <p>{issue.description}</p>
              )}
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <label>Status</label>
                <span className={`status-badge status-${issue.status.toLowerCase().replace(' ', '-')}`}>
                  {issue.status}
                </span>
              </div>
              <div className="detail-item">
                <label>Priority</label>
                <span className={`priority-badge priority-${issue.priority.toLowerCase()}`}>
                  {issue.priority}
                </span>
              </div>
            </div>

            <div className="detail-row">
              <div className="detail-item">
                <label>Created By</label>
                <span>{getUserName(issue.createdBy)}</span>
              </div>
              {issue.assignedTo && (
                <div className="detail-item">
                  <label>Assigned To</label>
                  <span>{issue.assignedTo}</span>
                </div>
              )}
            </div>

            <div className="detail-item">
              <label>Created</label>
              <span>{new Date(issue.createdAt).toLocaleString()}</span>
            </div>

            {isEditing ? (
              <div className="edit-actions">
                <button onClick={handleSaveEdit} className="btn-save">Save</button>
                <button onClick={() => setIsEditing(false)} className="btn-cancel">Cancel</button>
              </div>
            ) : (
              <button onClick={() => setIsEditing(true)} className="btn-edit">Edit Issue</button>
            )}
          </div>

          <div className="comments-section">
            <h3>Comments ({comments.length})</h3>
            
            <div className="comments-list">
              {comments.map(comment => (
                <div key={comment.id} className="comment">
                  <div className="comment-header">
                    <strong>{getUserName(comment.createdBy)}</strong>
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                  </div>
                  {editingCommentId === comment.id ? (
                    <div className="comment-edit">
                      <textarea
                        value={editCommentText}
                        onChange={(e) => setEditCommentText(e.target.value)}
                        className="comment-edit-input"
                        rows={3}
                      />
                      <div className="comment-edit-actions">
                        <button onClick={() => handleSaveComment(comment.id)} className="btn-save-comment">Save</button>
                        <button onClick={() => setEditingCommentId(null)} className="btn-cancel-comment">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="comment-text" dangerouslySetInnerHTML={{ __html: renderCommentText(comment.text) }} />
                      {currentUser.email === comment.createdBy && (
                        <div className="comment-actions">
                          <button onClick={() => handleEditComment(comment)} className="btn-edit-comment">Edit</button>
                          <button onClick={() => handleDeleteComment(comment.id)} className="btn-delete-comment">Delete</button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleAddComment} className="comment-form">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment... (upload images using the button below)"
                rows={3}
                className="comment-input"
              />
              <div className="comment-form-actions">
                <label className="btn-upload-image" title="Upload image">
                  📷 {uploadingImage ? 'Uploading...' : 'Image'}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    disabled={uploadingImage}
                    style={{ display: 'none' }}
                  />
                </label>
                <button type="submit" disabled={loading || !newComment.trim()} className="btn-comment">
                  {loading ? 'Adding...' : 'Add Comment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import '../styles/Profile.css';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('account');
  const [accountData, setAccountData] = useState({
    name: 'Anonymous User',
    email: 'user@college.com',
    college: 'SFIT',
    bio: 'Just a curious student exploring the campus community.',
    avatar: 'av-p'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(accountData);

  const handleEditChange = (field, value) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveChanges = () => {
    setAccountData(editData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData(accountData);
    setIsEditing(false);
  };

  // Mock data for posts
  const userPosts = [
    {
      id: 1,
      time: '2 hours ago',
      body: 'Anyone else struggling with DSA? The assignments are insane this semester.',
      likes: 45,
      replies: 12,
      views: 234
    },
    {
      id: 2,
      time: '1 day ago',
      body: 'Pro tip: Study the previous year PYQs before exams. Saved me so much time!',
      likes: 128,
      replies: 34,
      views: 892
    },
    {
      id: 3,
      time: '3 days ago',
      body: 'Can we get better WiFi in the library? Current speed is abysmal.',
      likes: 67,
      replies: 18,
      views: 445
    }
  ];

  // Mock data for comments
  const userComments = [
    {
      id: 1,
      postAuthor: 'Another User',
      postBody: 'Best professors for web dev?',
      comment: 'Prof. Sharma is amazing for web dev. Clear explanations and great projects.',
      time: '5 hours ago',
      likes: 23
    },
    {
      id: 2,
      postAuthor: 'Study Group',
      postBody: 'Exam tips for finals',
      comment: 'Don\'t skip revision! Make notes while studying, helps with memory.',
      time: '1 day ago',
      likes: 15
    },
    {
      id: 3,
      postAuthor: 'Campus Chat',
      postBody: 'Any internship opportunities?',
      comment: 'Check the placement portal regularly. Updates happen every week.',
      time: '2 days ago',
      likes: 8
    }
  ];

  // Mock data for ratings
  const userRatings = [
    {
      id: 1,
      profName: 'Dr. Rajesh Kumar',
      subject: 'Data Structures',
      rating: 4.5,
      review: 'Excellent teacher with clear explanations. Very helpful during office hours.'
    },
    {
      id: 2,
      profName: 'Prof. Priya Singh',
      subject: 'Web Development',
      rating: 4.8,
      review: 'Best professor ever! Makes complex concepts simple and engaging.'
    },
    {
      id: 3,
      profName: 'Dr. Amit Patel',
      subject: 'Database Management',
      rating: 3.5,
      review: 'Good knowledge but a bit fast-paced. Could improve on practical examples.'
    }
  ];

  const avatarOptions = [
    { value: 'av-p', label: 'Purple', color: '#534AB7' },
    { value: 'av-t', label: 'Teal', color: '#1D9E75' },
    { value: 'av-a', label: 'Amber', color: '#EF9F27' },
    { value: 'av-pk', label: 'Pink', color: '#D946A6' },
    { value: 'av-b', label: 'Blue', color: '#0EA5E9' }
  ];

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar-section">
            <div className={`profile-avatar ${editData.avatar}`}>
              {editData.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div className="profile-basic-info">
              <h1 className="profile-name">{accountData.name}</h1>
              <p className="profile-college">{accountData.college}</p>
              <p className="profile-bio">{accountData.bio}</p>
            </div>
          </div>
          {!isEditing && (
            <button className="profile-edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="profile-tabs">
          <button
            className={`tab-btn ${activeTab === 'account' ? 'active' : ''}`}
            onClick={() => setActiveTab('account')}
          >
            Account
          </button>
          <button
            className={`tab-btn ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            Posts
          </button>
          <button
            className={`tab-btn ${activeTab === 'comments' ? 'active' : ''}`}
            onClick={() => setActiveTab('comments')}
          >
            Comments
          </button>
          <button
            className={`tab-btn ${activeTab === 'ratings' ? 'active' : ''}`}
            onClick={() => setActiveTab('ratings')}
          >
            Ratings
          </button>
        </div>

        {/* Tab Content */}
        <div className="profile-content">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="account-section">
              {!isEditing ? (
                <div className="account-view">
                  <div className="account-field">
                    <label>Name</label>
                    <p>{accountData.name}</p>
                  </div>
                  <div className="account-field">
                    <label>Email</label>
                    <p>{accountData.email}</p>
                  </div>
                  <div className="account-field">
                    <label>College</label>
                    <p>{accountData.college}</p>
                  </div>
                  <div className="account-field">
                    <label>Bio</label>
                    <p>{accountData.bio}</p>
                  </div>
                  <div className="account-field">
                    <label>Avatar</label>
                    <div className={`avatar-display ${accountData.avatar}`}>
                      {accountData.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="account-edit">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      value={editData.name}
                      onChange={(e) => handleEditChange('name', e.target.value)}
                      placeholder="Your name"
                    />
                  </div>
                  <div className="form-group">
                    <label>Email (Read-only)</label>
                    <input
                      type="email"
                      value={editData.email}
                      disabled
                      placeholder="Your email"
                    />
                  </div>
                  <div className="form-group">
                    <label>College</label>
                    <select
                      value={editData.college}
                      onChange={(e) => handleEditChange('college', e.target.value)}
                    >
                      <option>SFIT</option>
                      <option>Rizvi</option>
                      <option>VIT</option>
                      <option>DJ Sanghvi</option>
                      <option>Saboo Siddiqui</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) => handleEditChange('bio', e.target.value)}
                      placeholder="Tell us about yourself"
                      rows={4}
                    />
                  </div>
                  <div className="form-group">
                    <label>Avatar Color</label>
                    <div className="avatar-options">
                      {avatarOptions.map(option => (
                        <button
                          key={option.value}
                          className={`avatar-option ${option.value} ${editData.avatar === option.value ? 'selected' : ''}`}
                          onClick={() => handleEditChange('avatar', option.value)}
                          title={option.label}
                        >
                          {editData.name.split(' ').map(n => n[0]).join('')}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="form-actions">
                    <button className="btn-save" onClick={handleSaveChanges}>
                      Save Changes
                    </button>
                    <button className="btn-cancel" onClick={handleCancel}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="posts-section">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <div key={post.id} className="post-item">
                    <p className="post-time">{post.time}</p>
                    <p className="post-body">{post.body}</p>
                    <div className="post-stats">
                      <span className="stat">
                        <strong>{post.likes}</strong> Likes
                      </span>
                      <span className="stat">
                        <strong>{post.replies}</strong> Replies
                      </span>
                      <span className="stat">
                        <strong>{post.views}</strong> Views
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No posts yet. Start sharing!</p>
              )}
            </div>
          )}

          {/* Comments Tab */}
          {activeTab === 'comments' && (
            <div className="comments-section">
              {userComments.length > 0 ? (
                userComments.map(comment => (
                  <div key={comment.id} className="comment-item">
                    <div className="comment-header">
                      <p className="comment-author">On <strong>{comment.postAuthor}</strong>'s post</p>
                      <p className="comment-time">{comment.time}</p>
                    </div>
                    <p className="original-post">"{comment.postBody}"</p>
                    <p className="comment-text">{comment.comment}</p>
                    <div className="comment-actions">
                      <span className="comment-likes">👍 {comment.likes} Likes</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-state">No comments yet. Join the conversation!</p>
              )}
            </div>
          )}

          {/* Ratings Tab */}
          {activeTab === 'ratings' && (
            <div className="ratings-section">
              {userRatings.length > 0 ? (
                userRatings.map(rating => (
                  <div key={rating.id} className="rating-item">
                    <div className="rating-header">
                      <h3>{rating.profName}</h3>
                      <div className="rating-stars">
                        {[...Array(5)].map((_, i) => (
                          <span
                            key={i}
                            className={`star ${i < Math.floor(rating.rating) ? 'filled' : 'empty'}`}
                          >
                            ★
                          </span>
                        ))}
                        <span className="rating-value">{rating.rating}</span>
                      </div>
                    </div>
                    <p className="rating-subject">{rating.subject}</p>
                    <p className="rating-review">{rating.review}</p>
                  </div>
                ))
              ) : (
                <p className="empty-state">No ratings yet. Rate some professors!</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

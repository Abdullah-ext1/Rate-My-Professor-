import { useState, useEffect } from 'react';
import api from '../context/api.js';

const ProfessorReviewsScreen = ({ professor, onBack, currentUserRole, onDelete }) => {
 const [reviews, setReviews] = useState([]);
const [isLoading, setIsLoading] = useState(true);

useEffect(() => {
  const fetchRatings = async () => {
    try {
      const res = await api.get(`/ratings/${professor.id}`, { withCredentials: true })
      const mapped = res.data.data.ratings.map(r => ({
        id: r._id,
        rating: r.rating,
        title: 'Review',
        content: r.comment,
        date: new Date(r.createdAt).toLocaleDateString(),
        helpful: 0,
        unhelpful: 0,
        userVote: null
      }))
      setReviews(mapped)
    } catch (error) {
      console.error("Error fetching ratings:", error)
    } finally {
      setIsLoading(false)
    }
  }
  fetchRatings()
}, [professor.id])

  const [filterRating, setFilterRating] = useState(null);

  const handleVote = (id, type) => {
    setReviews(prev => prev.map(r => {
      if (r.id === id) {
        if (r.userVote === type) {
          // undo vote
          return {
            ...r,
            helpful: type === 'helpful' ? r.helpful - 1 : r.helpful,
            unhelpful: type === 'unhelpful' ? r.unhelpful - 1 : r.unhelpful,
            userVote: null
          };
        } else {
          // new vote or change vote
          return {
            ...r,
            helpful: type === 'helpful' ? r.helpful + 1 : (r.userVote === 'helpful' ? r.helpful - 1 : r.helpful),
            unhelpful: type === 'unhelpful' ? r.unhelpful + 1 : (r.userVote === 'unhelpful' ? r.unhelpful - 1 : r.unhelpful),
            userVote: type
          };
        }
      }
      return r;
    }));
  };

  const filteredReviews = filterRating ? reviews.filter(r => r.rating === filterRating) : reviews;

  const averageRating = (reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length) : 0).toFixed(1);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <svg
            key={star}
            viewBox="0 0 24 24"
            fill={star <= rating ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
            width="14"
            height="14"
            className={star <= rating ? 'text-accent-amber' : 'text-text3'}
          >
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col flex-1 bg-bg h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-bg z-10 sticky top-0">
        <button 
          onClick={onBack}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-hover active:bg-divider transition-colors"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div>
          <h1 className="text-lg font-bold text-text font-syne">{professor.name}</h1>
          <p className="text-xs text-text3">{professor.department}</p>
        </div>
        <div className="flex-1 flex justify-end">
          {currentUserRole === 'admin' && (
            <button 
              onClick={() => {
                if (window.confirm("Are you sure you want to delete this professor? This cannot be undone.")) {
                  onDelete();
                }
              }} 
              className="px-3 py-1 rounded-xl bg-red-500/10 text-red-500 text-xs font-semibold hover:bg-red-500/20"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Professor Stats */}
        <div className="px-4 py-4 bg-bg2 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-text">{averageRating}</span>
              <div className="flex flex-col">
                {renderStars(Math.round(averageRating))}
                <span className="text-xs text-text3 mt-1">{reviews.length} reviews</span>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex flex-col gap-2">
            {[5, 4, 3, 2, 1].map(rating => {
              const count = reviews.filter(r => r.rating === rating).length;
              const percentage = (count / reviews.length) * 100;
              return (
                <button
                  key={rating}
                  onClick={() => setFilterRating(filterRating === rating ? null : rating)}
                  className={`flex items-center gap-2 transition-colors p-2 rounded-lg ${
                    filterRating === rating ? 'bg-primary/20' : 'hover:bg-bg3'
                  }`}
                >
                  <span className="text-xs font-medium text-text3 w-4">{rating}</span>
                  <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" className="text-accent-amber">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                  </svg>
                  <div className="flex-1 h-2 bg-bg rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                  </div>
                  <span className="text-xs font-medium text-text3 w-6 text-right">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Reviews List */}
        <div className="px-4 py-3 flex flex-col gap-3">
          {filteredReviews.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-text3 text-sm">No reviews found for this rating.</p>
            </div>
          ) : (
            filteredReviews.map(review => (
              <div key={review.id} className="bg-bg2 border border-border rounded-xl p-4 flex flex-col gap-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {renderStars(review.rating)}
                      <span className="text-xs text-text3">{review.date}</span>
                    </div>
                    <h3 className="text-sm font-bold text-text">{review.title}</h3>
                  </div>
                </div>

                <p className="text-xs text-text3 leading-relaxed">{review.content}</p>

                <div className="flex gap-3 text-xs">
                  <span className={`px-2.5 py-1 rounded-full border ${
                    review.difficulty === 'Easy' 
                      ? 'bg-accent-teal/10 border-accent-teal/30 text-accent-teal'
                      : review.difficulty === 'Medium'
                      ? 'bg-accent-amber/10 border-accent-amber/30 text-accent-amber'
                      : 'bg-accent-red/10 border-accent-red/30 text-accent-red'
                  }`}>
                    {review.difficulty}
                  </span>
                  {review.wouldTakeAgain && (
                    <span className="px-2.5 py-1 rounded-full border bg-primary/10 border-primary/30 text-primary-mid">
                      Would take again
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-border">
                  <button onClick={() => handleVote(review.id, 'helpful')} className={`flex items-center gap-1 text-xs transition-colors ${review.userVote === 'helpful' ? 'text-primary-mid' : 'text-text3 hover:text-text'}`}>
                    <svg viewBox="0 0 24 24" fill={review.userVote === 'helpful' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <polyline points="1 12 5 9 1 6"></polyline>
                    </svg>
                    <span>{review.helpful}</span>
                  </button>
                  <button onClick={() => handleVote(review.id, 'unhelpful')} className={`flex items-center gap-1 text-xs transition-colors ${review.userVote === 'unhelpful' ? 'text-accent-red' : 'text-text3 hover:text-text'}`}>
                    <svg viewBox="0 0 24 24" fill={review.userVote === 'unhelpful' ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <polyline points="23 12 19 15 23 18"></polyline>
                    </svg>
                    <span>{review.unhelpful}</span>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorReviewsScreen;

import { useState } from 'react';

const ProfessorReviewsScreen = ({ professor, onBack }) => {
  const [reviews] = useState([
    {
      id: 1,
      rating: 5,
      title: 'Excellent Teacher',
      content: 'Prof Patil is an amazing teacher. He explains concepts very clearly and is always ready to help. His lectures are engaging and he makes complex topics easy to understand.',
      difficulty: 'Easy',
      wouldTakeAgain: true,
      helpful: 156,
      unhelpful: 8,
      date: '2 weeks ago'
    },
    {
      id: 2,
      rating: 4,
      title: 'Good but Fast Paced',
      content: 'Great teacher but moves through the curriculum pretty quickly. If you keep up with the assignments you\'ll be fine. The exams are fair and match the lecture content.',
      difficulty: 'Medium',
      wouldTakeAgain: true,
      helpful: 89,
      unhelpful: 5,
      date: '1 month ago'
    },
    {
      id: 3,
      rating: 5,
      title: 'Best Professor',
      content: 'One of the best professors I\'ve had. Very knowledgeable and passionate about the subject. He encourages class participation and makes everyone feel comfortable asking questions.',
      difficulty: 'Easy',
      wouldTakeAgain: true,
      helpful: 234,
      unhelpful: 12,
      date: '1 month ago'
    },
    {
      id: 4,
      rating: 3,
      title: 'Average',
      content: 'Decent professor. Lectures are okay but sometimes hard to follow. The course material is interesting but the grading seems a bit harsh on exams.',
      difficulty: 'Hard',
      wouldTakeAgain: false,
      helpful: 45,
      unhelpful: 32,
      date: '2 months ago'
    },
    {
      id: 5,
      rating: 4,
      title: 'Very Helpful Office Hours',
      content: 'The lectures are good but I really appreciated the office hours. Prof Patil takes time to work through problems with you individually. Highly recommend attending them.',
      difficulty: 'Medium',
      wouldTakeAgain: true,
      helpful: 178,
      unhelpful: 9,
      date: '2 months ago'
    },
  ]);

  const [filterRating, setFilterRating] = useState(null);

  const filteredReviews = filterRating ? reviews.filter(r => r.rating === filterRating) : reviews;

  const averageRating = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);

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
                  <button className="flex items-center gap-1 text-xs text-text3 hover:text-text transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                      <polyline points="1 12 5 9 1 6"></polyline>
                    </svg>
                    <span>{review.helpful}</span>
                  </button>
                  <button className="flex items-center gap-1 text-xs text-text3 hover:text-text transition-colors">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
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

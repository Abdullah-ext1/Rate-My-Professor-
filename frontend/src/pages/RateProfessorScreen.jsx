import { useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../context/api.js";
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const TopNav = ({ onNavClick }) => (
  <div className="fixed top-0 left-0 right-0 bg-bg px-4 py-2.5 flex items-center gap-3 flex-shrink-0 border-b border-border z-30">
    <button
      onClick={() => onNavClick("professors")}
      className="w-8 h-8 rounded-full bg-bg2 flex items-center justify-center cursor-pointer hover:bg-bg3 transition-colors"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#E2E1EC"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
    <div className="text-base font-bold text-text font-syne tracking-tight">
      Rate Professor
    </div>
  </div>
);

const TagPicker = ({ tags, selectedTags, onToggle }) => (
  <div className="flex flex-wrap gap-2 mt-2">
    {tags.map((tag) => (
      <button
        key={tag}
        onClick={() => onToggle(tag)}
        className={`px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-colors border ${
          selectedTags.includes(tag)
            ? "bg-opacity-20 bg-primary border-opacity-50 border-primary text-primary-mid"
            : "bg-bg2 border-border text-text3 hover:bg-bg3"
        }`}
      >
        {selectedTags.includes(tag) ? "✓ " : "+ "}
        {tag}
      </button>
    ))}
  </div>
);

const RateProfessorScreen = ({ onNavClick }) => {
  const queryClient = useQueryClient();
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(3);
  const [selectedTags, setSelectedTags] = useState([]);
  const [review, setReview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const location = useLocation();
  const professor = location.state?.professor;

  const commonTags = [
    "Tough Grader",
    "Get Ready to Read",
    "Participation Matters",
    "Skip Class? You Won't Pass",
    "Accessible Outside Class",
    "Lots of Homework",
    "Test Heavy",
    "Clear Grading Criteria",
  ];

  const handleTagToggle = (tag) => {
    setSelectedTags((prev) => {
      if (prev.includes(tag)) {
        return prev.filter((t) => t !== tag);
      }
      if (prev.length >= 3) {
        toast.error('You can select up to 3 tags');
        return prev;
      }
      return [...prev, tag];
    });
  };

  const handleToggleStar = (val) => {
    setRating(val);
  };

  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async () => {
    if (isSubmitting) return;

    if (!professor?.id || typeof professor.id !== 'string') {
      setErrorMsg("Professor context missing. Please open rating from the professor page.");
      return;
    }

    if (rating > 0 && review.trim().length > 0) {
      try {
        setIsSubmitting(true);
        setErrorMsg("");
        await api.post(
          `/ratings/${professor.id}`,
          {
            rating,
            comment: review,
            difficulty: Number(difficulty),
            tags: selectedTags,
          },
        );
        queryClient.invalidateQueries({ queryKey: ['professorReviews', professor.id] });
        queryClient.invalidateQueries({ queryKey: ['professors'] });
        toast.success("Professor rating submitted!", { id: 'rate-prof', duration: 2000 });
        onNavClick("professors");
      } catch (error) {
        console.error("Error submitting rating:", error);
        const serverMessage = error?.response?.data?.message;
        setErrorMsg(serverMessage || "Error submitting review");
        toast.error(serverMessage || "Error submitting review");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-full bg-bg">
      <TopNav onNavClick={onNavClick} />
      <div className="flex-1 overflow-y-auto px-4 pt-[60px] pb-24 scrollbar-hide text-text">
        {errorMsg && (
          <div className="mx-4 mt-6 bg-red-400/10 border border-red-400/20 text-red-400 text-xs font-semibold py-3 px-4 rounded-xl text-center">
            {errorMsg}
          </div>
        )}
        <div className="text-center my-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-opacity-20 bg-primary flex items-center justify-center text-2xl font-bold text-primary-mid font-syne mb-3">
            {professor?.initials || "AP"}
          </div>
          <h2 className="text-xl font-bold font-syne">
            {professor?.name || "Professor"}
          </h2>
          <p className="text-sm text-text3">{professor?.subject || ""}</p>
        </div>

        {/* Rating Section */}
        <div className="bg-bg2 border border-border rounded-3xl p-5 mb-4">
          <div className="text-center font-semibold text-sm mb-4">
            Overall Quality
          </div>
          <div className="flex justify-center gap-2 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onClick={() => handleToggleStar(star)}
                className={`p-2 transition-transform hover:scale-110 ${rating >= star ? "text-yellow-400" : "text-text3 opacity-40"}`}
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill={rating >= star ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Slider */}
        <div className="bg-bg2 border border-border rounded-3xl p-5 mb-4">
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold text-sm">Level of Difficulty</span>
            <span className="font-bold text-accent-red font-syne">
              {difficulty} / 5
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            className="w-full h-2 bg-bg3 rounded-lg appearance-none cursor-pointer accent-primary"
          />
        </div>

        {/* Tags */}
        <div className="bg-bg2 border border-border rounded-3xl p-5 mb-4">
          <div className="font-semibold text-sm mb-2">Select up to 3 tags</div>
          <TagPicker
            tags={commonTags}
            selectedTags={selectedTags}
            onToggle={handleTagToggle}
          />
        </div>

        {/* Review Text */}
        <div className="bg-bg2 border border-border rounded-3xl p-5 mb-4">
          <div className="font-semibold text-sm mb-3">Write a Review</div>
          <textarea
            value={review}
            onChange={(e) => setReview(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="What do you want other students to know about this professor?"
            className="w-full bg-bg3 border border-border rounded-2xl p-4 text-sm text-text placeholder-text3 min-h-[120px] resize-none outline-none focus:border-primary-mid transition-colors"
          />
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`w-full py-3.5 rounded-full font-bold text-sm transition-colors ${
            professor?.id && rating > 0 && review.trim().length > 0 && !isSubmitting
              ? "bg-primary text-white cursor-pointer hover:bg-primary-dark shadow-md shadow-primary/20"
              : "bg-bg3 border border-border text-text3 cursor-not-allowed"
          }`}
        >
          {isSubmitting ? "Submitting..." : "Submit Rating"}
        </button>
      </div>
    </div>
  );
};

export default RateProfessorScreen;

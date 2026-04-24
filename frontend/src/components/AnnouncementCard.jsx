import { timeAgo } from '../utils/timeAgo';

const AnnouncementCard = ({ announcement, currentUserRole, onStyleType, onDelete, onUserClick }) => {
  const ownerId = typeof announcement.owner === 'string'
    ? announcement.owner
    : announcement.owner?._id;

  const ownerName = announcement.owner?.name || announcement.author || "Admin";

  return (
  <div className="bg-bg2 border border-border rounded-2xl p-4 shadow-sm hover:border-border2 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <span
        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${onStyleType(announcement.announcementType || announcement.type)}`}
      >
        {announcement.announcementType || announcement.type}
      </span>
      <span className="text-xs text-text3 font-medium">
        {announcement.createdAt ? timeAgo(announcement.createdAt) : 'Just now'}
      </span>
    </div>
    <h3 className="text-sm font-bold text-text mb-1.5">
      {announcement.title}
    </h3>
    <p className="text-xs text-text2 leading-relaxed mb-3">
      {announcement.content}
    </p>
    <div className="flex justify-between items-center pt-2 border-t border-border">
      <div className="flex items-center gap-2">
        <div className="w-5 h-5 rounded-full bg-primary-mid/20 flex items-center justify-center text-[10px] font-bold text-primary-mid">
          {ownerName?.charAt(0) || "A"}
        </div>
        <span className="text-xs font-semibold text-text3">
          <span
            className="hover:text-primary-mid cursor-pointer"
            onClick={() => ownerId && onUserClick?.(ownerId)}
          >
            {ownerName}
          </span>
        </span>
      </div>
      {(currentUserRole === "admin" || currentUserRole === "moderator") && (
        <button
          onClick={() => onDelete(announcement._id || announcement.id)}
          className="text-xs text-red-500/70 hover:text-red-500 font-medium"
        >
          Delete
        </button>
      )}
    </div>
  </div>
  );
};

export default AnnouncementCard;

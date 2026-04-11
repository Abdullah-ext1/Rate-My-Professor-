const Skeleton = ({ className }) => {
  return (
    <div className={`bg-bg3 border border-border animate-pulse rounded-3xl ${className}`}></div>
  );
};

export const PostCardSkeleton = () => {
  return (
    <div className="bg-bg2 border border-border rounded-3xl p-3 mb-3 animate-pulse">
      {/* Header */}
      <div className="flex items-center gap-1.5 mb-2 relative">
        <div className="w-6 h-6 rounded-full bg-bg3 flex-shrink-0"></div>
        <div className="h-3 bg-bg3 rounded w-20"></div>
        <div className="h-4 bg-bg3 rounded-2xl w-16 px-1.5 py-0.5"></div>
        <div className="h-3 bg-bg3 rounded w-8 ml-auto"></div>
      </div>
      
      {/* Title */}
      <div className="h-4 bg-bg3 rounded w-3/4 mb-1.5 mt-2"></div>
      
      {/* Content lines */}
      <div className="h-3 bg-bg3 rounded w-full mb-1 flex-1"></div>
      <div className="h-3 bg-bg3 rounded w-full mb-1 flex-1"></div>
      <div className="h-3 bg-bg3 rounded w-4/5 mb-3 flex-1"></div>
      
      {/* Footer */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-bg3"></div>
          <div className="h-3 bg-bg3 rounded w-6"></div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-bg3"></div>
          <div className="h-3 bg-bg3 rounded w-6"></div>
        </div>
      </div>
    </div>
  );
};

export const ProfCardSkeleton = () => {
  return (
    <div className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 animate-pulse relative">
      <div className="absolute -top-2 -right-2 w-7 h-7 bg-bg3 border border-border rounded-full shadow-sm"></div>
      <div className="flex items-center gap-2.5 mb-2.5">
        <div className="w-9 h-9 rounded-2.5 bg-bg3 flex-shrink-0"></div>
        <div className="flex-1">
          <div className="h-4 bg-bg3 rounded w-1/2 mb-1.5"></div>
          <div className="h-3 bg-bg3 rounded w-1/3"></div>
        </div>
        <div className="text-right mr-4 flex flex-col items-end">
          <div className="h-6 bg-bg3 rounded w-10 mb-1"></div>
          <div className="h-3 bg-bg3 rounded w-16"></div>
        </div>
      </div>
      <div className="flex gap-1.5 flex-wrap mb-2">
        <div className="h-5 bg-bg3 rounded-2xl w-20"></div>
        <div className="h-5 bg-bg3 rounded-2xl w-24"></div>
      </div>
      <div className="h-4 bg-bg3 rounded-2xl w-full mb-1"></div>
      <div className="h-4 bg-bg3 rounded-2xl w-3/4 mb-3"></div>
      <div className="w-full mt-1 bg-bg3 rounded-2xl h-8"></div>
    </div>
  );
};

export const NotificationSkeleton = () => {
  return (
    <div className="flex gap-3 p-4 border-b border-border bg-bg2 animate-pulse">
      <div className="w-8 h-8 rounded-full bg-bg3 flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-4 bg-bg3 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-bg3 rounded w-1/2 mb-2"></div>
        <div className="h-3 bg-bg3 rounded w-16 mt-1.5"></div>
      </div>
    </div>
  );
};

export const LeaderboardItemSkeleton = () => {
  return (
    <div className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 flex items-center gap-3 animate-pulse">
      <div className="w-6 h-6 bg-bg3 rounded text-center"></div>
      <div className="w-10 h-10 rounded-full bg-bg3 flex-shrink-0"></div>
      <div className="flex-1">
        <div className="h-4 bg-bg3 rounded w-3/4 mb-1"></div>
        <div className="h-3 bg-bg3 rounded w-1/2"></div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <div className="w-10 h-10 rounded-lg bg-bg3 border border-border2 shadow-sm"></div>
        <div className="h-3 bg-bg3 rounded w-12 mt-1"></div>
      </div>
    </div>
  );
};

export const AnnouncementSkeleton = () => {
  return (
    <div className="bg-bg2 border border-border rounded-2xl p-4 shadow-sm mb-4 animate-pulse">
      <div className="flex justify-between items-start mb-2">
        <div className="h-4 bg-bg3 rounded-full w-20"></div>
        <div className="h-3 bg-bg3 rounded w-16"></div>
      </div>
      <div className="h-4 bg-bg3 rounded w-3/4 mb-1.5 mt-2"></div>
      <div className="h-3 bg-bg3 rounded w-full mb-3"></div>
      <div className="flex justify-between items-center pt-2 border-t border-border">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-full bg-bg3"></div>
          <div className="h-3 bg-bg3 rounded w-24"></div>
        </div>
      </div>
    </div>
  );
};

export const PYQSkeleton = () => {
  return (
    <div className="bg-bg2 border border-border rounded-3xl p-3.5 mb-3 flex gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-2xl bg-bg3 flex-shrink-0"></div>
      <div className="flex-1 flex flex-col justify-center">
        <div className="h-4 bg-bg3 rounded w-1/2 mb-1.5"></div>
        <div className="flex items-center gap-2">
          <div className="h-3 bg-bg3 rounded w-12"></div>
          <div className="w-1 h-1 rounded-full bg-border2"></div>
          <div className="h-3 bg-bg3 rounded w-16"></div>
        </div>
      </div>
      <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-bg3"></div>
    </div>
  );
};

export default Skeleton;
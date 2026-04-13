import { useAuth } from "./AuthContext.jsx";
import { Navigate } from "react-router-dom";

const PendingApprovalScreen = ({ userName }) => (
  <div className="flex flex-col flex-1 overflow-hidden bg-bg relative min-h-screen items-center justify-center">
    <div className="w-full max-w-sm text-center px-6">
      <div className="text-6xl mb-4">⏳</div>
      <h1 className="text-2xl font-bold text-text mb-3">Pending Approval</h1>
      <p className="text-sm text-text3 mb-6">
        Hi {userName}! Your account is pending moderator review. You'll get access to the community once approved.
      </p>
      <p className="text-xs text-text3 italic">
        Please check back later or wait for a notification.
      </p>
    </div>
  </div>
);

const RejectedScreen = () => (
  <div className="flex flex-col flex-1 overflow-hidden bg-bg relative min-h-screen items-center justify-center">
    <div className="w-full max-w-sm text-center px-6">
      <div className="text-6xl mb-4">❌</div>
      <h1 className="text-2xl font-bold text-text mb-3">Account Rejected</h1>
      <p className="text-sm text-text3 mb-6">
        Unfortunately, your account application was not approved. Please contact support for more information.
      </p>
      <button 
        onClick={() => window.location.href = '/login'}
        className="mt-4 px-6 py-2 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
      >
        Back to Login
      </button>
    </div>
  </div>
);

export const ProtectedRoute = ({children}) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  
  // Admins bypass status check
  if (user.role === 'admin') return <>{children}</>;
  
  // Non-admin users must have 'active' status
  if (user.status === 'pending') return <PendingApprovalScreen userName={user.name} />;
  if (user.status === 'rejected') return <RejectedScreen />;

  return <>{children}</>;
}
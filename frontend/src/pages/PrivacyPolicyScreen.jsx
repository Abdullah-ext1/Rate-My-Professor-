import { motion } from 'framer-motion';

const PrivacyPolicyScreen = ({ onNavClick }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="flex flex-col flex-1 overflow-hidden bg-bg relative min-h-screen"
    >
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 bg-bg/90 backdrop-blur-md border-b border-border z-40 px-4 py-3 flex items-center gap-3">
        <button 
          onClick={() => onNavClick('profile')} 
          className="text-text3 hover:text-text transition-colors p-1"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <span className="text-sm font-semibold text-text">Privacy & Safety</span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4 pt-20 pb-24 scrollbar-hide text-text">
        <div className="mb-8">
          <h1 className="text-2xl font-bold font-syne mb-2">Privacy Policy</h1>
          <p className="text-xs text-text3 mb-6">Last updated: April 13, 2026</p>

          <div className="space-y-6 text-sm leading-relaxed">
            <section>
              <h2 className="font-bold text-base mb-2 text-primary-mid">1. Anonymity First</h2>
              <p>
                Your privacy is our core feature. When you post a rating of any professor, your identity is masked. We do not expose your email, name, or student ID to other users.
              </p>
            </section>

            <section>
              <h2 className="font-bold text-base mb-2 text-primary-mid">2. Data Collection</h2>
              <p>
                We only collect data necessary to maintain a safe campus environment:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-text3">
                <li>Your college email (for domain verification only)</li>
                <li>Your internal platform interactions (likes, saves, posts)</li>
                <li>Vault document uploads for moderation queues</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-2 text-primary-mid">3. Safety Guidelines</h2>
              <p>
                While anonymous, this platform is strictly moderated. Accounts found violating these rules will be permanently banned:
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-text3">
                <li>No targeted harassment or bullying of students or professors.</li>
                <li>No hate speech, racism, sexism, or discrimination.</li>
                <li>No sharing of deeply personal or identifying information of others.</li>
                <li>No illegal content or coordinated academic dishonesty (cheating).</li>
              </ul>
            </section>

            <section>
              <h2 className="font-bold text-base mb-2 text-primary-mid">4. Moderation & Reports</h2>
              <p>
                Platform Moderators and Administrators have the ability to delete posts that violate safety guidelines. If you encounter unsafe content, please use the report function immediately. Repeated violations will result in automated account bans without appeal.
              </p>
            </section>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacyPolicyScreen;

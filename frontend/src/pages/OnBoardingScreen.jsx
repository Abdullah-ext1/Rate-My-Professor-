import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from "../context/api.js";
import { useAuth } from '../context/AuthContext.jsx';
import { DEPARTMENTS } from '../utils/departments.js';

const OnBoardingScreen = () => {
  const { user, refetchUser } = useAuth();
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    college: '',
    department: '',
    year: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [usernameError, setUsernameError] = useState(null);
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [domainMatched, setDomainMatched] = useState(true);

  useEffect(() => {
    const fetchColleges = async () => {
      try {
        const response = await api.get(`/colleges`);
        const fetchedColleges = response.data.data;
        if (fetchedColleges) {
          setColleges(fetchedColleges);

          // Auto-assign college based on Google email domain
          if (user && user.email) {
            const userDomain = user.email.split('@')[1];
            const matchedCollege = fetchedColleges.find(c => c.domain === userDomain);
            if (matchedCollege) {
              setFormData(prev => ({ ...prev, college: matchedCollege._id }));
              setDomainMatched(true);
            } else {
              setDomainMatched(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch colleges", err);
      }
    };
    fetchColleges();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    
    // Check username availability when username field changes
    if (e.target.name === 'username') {
      if (e.target.value.trim().length > 0) {
        checkUsernameAvailability(e.target.value.trim());
      } else {
        setUsernameError(null);
      }
    }
  };

  const checkUsernameAvailability = async (username) => {
    setCheckingUsername(true);
    try {
      const response = await api.get(`/auth/check-username?username=${username}`);
      if (response.data.exists) {
        setUsernameError('This username is already taken. Please try another.');
      } else {
        setUsernameError(null);
      }
    } catch (err) {
      console.error('Error checking username:', err);
      setUsernameError(null);
    } finally {
      setCheckingUsername(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Admins only need to set username, skip college/department/year
    if (user?.role === 'admin') {
      if (!formData.username) {
        setError("Please enter a username");
        return;
      }
      if (usernameError) {
        setError("Please choose a different username");
        return;
      }
    } else {
      // Regular users need all fields
      if (!formData.username || !formData.college || !formData.department || !formData.year) {
        setError("Please fill in all fields");
        return;
      }
      if (usernameError) {
        setError("Please choose a different username");
        return;
      }
    }

    setLoading(true);
    try {
      const response = await api.put(`/auth/onboarding`, formData)
      await refetchUser();
      navigate('/feed');
    } catch (err) {
      console.error(err);
      setError("An error occurred during onboarding.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-bg flex flex-col items-center justify-center p-8 min-h-screen">
      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-4xl font-bold mb-2 text-center">
          campus<span className="text-primary-mid">.</span>
        </div>
        <p className="text-sm text-text3 leading-relaxed mb-8 text-center">
          {user?.role === 'admin' ? 'Set your admin username' : 'Complete your profile to join your college community.'}
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 text-xs px-4 py-3 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-text2 ml-1">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Choose your username..."
              className="bg-bg2 border border-border2 focus:border-primary px-4 py-3.5 rounded-xl text-text text-sm outline-none transition-colors"
            />
            {checkingUsername && (
              <p className="text-xs text-text3 ml-1">Checking availability...</p>
            )}
            {usernameError && (
              <p className="text-xs text-red-500 ml-1">{usernameError}</p>
            )}
            {formData.username && !usernameError && !checkingUsername && (
              <p className="text-xs text-accent-teal ml-1">✓ Username available</p>
            )}
          </div>

          {user?.role !== 'admin' && (
            <>
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text2 ml-1">College</label>
                {domainMatched ? (
                  <div className="bg-bg3 border border-border2 px-4 py-3.5 rounded-xl text-text3 text-sm flex items-center cursor-not-allowed">
                    {formData.college 
                      ? colleges.find(c => c._id === formData.college)?.name 
                      : "Checking your college email domain..."}
                  </div>
                ) : (
                  <div className="relative">
                    <select
                      name="college"
                      value={formData.college}
                      onChange={handleChange}
                      className="bg-bg2 border border-border2 focus:border-primary px-4 py-3.5 rounded-xl text-text text-sm w-full outline-none transition-colors appearance-none"
                    >
                      <option value="">Select your college...</option>
                      {colleges.map(c => (
                        <option key={c._id} value={c._id}>{c.name}</option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text3">
                      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                    </div>
                  </div>
                )}
                {/* hidden select just in case anything else accesses it */}
                {domainMatched && <input type="hidden" name="college" value={formData.college} />}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text2 ml-1">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="bg-bg2 border border-border2 focus:border-primary px-4 py-3.5 rounded-xl text-text text-sm outline-none transition-colors appearance-none"
                >
                  <option value="">Select department...</option>
                  {DEPARTMENTS.map((dept) => (
                    <option key={dept.value} value={dept.value}>{dept.label}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text2 ml-1">Year of Study</label>
                <select
                  name="year"
                  value={formData.year}
                  onChange={handleChange}
                  className="bg-bg2 border border-border2 focus:border-primary px-4 py-3.5 rounded-xl text-text text-sm outline-none transition-colors appearance-none"
                >
                  <option value="">Select year...</option>
                  <option value="1">First Year (FE)</option>
                  <option value="2">Second Year (SE)</option>
                  <option value="3">Third Year (TE)</option>
                  <option value="4">Final Year (BE)</option>
                </select>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (user?.role === 'admin' ? 'Setting up...' : 'Joining...') : (user?.role === 'admin' ? 'Complete Setup' : 'Join Community')}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnBoardingScreen;
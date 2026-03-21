import React, { useState, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { EnvelopeIcon, CheckCircleIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const SignupPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [dbdMailUsername, setDbdMailUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '', color: 'bg-white/10' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const map = {
      0: { score: 0, label: 'Very Weak', color: 'bg-red-500' },
      1: { score: 1, label: 'Weak', color: 'bg-orange-500' },
      2: { score: 2, label: 'Medium', color: 'bg-yellow-500' },
      3: { score: 3, label: 'Strong', color: 'bg-blue-500' },
      4: { score: 4, label: 'Very Strong', color: 'bg-green-500' },
    };
    return map[score];
  }, [password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullEmail = `${dbdMailUsername.trim().toLowerCase()}@dbdmail.com`;

    if (dbdMailUsername.length < 3) {
      return toast.error("Username must be at least 3 characters");
    }

    if (passwordStrength.score < 3) {
      return toast.error("Password is too weak. Please follow the requirements.");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords don't match");
    }

    setLoading(true);

    try {
      await signup(fullEmail, password, displayName);
      // Since it's @dbdmail.com, verification is skipped in AuthContext, 
      // but we can still show a success state or just redirect.
      // The user wanted "verification check" UI for legacy, but for dbdmail we can just enter.
      toast.success('Your trial begins in the Fog...');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    // This part is for legacy emails or if we still want to show a success message
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-dbd-red/20 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-md px-6 z-10 py-12 text-center">
          <div className="glass-card p-10 border border-white/10 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-dbd-red/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-dbd-red/20">
              <CheckCircleIcon className="w-10 h-10 text-dbd-red" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white mb-4">
              WELCOME TO THE <span className="text-dbd-red">FOG</span>
            </h1>
            <p className="text-smoke mb-8 leading-relaxed">
              Account created successfully with DBDMail.<br />
              No verification needed. Step into the arena.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-dbd-red hover:bg-dbd-red/80 text-white font-black py-4 rounded-lg transition-all uppercase tracking-widest italic"
              >
                Enter the Fog
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-dbd-red/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md px-6 z-10 py-12">
        <div className="glass-card p-8 border border-white/10 relative overflow-hidden">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">
              JOIN THE <span className="text-dbd-red">TRIAL</span>
            </h1>
            <p className="text-smoke text-sm">Create your community profile</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-smoke mb-2">
                Display Name
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors placeholder:opacity-30"
                placeholder="The Entity"
              />
            </div>

            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-smoke">
                  DBDMail Address
                </label>
                <div className="relative">
                  <InformationCircleIcon 
                    className="w-4 h-4 text-smoke/50 cursor-help hover:text-white transition-colors"
                    onMouseEnter={() => setShowTooltip(true)}
                    onMouseLeave={() => setShowTooltip(false)}
                  />
                  {showTooltip && (
                    <div className="absolute bottom-full left-0 mb-2 w-64 p-3 bg-obsidian-light border border-white/10 rounded-lg shadow-2xl z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
                      <p className="text-[10px] text-smoke leading-relaxed uppercase tracking-wider font-bold">
                        Security & Trust: <span className="text-white">We don't need your real email. Just choose a unique username. Your account will be "@dbdmail.com"</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="text"
                  required
                  value={dbdMailUsername}
                  onChange={(e) => setDbdMailUsername(e.target.value.replace(/\s+/g, ''))}
                  className="w-full bg-obsidian-light border border-white/10 rounded-l-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors placeholder:opacity-30"
                  placeholder="survivor_name"
                />
                <div className="bg-white/5 border border-l-0 border-white/10 rounded-r-lg px-3 py-3 text-smoke font-bold text-sm">
                  @dbdmail.com
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-smoke mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors placeholder:opacity-30"
                placeholder="••••••••"
              />
              {/* Strength Meter */}
              <div className="mt-3 space-y-2">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div 
                      key={i} 
                      className={`flex-1 rounded-full transition-all duration-500 ${
                        i <= passwordStrength.score ? passwordStrength.color : 'bg-white/5'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[9px] uppercase tracking-widest font-bold">
                  <span className={passwordStrength.score > 0 ? 'text-white' : 'text-smoke'}>
                    {passwordStrength.label || 'Enter Password'}
                  </span>
                  <span className="text-smoke/50">8+ Chars / A-Z / 0-9 / #!%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-smoke mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors placeholder:opacity-30"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading || passwordStrength.score < 3}
              className="w-full bg-dbd-red hover:bg-dbd-red/80 text-white font-black py-4 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:grayscale disabled:scale-100 uppercase tracking-widest italic mt-4"
            >
              {loading ? 'Manifesting...' : 'Start Trial'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-smoke text-sm">
              Already a victim?{' '}
              <Link to="/login" className="text-white hover:text-dbd-red font-bold transition-colors">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

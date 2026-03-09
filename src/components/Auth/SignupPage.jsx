import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { EnvelopeIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const SignupPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    return String(email)
      .toLowerCase()
      .match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address");
    }

    if (password !== confirmPassword) {
      return toast.error("Passwords don't match");
    }

    setLoading(true);

    try {
      await signup(email, password, displayName);
      setVerificationSent(true);
      toast.success('Your trial begins in the Fog...');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  if (verificationSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-obsidian relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-dbd-red/20 rounded-full blur-[120px]" />
        </div>

        <div className="w-full max-w-md px-6 z-10 py-12 text-center">
          <div className="glass-card p-10 border border-white/10 animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-dbd-red/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-dbd-red/20">
              <EnvelopeIcon className="w-10 h-10 text-dbd-red animate-pulse" />
            </div>
            <h1 className="text-3xl font-black italic tracking-tighter text-white mb-4">
              CHECK YOUR <span className="text-dbd-red">INBOX</span>
            </h1>
            <p className="text-smoke mb-8 leading-relaxed">
              We've sent a verification link to <span className="text-white font-bold">{email}</span>.<br />
              Please check your email and verify your account to enter the Fog.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={() => navigate('/login')}
                className="w-full bg-dbd-red hover:bg-dbd-red/80 text-white font-black py-4 rounded-lg transition-all uppercase tracking-widest italic"
              >
                Go to Login
              </button>
              <button
                onClick={() => setVerificationSent(false)}
                className="text-smoke hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Didn't get the email? Try again
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
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors"
                placeholder="The Entity"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-smoke mb-2">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors"
                placeholder="survivor@entity.fog"
              />
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
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors"
                placeholder="••••••••"
              />
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
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dbd-red hover:bg-dbd-red/80 text-white font-black py-4 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 uppercase tracking-widest italic mt-4"
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

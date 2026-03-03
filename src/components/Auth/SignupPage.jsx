import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';

const SignupPage = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Passwords don't match");
    }

    setLoading(true);

    try {
      await signup(email, password, displayName);
      toast.success('Your trial begins now...');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

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
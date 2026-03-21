import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // If it's a DBDMail username (no @), append the domain
    const finalEmail = email.includes('@') ? email : `${email.trim().toLowerCase()}@dbdmail.com`;

    try {
      await login(finalEmail, password);
      toast.success('Welcome back to the Fog');
      navigate('/');
    } catch (error) {
      console.error(error);
      toast.error(error.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-obsidian relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-dbd-red/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-blue-900/20 rounded-full blur-[100px]" />
      </div>

      <div className="w-full max-w-md px-6 z-10">
        <div className="glass-card p-8 border border-white/10 relative overflow-hidden">
          {/* Animated Tally Accent */}
          <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-40 transition-opacity">
            <div className="flex gap-1 h-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-1 h-full bg-dbd-red skew-x-[-15deg] rounded-full" />
              ))}
              <div className="w-1 h-full bg-dbd-red skew-x-[15deg] rotate-[45deg] -translate-x-3 rounded-full" />
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-4xl font-black italic tracking-tighter text-white mb-2">
              MERCY IS <span className="text-dbd-red">NOT</span> AN OPTION
            </h1>
            <p className="text-smoke text-sm">Sign in to your community account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-smoke mb-2">
                DBDMail or Email
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors placeholder:opacity-30"
                placeholder="username or email"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-smoke">
                  Password
                </label>
                <a href="#" className="text-[10px] text-dbd-red hover:underline font-bold uppercase tracking-wider">
                  Lost in the fog?
                </a>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-light border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-dbd-red/50 transition-colors"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-dbd-red hover:bg-dbd-red/80 text-white font-black py-4 rounded-lg transition-all transform active:scale-95 disabled:opacity-50 disabled:scale-100 uppercase tracking-widest italic"
            >
              {loading ? 'Entering the Fog...' : 'Enter the Fog'}
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-smoke hover:text-dbd-red transition-colors group text-sm font-bold uppercase tracking-widest italic"
            >
              <ArrowLeftIcon className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>Back to Home</span>
            </Link>
          </form>

          <div className="mt-8 pt-6 border-t border-white/5 text-center">
            <p className="text-smoke text-sm">
              New to the trial?{' '}
              <Link to="/signup" className="text-white hover:text-dbd-red font-bold transition-colors">
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Footer Quote */}
        <p className="text-center mt-8 text-[10px] uppercase tracking-[0.2em] text-smoke opacity-50">
          "Death is not an escape"
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
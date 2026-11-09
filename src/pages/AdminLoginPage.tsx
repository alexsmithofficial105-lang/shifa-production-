import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Shield, User, KeyRound } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const { navigateTo, showToast } = useApp();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigateTo('admin-dashboard');
    }
  }, [isAuthenticated, navigateTo]);

  if (isAuthenticated) {
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanInput = identifier.trim();
    const cleanLower = cleanInput.toLowerCase();
    const trimmedPass = password.trim();

    if (!cleanInput) {
      setError('Please enter your authorized administrator username.');
      return;
    }

    if (!trimmedPass) {
      setError('Please enter your administrator password.');
      return;
    }

    const strictlyAllowed = [
      'shifa productions',
      'shifaproductions',
      'shifaproductions.pk@gmail.com',
    ];
    if (!strictlyAllowed.includes(cleanLower)) {
      setError(`Access Denied: "${cleanInput}" is not recognized. Required username: "SHIFA PRODUCTIONS".`);
      return;
    }

    try {
      setLoading(true);
      await login(cleanInput, trimmedPass);
      showToast(`Welcome! Signed in as ${cleanInput}`, 'success');
      navigateTo('admin-dashboard');
    } catch (err: any) {
      const msg = err.message || 'Access Denied: Invalid username or password.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#050505] text-neutral-100 animate-fadeIn relative">
      <div className="w-full max-w-md bg-[#0c0c0c] border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-7 relative">
        <button
          onClick={() => navigateTo('home')}
          className="absolute top-6 left-6 text-neutral-400 hover:text-[#EAB308] transition-colors flex items-center gap-1.5 text-xs min-h-[44px] min-w-[44px] -ml-2 -mt-2 p-2 cursor-pointer"
          aria-label="Back to main site"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </button>

        <div className="text-center space-y-3 pt-4">
          <img
            src="/images/shifa_productions_logo.png"
            alt="Shifa Productions Logo"
            className="h-16 w-auto object-contain mx-auto drop-shadow-md"
          />
          <div>
            <h1 className="text-2xl font-bold text-white font-brand">
              Studio Admin Portal
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Sign in with username <span className="text-[#EAB308] font-semibold">SHIFA PRODUCTIONS</span> & password
            </p>
          </div>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/90 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Username & Password Login Form ONLY */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Admin Username
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="SHIFA PRODUCTIONS"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#EAB308]"
              />
            </div>
            <p className="text-[11px] text-neutral-500">
              Authorized Username: <span className="text-[#EAB308] font-mono font-medium">SHIFA PRODUCTIONS</span>
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Admin Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#EAB308]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors p-1 cursor-pointer"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full min-h-[48px] py-3.5 text-xs uppercase tracking-wider font-bold text-black bg-gradient-to-r from-[#FBBF24] via-[#EAB308] to-[#CA8A04] rounded-xl hover:brightness-110 disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#EAB308]/20 cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-black" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-black" />
                <span>Sign In to Admin Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Security Access Note */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2 text-xs text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#EAB308] font-semibold uppercase tracking-wider text-[11px]">
            <Shield className="w-3.5 h-3.5" />
            <span>Encrypted Credentials Only</span>
          </div>
          <p className="text-neutral-400 text-[11px] leading-relaxed">
            Google Sign-in disabled. Login is strictly restricted to administrator username <strong className="text-white font-mono">SHIFA PRODUCTIONS</strong> and secure password.
          </p>
        </div>
      </div>
    </div>
  );
};

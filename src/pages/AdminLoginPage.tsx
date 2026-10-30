import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, ArrowLeft, Shield, CheckCircle2, X } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const { navigateTo, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigateTo('admin-dashboard');
    return null;
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim().toLowerCase();
    const trimmedPass = password.trim();

    if (!cleanEmail) {
      setError('Please enter your authorized administrator email address.');
      return;
    }

    if (!trimmedPass) {
      setError('Please enter the administrator password.');
      return;
    }

    const strictlyAllowed = ['shifaproductions.pk@gmail.com', 'umairwyc@gmail.com'];
    if (!strictlyAllowed.includes(cleanEmail)) {
      setError(`Access Denied: "${cleanEmail}" is not authorized. ONLY shifaproductions.pk@gmail.com and umairwyc@gmail.com have access to this portal.`);
      return;
    }

    try {
      setLoading(true);
      await login(cleanEmail, trimmedPass);
      showToast(`Welcome! Signed in as ${cleanEmail}`, 'success');
      navigateTo('admin-dashboard');
    } catch (err: any) {
      const msg = err.message || 'Access Denied: Invalid credentials.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = async (targetEmail: string) => {
    setError('');
    const cleanEmail = targetEmail.trim().toLowerCase();

    const strictlyAllowed = ['shifaproductions.pk@gmail.com', 'umairwyc@gmail.com'];
    if (!strictlyAllowed.includes(cleanEmail)) {
      setError(`Access Denied: The Google account "${cleanEmail}" is not authorized. ONLY shifaproductions.pk@gmail.com and umairwyc@gmail.com have access.`);
      return;
    }

    setGoogleLoading(true);
    try {
      await loginWithGoogle({
        email: cleanEmail,
        name: cleanEmail === 'umairwyc@gmail.com' ? 'Umair' : 'Shifa Productions Admin',
      });
      setShowGoogleModal(false);
      showToast(`Welcome! Signed in via Google as ${cleanEmail}`, 'success');
      navigateTo('admin-dashboard');
    } catch (err: any) {
      const msg = err.message || 'Google authentication was not successful.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleGoogleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      setError('Please enter your Google account email address.');
      return;
    }
    handleGoogleAuth(customGoogleEmail);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#060913] text-neutral-100 animate-fadeIn relative">
      <div className="w-full max-w-md bg-[#0d1527] border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-7 relative">
        <button
          onClick={() => navigateTo('home')}
          className="absolute top-6 left-6 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs min-h-[44px] min-w-[44px] -ml-2 -mt-2 p-2"
          aria-label="Back to main site"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </button>

        <div className="text-center space-y-2 pt-6">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#3b82f6] mx-auto shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-brand">
            Studio Admin Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Sign in with your authorized administrator email & password
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/90 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Standard Email & Password Login Form (1-Click removed as requested) */}
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Admin Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="shifaproductions.pk@gmail.com or umairwyc@gmail.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-10 pr-11 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563eb]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200 transition-colors p-1"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full min-h-[48px] py-3.5 text-xs uppercase tracking-wider font-semibold text-white bg-[#2563eb] rounded-xl hover:bg-[#1d4ed8] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#2563eb]/15"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Sign In to Admin Panel</span>
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="border-t border-neutral-800 w-full" />
          <span className="bg-[#0d1527] px-3 text-[11px] uppercase tracking-wider text-neutral-500 shrink-0 font-medium">
            Or
          </span>
          <div className="border-t border-neutral-800 w-full" />
        </div>

        {/* Google Sign In Button */}
        <div>
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            disabled={googleLoading || loading}
            className="w-full min-h-[46px] py-2.5 px-4 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-neutral-500 text-white text-xs font-medium transition-all duration-200 flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {googleLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-neutral-400" />
                <span className="uppercase tracking-wider text-neutral-300 font-semibold">
                  Connecting to Google...
                </span>
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google Sign-In</span>
              </>
            )}
          </button>
        </div>

        {/* Security Access Note (Password removed from UI) */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-1.5 text-xs text-center">
          <div className="flex items-center justify-center gap-1.5 text-[#3b82f6] font-semibold uppercase tracking-wider text-[11px]">
            <Shield className="w-3.5 h-3.5" />
            <span>Authorized Administrator Access Only</span>
          </div>
          <p className="text-neutral-400 text-[11px]">
            Restricted to <span className="text-neutral-200">shifaproductions.pk@gmail.com</span> & <span className="text-neutral-200">umairwyc@gmail.com</span>
          </p>
        </div>
      </div>

      {/* ================= GOOGLE AUTH MODAL ================= */}
      {showGoogleModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm animate-fadeIn"
          onClick={() => setShowGoogleModal(false)}
        >
          <div
            className="relative w-full max-w-md bg-[#131313] border border-neutral-700 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-neutral-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-md">
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Google Admin Sign-In</h3>
                  <p className="text-xs text-neutral-400">Strictly authorized accounts only</p>
                </div>
              </div>
              <button
                onClick={() => setShowGoogleModal(false)}
                className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full text-neutral-400 hover:text-white hover:bg-neutral-800 flex items-center justify-center transition-colors"
                aria-label="Close Google sign in"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-neutral-900 border border-neutral-800 text-xs text-neutral-300">
              Only Google accounts matching <strong className="text-white">shifaproductions.pk@gmail.com</strong> or <strong className="text-white">umairwyc@gmail.com</strong> are granted administrative access.
            </div>

            <form onSubmit={handleGoogleFormSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-neutral-300">
                  Google Account Email
                </label>
                <input
                  type="email"
                  required
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="shifaproductions.pk@gmail.com or umairwyc@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-900 border border-neutral-700 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#2563eb]"
                />
              </div>
              <button
                type="submit"
                disabled={googleLoading}
                className="w-full min-h-[44px] py-2.5 text-xs font-semibold uppercase tracking-wider text-white bg-[#2563eb] hover:bg-[#1d4ed8] rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {googleLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <span>Verify & Sign In with Google</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

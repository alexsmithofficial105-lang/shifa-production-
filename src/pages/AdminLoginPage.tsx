import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { Mail, AlertCircle, Loader2, ArrowLeft, Shield, CheckCircle2, User, X, Sparkles, ArrowRight } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { login, loginWithGoogle, isAuthenticated } = useAuth();
  const { navigateTo, showToast } = useApp();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [customGoogleName, setCustomGoogleName] = useState('');

  // If already authenticated, redirect
  if (isAuthenticated) {
    navigateTo('admin-dashboard');
    return null;
  }

  const handleDirectAccess = async (targetEmail: string) => {
    setError('');
    const clean = targetEmail.trim().toLowerCase();

    if (!clean) {
      setError('Please enter your authorized administrator email address.');
      return;
    }

    try {
      setLoading(true);
      await login(clean);
      showToast(`Welcome! Signed in as ${clean}`, 'success');
      navigateTo('admin-dashboard');
    } catch (err: any) {
      const msg = err.message || 'Access Denied: Email is not authorized for administrator access.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleDirectAccess(email);
  };

  const handleGoogleAuth = async (targetEmail: string, displayName: string) => {
    setError('');
    setGoogleLoading(true);
    try {
      await loginWithGoogle({
        email: targetEmail.trim().toLowerCase(),
        name: displayName.trim(),
      });
      setShowGoogleModal(false);
      showToast(`Welcome! Signed in via Google as ${targetEmail}`, 'success');
      navigateTo('admin-dashboard');
    } catch (err: any) {
      const msg = err.message || 'Google authentication was not successful.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleCustomGoogleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail.trim()) {
      setError('Please enter your Google account email address.');
      return;
    }
    handleGoogleAuth(customGoogleEmail, customGoogleName || customGoogleEmail.split('@')[0]);
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6 bg-[#080808] text-neutral-100 animate-fadeIn relative">
      <div className="w-full max-w-lg bg-[#101010] border border-neutral-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-7 relative">
        <button
          onClick={() => navigateTo('home')}
          className="absolute top-6 left-6 text-neutral-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs min-h-[44px] min-w-[44px] -ml-2 -mt-2 p-2"
          aria-label="Back to main site"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Site</span>
        </button>

        <div className="text-center space-y-2 pt-6">
          <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-[#c5a059] mx-auto shadow-inner">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-brand">
            Studio Admin Portal
          </h1>
          <p className="text-xs text-neutral-400">
            Shifa Productions Management Panel (Password Requirement Removed)
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/90 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* ================= 1-CLICK INSTANT ADMIN ACCESS CARDS ================= */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-neutral-400">
            <span>Authorized Admin Accounts</span>
            <span className="text-[10px] text-[#c5a059] flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> 1-Click Access
            </span>
          </div>

          {/* Account 1: shifaproductions.pk@gmail.com */}
          <button
            type="button"
            disabled={loading || googleLoading}
            onClick={() => handleDirectAccess('shifaproductions.pk@gmail.com')}
            className="w-full p-4 rounded-xl bg-[#161616] hover:bg-[#1f1f1f] border border-[#c5a059]/40 hover:border-[#c5a059] transition-all flex items-center justify-between text-left group shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-[#c5a059] text-black font-bold flex items-center justify-center text-sm shrink-0 shadow-md">
                SP
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#c5a059] transition-colors flex items-center gap-2">
                  <span>Shifa Productions Admin</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-800/80">
                    Primary Admin
                  </span>
                </div>
                <div className="text-xs text-neutral-300 font-mono mt-0.5">
                  shifaproductions.pk@gmail.com
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#c5a059] font-medium shrink-0">
              <span className="hidden sm:inline">Enter Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Account 2: umairwyc@gmail.com */}
          <button
            type="button"
            disabled={loading || googleLoading}
            onClick={() => handleDirectAccess('umairwyc@gmail.com')}
            className="w-full p-4 rounded-xl bg-[#161616] hover:bg-[#1f1f1f] border border-neutral-700/80 hover:border-[#c5a059] transition-all flex items-center justify-between text-left group shadow-lg"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shrink-0 shadow-md">
                U
              </div>
              <div>
                <div className="text-sm font-semibold text-white group-hover:text-[#c5a059] transition-colors flex items-center gap-2">
                  <span>Umair</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/80">
                    Administrator
                  </span>
                </div>
                <div className="text-xs text-neutral-300 font-mono mt-0.5">
                  umairwyc@gmail.com
                </div>
              </div>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#c5a059] font-medium shrink-0">
              <span className="hidden sm:inline">Enter Portal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-neutral-800 w-full" />
          <span className="bg-[#101010] px-3 text-[11px] uppercase tracking-wider text-neutral-500 shrink-0 font-medium">
            Or enter authorized email
          </span>
          <div className="border-t border-neutral-800 w-full" />
        </div>

        {/* Passwordless Email Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
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
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-neutral-900 border border-neutral-800 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a059]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="w-full min-h-[48px] py-3.5 text-xs uppercase tracking-wider font-semibold text-black bg-[#c5a059] rounded-xl hover:bg-[#d4af37] disabled:opacity-50 transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#c5a059]/15"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authorizing Admin Access...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Access Admin Panel (No Password Needed)</span>
              </>
            )}
          </button>
        </form>

        {/* ================= GOOGLE SIGN IN BUTTON ================= */}
        <div className="pt-2 border-t border-neutral-800/80">
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

        <div className="p-3.5 rounded-xl bg-neutral-900/40 border border-neutral-800 text-center text-neutral-400 text-xs leading-relaxed">
          <div className="flex items-center justify-center gap-1.5 text-emerald-400 font-medium mb-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Password Protection Removed</span>
          </div>
          <div>
            Direct administrative access is granted for <strong className="text-white">shifaproductions.pk@gmail.com</strong> and <strong className="text-white">umairwyc@gmail.com</strong>.
          </div>
        </div>
      </div>

      {/* ================= GOOGLE ACCOUNT SELECTOR MODAL ================= */}
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
                  <h3 className="text-lg font-bold text-white">Sign in with Google</h3>
                  <p className="text-xs text-neutral-400">Choose authorized administrator account</p>
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

            {/* Quick-choice accounts */}
            <div className="space-y-2.5">
              {/* Account 1: shifaproductions.pk@gmail.com */}
              <button
                type="button"
                disabled={googleLoading}
                onClick={() => handleGoogleAuth('shifaproductions.pk@gmail.com', 'Shifa Productions Admin')}
                className="w-full p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-[#c5a059]/40 hover:border-[#c5a059] transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#c5a059] text-black font-bold flex items-center justify-center text-sm shrink-0">
                    SP
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#c5a059] transition-colors flex items-center gap-1.5">
                      <span>Shifa Productions Admin</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800/80">
                        Primary
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">shifaproductions.pk@gmail.com</div>
                  </div>
                </div>
                <div className="text-xs text-[#c5a059] font-medium hidden sm:block">
                  Sign In →
                </div>
              </button>

              {/* Account 2: umairwyc@gmail.com */}
              <button
                type="button"
                disabled={googleLoading}
                onClick={() => handleGoogleAuth('umairwyc@gmail.com', 'Umair')}
                className="w-full p-3.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 border border-neutral-700/80 hover:border-[#c5a059] transition-all flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center text-sm shrink-0">
                    U
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#c5a059] transition-colors flex items-center gap-1.5">
                      <span>Umair</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/80">
                        Admin
                      </span>
                    </div>
                    <div className="text-xs text-neutral-400 font-mono">umairwyc@gmail.com</div>
                  </div>
                </div>
                <div className="text-xs text-[#c5a059] font-medium hidden sm:block">
                  Sign In →
                </div>
              </button>
            </div>

            {/* Custom Google Account Option */}
            <div className="pt-2 border-t border-neutral-800">
              <div className="text-xs font-semibold text-neutral-300 uppercase tracking-wider mb-2">
                Or enter another authorized email:
              </div>
              <form onSubmit={handleCustomGoogleSubmit} className="space-y-3">
                <input
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  placeholder="shifaproductions.pk@gmail.com"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#c5a059]"
                />
                <button
                  type="submit"
                  disabled={googleLoading}
                  className="w-full py-2.5 text-xs font-semibold uppercase tracking-wider text-black bg-[#c5a059] hover:bg-[#d4af37] rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  {googleLoading ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <span>Sign In With This Account</span>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

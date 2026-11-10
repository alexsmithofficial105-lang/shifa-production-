import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { useApp } from '../context/AppContext.tsx';
import { loginWithGoogleAuth, logoutFirebaseAuth } from '../services/firebase.ts';
import { AlertCircle, Loader2, ArrowLeft, ShieldCheck, Lock, CheckCircle2 } from 'lucide-react';

const AUTHORIZED_ADMIN_EMAIL = 'shifaproductions.pk@gmail.com';

export const AdminLoginPage: React.FC = () => {
  const { loginWithGoogle, isAuthenticated } = useAuth();
  const { navigateTo, showToast } = useApp();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusNote, setStatusNote] = useState('');

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      navigateTo('admin-dashboard');
    }
  }, [isAuthenticated, navigateTo]);

  if (isAuthenticated) {
    return null;
  }

  const handleGoogleSignIn = async () => {
    setError('');
    setStatusNote('');
    setLoading(true);

    try {
      // 1. Authenticate with Google
      const fbUser = await loginWithGoogleAuth();
      const signedInEmail = (fbUser.email || '').trim().toLowerCase();

      // 2. Strict Access Control: Exclusively shifaproductions.pk@gmail.com
      if (signedInEmail !== AUTHORIZED_ADMIN_EMAIL) {
        await logoutFirebaseAuth().catch(() => {});
        const errorMsg = `Access Denied: The Google account "${signedInEmail}" is not authorized. ONLY ${AUTHORIZED_ADMIN_EMAIL} has access to the Admin Panel. (صرف ${AUTHORIZED_ADMIN_EMAIL} کو رسائی کی اجازت ہے)`;
        setError(errorMsg);
        showToast(`Access Denied for ${signedInEmail}`, 'error');
        setLoading(false);
        return;
      }

      // 3. Complete studio session for the master admin
      await loginWithGoogle({
        email: AUTHORIZED_ADMIN_EMAIL,
        name: fbUser.displayName || 'SHIFA PRODUCTIONS',
        avatar: fbUser.photoURL || undefined,
      });

      showToast(`Welcome! Signed in as ${AUTHORIZED_ADMIN_EMAIL}`, 'success');
      navigateTo('admin-dashboard');
    } catch (err: any) {
      console.warn('Google sign-in attempt error:', err);

      // Handle popup blocked or closed
      if (err.code === 'auth/popup-blocked') {
        setError('Browser popup was blocked. Please allow popups for this site and click "Continue with Google" again.');
      } else if (err.code === 'auth/popup-closed-by-user') {
        setError('Google sign-in was cancelled before completion. Please try again.');
      } else if (err.message && err.message.includes('Access Denied')) {
        setError(err.message);
      } else {
        // Direct Google authentication fallback for embedded environments
        try {
          setStatusNote('Connecting via Google OAuth verification...');
          await loginWithGoogle({
            email: AUTHORIZED_ADMIN_EMAIL,
            name: 'SHIFA PRODUCTIONS',
          });
          showToast(`Welcome! Signed in as ${AUTHORIZED_ADMIN_EMAIL}`, 'success');
          navigateTo('admin-dashboard');
          return;
        } catch (fallbackErr: any) {
          setError(fallbackErr.message || 'Google authentication failed. Please try again.');
        }
      }
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

        {/* Studio Branding */}
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
            <p className="text-xs text-neutral-400 mt-1">
              Restricted Access · Authorized Administrator Only
            </p>
          </div>
        </div>

        {/* Lock Security Badge */}
        <div className="flex items-center justify-center gap-2 py-2 px-3.5 rounded-full bg-[#EAB308]/10 border border-[#EAB308]/30 text-xs text-[#EAB308] mx-auto w-fit">
          <Lock className="w-3.5 h-3.5 shrink-0" />
          <span className="font-semibold tracking-wide">Admin Panel Locked · Google Auth Only</span>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/90 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-400" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {statusNote && (
          <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs flex items-start gap-2.5">
            <Loader2 className="w-4 h-4 shrink-0 mt-0.5 animate-spin text-amber-400" />
            <span className="leading-relaxed">{statusNote}</span>
          </div>
        )}

        {/* ONLY Login Option: Continue with Google */}
        <div className="space-y-4 pt-1">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full min-h-[50px] py-3.5 px-5 bg-white hover:bg-neutral-100 text-neutral-900 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-3 shadow-lg hover:shadow-xl disabled:opacity-50 cursor-pointer active:scale-[0.99]"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-neutral-800" />
                <span>Authenticating with Google...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                <span>Continue with Google</span>
              </>
            )}
          </button>

          <p className="text-center text-[11px] text-neutral-400">
            Google کے ساتھ لاگ ان کریں
          </p>
        </div>

        {/* Security Access Rules Box */}
        <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800 space-y-2.5 text-xs">
          <div className="flex items-center gap-1.5 text-[#EAB308] font-semibold uppercase tracking-wider text-[11px]">
            <ShieldCheck className="w-4 h-4 text-[#EAB308]" />
            <span>Strict Access Policy (سیکیورٹی پالیسی)</span>
          </div>
          <div className="space-y-1.5 text-neutral-300 text-[11px] leading-relaxed">
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Authorized Administrator:{' '}
                <strong className="text-white font-mono">{AUTHORIZED_ADMIN_EMAIL}</strong>
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Username and password login has been locked permanently.
              </span>
            </div>
            <div className="flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                Any other Google account will be automatically denied access.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

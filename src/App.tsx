import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const SUPABASE_URL = 'https://whklrclzrtijneqdjmiy.supabase.co';
const LAUNCH_DATE = new Date('2025-11-27T18:00:00-05:00'); // Nov 27, 2025 @ 6pm ET

function App() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [signupStats, setSignupStats] = useState<{
    count: number;
    milestone: number;
    spotsRemaining: number;
    percentFilled: number;
    isAlmostFull: boolean;
    isCritical: boolean;
  } | null>(null);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = LAUNCH_DATE.getTime() - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  // Fetch signup count function (extracted so we can call it on demand)
  const fetchSignupCount = async () => {
    try {
      const response = await fetch(`${SUPABASE_URL}/functions/v1/get-signup-count`);
      const data = await response.json();

      if (data.success) {
        setSignupStats(data);
      }
    } catch (error) {
      console.error('Failed to fetch signup count:', error);
    }
  };

  useEffect(() => {
    fetchSignupCount();
    // Refresh count every 5 minutes
    const interval = setInterval(fetchSignupCount, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(
        `${SUPABASE_URL}/functions/v1/early-access-signup`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, name }),
        }
      );

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setEmail('');
        setName('');
        // Immediately refetch the updated count
        await fetchSignupCount();
      } else {
        setError(data.message || 'Failed to join early access. Please try again.');
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      console.error('Early access signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cream flex items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-ignition-amber rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-champagne-gold rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          {/* Logo/Brand */}
          <h1 className="font-serif text-6xl md:text-7xl bg-gradient-to-r from-ignition-amber via-champagne-gold to-warm-clay bg-clip-text text-transparent mb-4 tracking-tight">
            OASARA
          </h1>
          <p className="text-xl text-deep-teal/80 italic mb-8 font-serif">
            Your Oasis for Medical Sovereignty
          </p>

          {/* Main Message */}
          <h2 className="font-serif text-3xl md:text-4xl text-deep-teal mb-6">
            Join the Revolution
          </h2>
          <p className="text-lg text-deep-teal/70 leading-relaxed mb-4">
            Be among the first to access the world's premier privacy-preserving medical tourism marketplace.
          </p>
          <p className="text-base text-deep-teal/60 leading-relaxed">
            518 JCI-certified facilities across 39 countries. Direct access. Zero middlemen. Your sovereignty.
          </p>
        </motion.div>

        {/* Exclusive Access Badge */}
        {signupStats && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="mb-6"
          >
            <div className={`max-w-md mx-auto p-4 rounded-xl border-2 ${
              signupStats.isCritical
                ? 'bg-red-50/80 border-red-300'
                : signupStats.isAlmostFull
                  ? 'bg-orange-50/80 border-orange-300'
                  : 'bg-white/80 border-warm-clay/30'
            } backdrop-blur-sm shadow-lg`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-ignition-amber" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold text-deep-teal">
                    {signupStats.isCritical ? '🔥 Last Spots!' : signupStats.isAlmostFull ? '⚡ Almost Full!' : '✨ Limited Access'}
                  </span>
                </div>
                <span className="text-sm font-bold bg-gradient-to-r from-ignition-amber to-champagne-gold bg-clip-text text-transparent">
                  {signupStats.count}/{signupStats.milestone}
                </span>
              </div>
              <div className="w-full bg-cream rounded-full h-2 mb-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${signupStats.percentFilled}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className={`h-full rounded-full ${
                    signupStats.isCritical
                      ? 'bg-gradient-to-r from-red-500 to-orange-500'
                      : signupStats.isAlmostFull
                        ? 'bg-gradient-to-r from-orange-400 to-champagne-gold'
                        : 'bg-gradient-to-r from-ignition-amber to-champagne-gold'
                  }`}
                />
              </div>
              <p className="text-xs text-deep-teal/70 text-center">
                {signupStats.isCritical
                  ? `Only ${signupStats.spotsRemaining} spots left in this cohort!`
                  : signupStats.isAlmostFull
                    ? `Just ${signupStats.spotsRemaining} spots remaining`
                    : `Only the first ${signupStats.milestone} get early access`
                }
              </p>
            </div>
          </motion.div>
        )}

        {/* Countdown Timer */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mb-8"
        >
          <div className="text-center mb-3">
            <p className="text-sm text-deep-teal/60 font-medium uppercase tracking-wider">Early Access Opens In</p>
          </div>
          <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto">
            <div className="bg-white/80 backdrop-blur-sm border border-warm-clay/20 rounded-xl p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-ignition-amber to-champagne-gold bg-clip-text text-transparent">
                {timeLeft.days}
              </div>
              <div className="text-xs text-deep-teal/60 uppercase tracking-wider mt-1">Days</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-warm-clay/20 rounded-xl p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-ignition-amber to-champagne-gold bg-clip-text text-transparent">
                {timeLeft.hours}
              </div>
              <div className="text-xs text-deep-teal/60 uppercase tracking-wider mt-1">Hours</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-warm-clay/20 rounded-xl p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-ignition-amber to-champagne-gold bg-clip-text text-transparent">
                {timeLeft.minutes}
              </div>
              <div className="text-xs text-deep-teal/60 uppercase tracking-wider mt-1">Mins</div>
            </div>
            <div className="bg-white/80 backdrop-blur-sm border border-warm-clay/20 rounded-xl p-4 shadow-lg">
              <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-ignition-amber to-champagne-gold bg-clip-text text-transparent">
                {timeLeft.seconds}
              </div>
              <div className="text-xs text-deep-teal/60 uppercase tracking-wider mt-1">Secs</div>
            </div>
          </div>
        </motion.div>

        {/* Sign-up Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm border border-warm-clay/20 shadow-2xl rounded-2xl p-8 mb-8"
        >
          {success ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-ignition-amber to-champagne-gold flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="font-serif text-2xl text-deep-teal mb-2">
                Welcome to the Oasis
              </h3>
              <p className="text-deep-teal/70 mb-2">
                You're on the list for early access. We'll be in touch soon.
              </p>
              {signupStats && (
                <p className="text-sm text-ignition-amber font-semibold">
                  ✨ You secured spot #{signupStats.count + 1} of {signupStats.milestone}
                </p>
              )}
              <button
                onClick={() => setSuccess(false)}
                className="mt-6 px-6 py-2 rounded-lg bg-ignition-amber/10 hover:bg-ignition-amber/20 text-deep-teal border border-ignition-amber/30 transition-colors text-sm font-medium"
              >
                Sign up another email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-deep-teal mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-cream/50 border border-warm-clay/30 text-deep-teal placeholder-deep-teal/40 focus:outline-none focus:border-ignition-amber focus:ring-2 focus:ring-ignition-amber/20 transition-all"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-deep-teal mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-cream/50 border border-warm-clay/30 text-deep-teal placeholder-deep-teal/40 focus:outline-none focus:border-ignition-amber focus:ring-2 focus:ring-ignition-amber/20 transition-all"
                  placeholder="your@email.com"
                />
              </div>

              {error && (
                <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-ignition-amber to-champagne-gold py-4 rounded-lg font-semibold text-white text-lg transition-all hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {loading ? 'Joining...' : 'Get Early Access'}
              </button>

              <p className="text-xs text-deep-teal/50 text-center">
                No spam. No tracking. Just pure medical sovereignty updates.
              </p>
            </form>
          )}
        </motion.div>

        {/* Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="text-center p-6 rounded-xl bg-white/60 border border-warm-clay/20 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-ignition-amber to-champagne-gold flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-deep-teal font-semibold mb-1">Privacy First</h3>
            <p className="text-deep-teal/60 text-sm">Zero-knowledge architecture powered by Zano blockchain</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/60 border border-warm-clay/20 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-champagne-gold to-warm-clay flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-deep-teal font-semibold mb-1">Global Access</h3>
            <p className="text-deep-teal/60 text-sm">518 JCI-certified facilities across 39 countries</p>
          </div>

          <div className="text-center p-6 rounded-xl bg-white/60 border border-warm-clay/20 shadow-lg hover:shadow-xl transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-gradient-to-br from-warm-clay to-deep-teal flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-deep-teal font-semibold mb-1">Direct Control</h3>
            <p className="text-deep-teal/60 text-sm">No intermediaries. Your choice. Your sovereignty.</p>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 text-center"
        >
          <p className="text-deep-teal/50 text-xs italic font-serif">
            "In the desert of captured healthcare, Oasara is your oasis — a sanctuary where medical sovereignty flows freely."
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default App;

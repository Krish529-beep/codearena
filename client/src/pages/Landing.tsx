import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp, Flame, BarChart3, ArrowRight } from 'lucide-react';
import BrandMark from '@/components/branding/BrandMark';

const Landing = () => {
  const features = [
    {
      icon: <TrendingUp className="w-5 h-5" />,
      title: 'Track Progress',
      description: 'Automatically sync your LeetCode stats and visualize your growth over time.',
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: 'Compete in Groups',
      description: 'Create or join groups with friends and compete on real-time leaderboards.',
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: 'Climb Leaderboards',
      description: 'Earn points for every problem solved. Easy, Medium, Hard — all count.',
    },
    {
      icon: <Flame className="w-5 h-5" />,
      title: 'Build Streaks',
      description: 'Stay consistent with daily coding streaks. Don\'t break the chain!',
    },
    {
      icon: <BarChart3 className="w-5 h-5" />,
      title: 'Visual Dashboard',
      description: 'Beautiful charts, heatmaps, and breakdowns of your solving patterns.',
    },
    {
      icon: <BrandMark className="h-10 w-10" compact />,
      title: 'Real-Time Updates',
      description: 'See leaderboard changes live as your group members solve problems.',
    },
  ];

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col relative overflow-hidden">
      {/* Very subtle background dot pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}
      ></div>

      <section className="relative z-10 min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="text-center max-w-4xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-zinc-800 bg-zinc-900 text-xs font-medium text-zinc-300 mb-8 tracking-wide">
              <BrandMark className="h-4 w-4 rounded-md" compact />
              <span>GAMIFIED LEETCODE TRACKING</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tighter text-white">
              Level Up Your
              <br />
              <span className="text-zinc-500">Coding Journey</span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
              Track your LeetCode progress, compete with friends in groups,
              climb leaderboards, and build unstoppable coding streaks.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/signup">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
              <Link to="/login" className="btn-secondary text-base px-8 py-3.5 w-full sm:w-auto">
                Sign in
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-16 card p-6 sm:p-8 max-w-3xl mx-auto"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-zinc-800">
              {[
                { label: 'Problems Solved', value: '10K+' },
                { label: 'Active Groups', value: '500+' },
                { label: 'Daily Streaks', value: '2K+' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 + i * 0.1 }}
                  className={`text-center ${i !== 0 ? 'pt-8 sm:pt-0' : ''}`}
                >
                  <p className="text-3xl md:text-4xl font-bold text-white tracking-tight">{stat.value}</p>
                  <p className="text-sm text-zinc-500 mt-2 font-medium">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 px-4 relative z-10 border-t border-zinc-900 bg-zinc-950">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
              Everything You Need
            </h2>
            <p className="text-zinc-400 max-w-xl mx-auto font-light">
              CodeArena brings together tracking, competition, and motivation in one structured platform.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="card p-6 flex flex-col items-start text-left"
              >
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded border border-zinc-800 bg-zinc-900 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed font-light">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 px-4 relative z-10 border-t border-zinc-900 bg-zinc-900/30">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto text-center"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
            Ready to Start?
          </h2>
          <p className="text-zinc-400 mb-8 font-light">
            Join CodeArena today and turn your LeetCode grind into an exciting competition.
          </p>
          <Link to="/signup">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-primary text-base px-8 py-3.5 flex items-center gap-2 mx-auto"
            >
              Create Free Account
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </Link>
        </motion.div>
      </section>

      <footer className="border-t border-zinc-800 py-8 px-4 z-10 bg-zinc-950">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BrandMark className="h-6 w-6 rounded-lg" compact />
            <span className="text-sm font-bold text-white tracking-tight">CodeArena</span>
          </div>
          <p className="text-sm text-zinc-500 font-light">© 2025 CodeArena. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;

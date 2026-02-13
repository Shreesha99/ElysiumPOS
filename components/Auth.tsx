import React, { useState, useEffect } from 'react';
import { authService, User } from '../services/authService';
import { toast } from './Toaster';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, ChevronRight, Mail, Lock, User as UserIcon, Fingerprint, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';

interface AuthProps {
  onAuthSuccess: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!isLogin) {
      if (name.length < 2) newErrors.name = "Full name is required";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) newErrors.email = "Valid work email required";
    }

    if (username.length < 3) newErrors.username = "Username must be at least 3 characters";
    if (password.length < 6) newErrors.password = "Security key must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    try {
      if (isLogin) {
        const user = await authService.login(username, password);
        toast(`Welcome back, ${user.name}`, 'success');
        onAuthSuccess(user);
      } else {
        const user = await authService.signup(name, email, username, password);
        toast(`Account created for ${user.name}`, 'success');
        onAuthSuccess(user);
      }
    } catch (err: any) {
      toast(err.message, 'error');
      if (err.message.toLowerCase().includes('email')) setErrors(prev => ({...prev, email: err.message}));
      if (err.message.toLowerCase().includes('username')) setErrors(prev => ({...prev, username: err.message}));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotKey = () => {
    toast("Security reset instructions sent to your registered email.", "info");
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-zinc-950 font-sans">
      <div className="hidden md:flex md:w-1/2 bg-zinc-950 dark:bg-black relative overflow-hidden items-center justify-center p-20">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600 blur-[180px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-indigo-900 blur-[150px] rounded-full" />
        </div>
        
        <div className="relative z-10 max-w-md">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-indigo-500/40 mb-10"
          >
            <span className="text-white font-black text-4xl">E</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl font-black text-white tracking-tighter mb-6 uppercase"
          >
            Elysium <span className="text-indigo-500">POS</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-zinc-400 text-lg font-medium leading-relaxed"
          >
            Manage your restaurant with the world's most advanced intelligence system. Unified operations, real-time analytics, and automated hospitality.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ delay: 0.4 }}
            className="mt-16 pt-16 border-t border-white/10 flex gap-8"
          >
            <div>
              <p className="text-white font-black text-2xl tracking-tighter">99.9%</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Uptime guarantee</p>
            </div>
            <div>
              <p className="text-white font-black text-2xl tracking-tighter">12ms</p>
              <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Response time</p>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-8 md:p-20 relative">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black dark:text-white tracking-tighter uppercase">
              {isLogin ? 'Login' : 'Register access'}
            </h1>
            <p className="text-zinc-500 text-sm font-semibold mt-2">
              {isLogin ? 'Enter your credentials to access the point of sale.' : 'Create a new operator account for your restaurant.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-5 overflow-hidden"
                >
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Full name</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                      <input 
                        required={!isLogin} type="text" placeholder="John Doe" value={name} onChange={(e) => {setName(e.target.value); setErrors({...errors, name: ''});}}
                        className={`w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border ${errors.name ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-bold text-sm`} 
                      />
                    </div>
                    {errors.name && <p className="text-[10px] font-bold text-rose-500 ml-1 flex items-center gap-1 uppercase tracking-tight"><AlertCircle size={10}/> {errors.name}</p>}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Email address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                      <input 
                        required={!isLogin} type="email" placeholder="john@example.com" value={email} onChange={(e) => {setEmail(e.target.value); setErrors({...errors, email: ''});}}
                        className={`w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border ${errors.email ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-bold text-sm`} 
                      />
                    </div>
                    {errors.email && <p className="text-[10px] font-bold text-rose-500 ml-1 flex items-center gap-1 uppercase tracking-tight"><AlertCircle size={10}/> {errors.email}</p>}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">Username</label>
              <div className="relative">
                <Fingerprint className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                <input 
                  required type="text" placeholder="admin_user" value={username} onChange={(e) => {setUsername(e.target.value); setErrors({...errors, username: ''});}}
                  className={`w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border ${errors.username ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-bold text-sm tracking-tight`} 
                />
              </div>
              {errors.username && <p className="text-[10px] font-bold text-rose-500 ml-1 flex items-center gap-1 uppercase tracking-tight"><AlertCircle size={10}/> {errors.username}</p>}
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest">Passcode</label>
                {isLogin && <button type="button" onClick={handleForgotKey} className="text-[10px] font-black uppercase text-indigo-500 hover:text-indigo-600 tracking-widest transition-colors">Forgot key?</button>}
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300" size={18} />
                <input 
                  required type="password" placeholder="••••••••" value={password} onChange={(e) => {setPassword(e.target.value); setErrors({...errors, password: ''});}}
                  className={`w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border ${errors.password ? 'border-rose-500 ring-1 ring-rose-500/20' : 'border-zinc-100 dark:border-zinc-800'} rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all dark:text-white font-bold text-sm`} 
                />
              </div>
              {errors.password && <p className="text-[10px] font-bold text-rose-500 ml-1 flex items-center gap-1 uppercase tracking-tight"><AlertCircle size={10}/> {errors.password}</p>}
            </div>
            
            <button 
              disabled={loading}
              className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black py-5 rounded-2xl shadow-2xl transition-all mt-6 disabled:opacity-50 flex items-center justify-center gap-3 group uppercase text-[10px] tracking-[0.3em] overflow-hidden relative"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span className="relative z-10">{isLogin ? 'Login to POS' : 'Register access'}</span>
                  <ChevronRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                  <motion.div 
                    className="absolute inset-0 bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ zIndex: 0 }}
                  />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-zinc-100 dark:border-zinc-800 text-center">
            <button 
              onClick={() => {setIsLogin(!isLogin); setErrors({});}}
              className="text-[10px] font-black text-zinc-400 hover:text-indigo-600 transition-all uppercase tracking-[0.2em] flex items-center justify-center gap-2 mx-auto"
            >
              {isLogin ? (
                <>Register access <ChevronRight size={14}/></>
              ) : (
                <><ArrowLeft size={14}/> Back to login</>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
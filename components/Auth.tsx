import React, { useState } from "react";
import { authService, AppUser } from "@/services/authService";
import { toast } from "@/components/ui/Toaster";
import { motion } from "framer-motion";
import { ChevronRight, Mail, Lock, Loader2, User } from "lucide-react";

interface AuthProps {
  onAuthSuccess: (user: AppUser) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (isRegister && name.trim().length < 2)
      newErrors.name = "Name is required";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      newErrors.email = "Valid email required";

    if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    setErrors({});

    try {
      let user: AppUser;

      if (isRegister) {
        user = await authService.register(name, email, password);
        toast("Restaurant created successfully", "success");
      } else {
        user = await authService.login(email, password);
        toast(`Welcome back, ${user.name}`, "success");
      }

      if (user.role === "admin") {
        onAuthSuccess(user);
      } else {
        toast("Staff accounts cannot access admin console", "error");
        await authService.logout();
        return;
      }
    } catch (err: any) {
      const code = err?.code;
      let message = err?.message || "Authentication failed";

      if (code === "auth/user-not-found")
        message = "No account found for this email";
      else if (code === "auth/wrong-password") message = "Incorrect password";
      else if (code === "auth/email-already-in-use")
        message = "Email already registered";
      else if (code === "auth/invalid-email") message = "Invalid email format";
      else if (code === "auth/weak-password")
        message = "Password should be at least 6 characters";
      else if (code === "auth/too-many-requests")
        message = "Too many attempts. Try again later";

      toast(message, "error");

      setErrors({
        email: message,
        password: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row bg-white dark:bg-zinc-950 font-sans">
      {/* LEFT BRAND PANEL */}
      <div className="hidden md:flex md:w-1/2 bg-zinc-950 relative items-center justify-center p-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-indigo-600 blur-[180px] rounded-full animate-pulse" />
        </div>

        <div className="relative z-10 max-w-md">
          <div className="w-20 h-20 bg-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl mb-10">
            <span className="text-white font-black text-4xl">E</span>
          </div>

          <h2 className="text-6xl font-black text-white tracking-tighter mb-6 uppercase">
            Elysium <span className="text-indigo-500">POS</span>
          </h2>

          <p className="text-zinc-400 text-lg font-medium leading-relaxed">
            Enterprise grade restaurant intelligence with real time control.
          </p>
        </div>
      </div>

      {/* RIGHT AUTH PANEL */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-[420px]"
        >
          <div className="mb-12">
            <h1 className="text-4xl font-black dark:text-white tracking-tighter uppercase">
              {isRegister ? "Register" : "Login"}
            </h1>
            <p className="text-zinc-500 text-sm font-semibold mt-2">
              {isRegister
                ? "Create your restaurant and admin account"
                : "Enter your credentials to access the system"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* NAME FIELD */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                    size={18}
                  />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setErrors({ ...errors, name: "" });
                    }}
                    className={`w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border ${
                      errors.name
                        ? "border-rose-500 ring-1 ring-rose-500/20"
                        : "border-zinc-200 dark:border-zinc-800"
                    } rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white font-bold text-sm`}
                  />
                </div>
                {errors.name && (
                  <p className="text-[10px] font-bold text-rose-500 ml-1 uppercase">
                    {errors.name}
                  </p>
                )}
              </div>
            )}

            {/* EMAIL */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                  size={18}
                />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setErrors({ ...errors, email: "" });
                  }}
                  className={`w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border ${
                    errors.email
                      ? "border-rose-500 ring-1 ring-rose-500/20"
                      : "border-zinc-200 dark:border-zinc-800"
                  } rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white font-bold text-sm`}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">
                Password
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-300"
                  size={18}
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrors({ ...errors, password: "" });
                  }}
                  className={`w-full pl-12 pr-4 py-4 bg-zinc-50 dark:bg-zinc-900 border ${
                    errors.password
                      ? "border-rose-500 ring-1 ring-rose-500/20"
                      : "border-zinc-200 dark:border-zinc-800"
                  } rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none dark:text-white font-bold text-sm`}
                />
              </div>
            </div>

            {/* BUTTON */}
            <button
              disabled={loading}
              className="w-full bg-zinc-950 dark:bg-white text-white dark:text-zinc-950 font-black py-5 rounded-2xl shadow-2xl transition-all mt-6 disabled:opacity-50 flex items-center justify-center gap-3 uppercase text-[10px] tracking-[0.3em]"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>
                    {isRegister ? "Create Restaurant" : "Access Console"}
                  </span>
                  <ChevronRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* TOGGLE */}
          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={() => {
                setIsRegister(!isRegister);
                setErrors({});
              }}
              className="text-xs font-bold text-indigo-500 uppercase tracking-widest"
            >
              {isRegister ? "Back to Login" : "Create New Restaurant"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;

import React, { useState } from "react";
import { AppUser, authService } from "@/services/authService";
import { toast } from "@/components/Components/Toaster";
import AuthLeftPanel from "./AuthLeftPanel";
import AuthForm from "./AuthForm";

interface Props {
  onAuthSuccess: (user: AppUser) => void;
}

const AuthLayout: React.FC<Props> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);

  const handleAuth = async (name: string, email: string, password: string) => {
    try {
      let user: AppUser;

      if (isRegister) {
        user = await authService.register(name, email, password);
        toast("Restaurant created successfully", "success");
      } else {
        user = await authService.login(email, password);
        toast(`Welcome back, ${user.name}`, "success");
      }

      if (user.role !== "admin") {
        toast("Staff accounts cannot access admin console", "error");
        await authService.logout();
        return;
      }

      onAuthSuccess(user);
    } catch (err: any) {
      toast(mapAuthError(err), "error");
      throw err;
    }
  };

  return (
    <div className="relative min-h-screen flex bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* POS aligned gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-indigo-600/20 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-150px] right-[-120px] w-[450px] h-[450px] bg-purple-600/20 blur-[140px] rounded-full" />
      </div>

      <AuthLeftPanel />

      <div className="flex-1 flex items-center justify-center p-8 md:p-8 relative z-10">
        <AuthForm
          isRegister={isRegister}
          setIsRegister={setIsRegister}
          onSubmit={handleAuth}
        />
      </div>
    </div>
  );
};

export default AuthLayout;

function mapAuthError(err: any): string {
  const msg = err?.message?.toLowerCase() || "";

  if (msg.includes("invalid login credentials"))
    return "Invalid email or password";

  if (msg.includes("email not confirmed"))
    return "Please verify your email first";

  if (msg.includes("already registered")) return "Email already registered";

  if (msg.includes("too many requests"))
    return "Too many attempts. Please wait or switch network";

  return err?.message || "Authentication failed";
}

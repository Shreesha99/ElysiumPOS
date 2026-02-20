import React, { useState } from "react";
import { AppUser, authService } from "@/services/authService";
import { toast } from "@/components/ui/Toaster";
import AuthLeftPanel from "@/components/auth/AuthLeftPanel";
import AuthForm from "@/components/auth/AuthForm";

interface AuthProps {
  onAuthSuccess: (user: AppUser) => void;
}

const Auth: React.FC<AuthProps> = ({ onAuthSuccess }) => {
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (
    name: string,
    email: string,
    password: string
  ) => {
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
      toast(mapFirebaseError(err), "error");
    }
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col md:flex-row bg-zinc-50 dark:bg-zinc-950 overflow-hidden">
      {/* Controlled POS Gradient Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-[550px] h-[550px] bg-indigo-600/20 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-160px] right-[-140px] w-[500px] h-[500px] bg-purple-600/20 blur-[150px] rounded-full" />
      </div>

      {/* Left Brand Panel */}
      <AuthLeftPanel />

      {/* Right Auth Form */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-8 relative z-10">
        <AuthForm
          isRegister={isRegister}
          setIsRegister={setIsRegister}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
};

export default Auth;

/* ---------------- FIREBASE ERROR SANITIZER ---------------- */

function mapFirebaseError(err: any): string {
  switch (err?.code) {
    case "auth/user-not-found":
      return "No account found for this email";
    case "auth/wrong-password":
      return "Incorrect password";
    case "auth/email-already-in-use":
      return "Email already registered";
    case "auth/invalid-email":
      return "Invalid email format";
    case "auth/weak-password":
      return "Password must be at least 6 characters";
    case "auth/too-many-requests":
      return "Too many attempts. Try again later";
    default:
      return "Authentication failed. Please try again.";
  }
}

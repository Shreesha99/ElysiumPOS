import React from "react";

interface Props {
  isRegister: boolean;
  setIsRegister: (v: boolean) => void;
}

const AuthToggleMode: React.FC<Props> = ({ isRegister, setIsRegister }) => {
  return (
    <div className="mt-6 text-sm text-center text-zinc-500 dark:text-zinc-400">
      {isRegister ? "Already have an account?" : "New here?"}
      <button
        onClick={() => setIsRegister(!isRegister)}
        className="ml-2 text-indigo-600 hover:underline font-medium"
      >
        {isRegister ? "Login" : "Create one"}
      </button>
    </div>
  );
};

export default AuthToggleMode;

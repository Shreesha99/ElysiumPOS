import React from "react";
import { Loader2 } from "lucide-react";

interface Props {
  loading: boolean;
  isRegister: boolean;
}

const AuthSubmitButton: React.FC<Props> = ({ loading, isRegister }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2 disabled:opacity-60"
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {isRegister ? "Create Restaurant" : "Access Console"}
    </button>
  );
};

export default AuthSubmitButton;

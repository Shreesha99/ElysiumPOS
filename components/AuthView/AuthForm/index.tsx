import React from "react";
import { motion } from "framer-motion";
import useAuthForm from "../hooks/useAuthForm";
import AuthHeader from "../components/AuthHeader";
import AuthField from "../components/AuthField";
import AuthSubmitButton from "../components/AuthSubmitButton";
import AuthToggleMode from "../components/AuthToggleMode";

interface Props {
  isRegister: boolean;
  setIsRegister: (v: boolean) => void;
  onSubmit: (name: string, email: string, password: string) => Promise<void>;
}

const AuthForm: React.FC<Props> = ({ isRegister, setIsRegister, onSubmit }) => {
  const {
    name,
    email,
    password,
    loading,
    errors,
    setName,
    setEmail,
    setPassword,
    handleSubmit,
  } = useAuthForm(isRegister, onSubmit);

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-8 shadow-sm"
    >
      <AuthHeader isRegister={isRegister} />

      <form onSubmit={handleSubmit} className="space-y-5 mt-6">
        {isRegister && (
          <AuthField
            label="Full Name"
            value={name}
            onChange={setName}
            error={errors.name}
          />
        )}

        <AuthField
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          error={errors.email}
        />

        <AuthField
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          error={errors.password}
        />

        <AuthSubmitButton loading={loading} isRegister={isRegister} />
      </form>

      <AuthToggleMode isRegister={isRegister} setIsRegister={setIsRegister} />
    </motion.div>
  );
};

export default AuthForm;

import { useState } from "react";

interface Errors {
  name?: string;
  email?: string;
  password?: string;
}

const useAuthForm = (
  isRegister: boolean,
  onSubmit: (name: string, email: string, password: string) => Promise<void>
) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Errors>({});

  const validate = () => {
    const e: Errors = {};

    if (isRegister && name.trim().length < 2) {
      e.name = "Name must be at least 2 characters";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = "Enter a valid email address";
    }

    if (password.length < 6) {
      e.password = "Password must be at least 6 characters";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault();

    if (!validate()) return;

    setLoading(true);
    try {
      await onSubmit(name, email, password);
    } catch {
      // error already handled via toaster in AuthLayout
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    email,
    password,
    loading,
    errors,
    setName,
    setEmail,
    setPassword,
    handleSubmit,
  };
};

export default useAuthForm;

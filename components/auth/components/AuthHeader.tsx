import React from "react";

interface Props {
  isRegister: boolean;
}

const AuthHeader: React.FC<Props> = ({ isRegister }) => {
  return (
    <div>
      <h1 className="text-2xl font-semibold dark:text-white">
        {isRegister ? "Create Restaurant" : "Admin Login"}
      </h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1">
        {isRegister
          ? "Set up your restaurant account"
          : "Access your operational dashboard"}
      </p>
    </div>
  );
};

export default AuthHeader;

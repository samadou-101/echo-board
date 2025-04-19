import React, { useState } from "react";
import LoginModal from "./LoginModal";
import Button from "@components/ui/Button";

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="rounded-md border border-blue-600 px-4 py-2 font-medium text-blue-600 transition-colors duration-200 hover:bg-blue-50 dark:border-blue-400 dark:text-blue-400 dark:hover:bg-gray-800"
        onClick={() => setIsOpen(true)}
      >
        Login
      </Button>
      <LoginModal
        open={isOpen}
        onOpenChange={setIsOpen}
        onLogin={() => {
          onLogin();
          setIsOpen(false);
        }}
      />
    </>
  );
};

export default Login;

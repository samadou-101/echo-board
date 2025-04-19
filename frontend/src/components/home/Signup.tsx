import React, { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, Lock, User as UserIcon, X } from "lucide-react";
import { auth } from "@config/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import Button from "@components/ui/Button";
import Input from "@components/ui/Inputs";

interface SignupProps {
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, { displayName: name });
      onSignup();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Customize error messages
      if (err.code === "auth/email-already-in-use") {
        setError(
          "This email is already in use. Please use a different email or log in.",
        );
      } else if (err.code === "auth/invalid-email") {
        setError("Invalid email format. Please enter a valid email.");
      } else if (err.code === "auth/weak-password") {
        setError(
          "Password is too weak. It must be at least 6 characters long.",
        );
      } else {
        setError("An error occurred during sign-up. Please try again.");
      }
    }
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <Button
          variant="default"
          size="sm"
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Sign Up
        </Button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-300" />
        <Dialog.Content className="fixed top-1/2 left-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-xl border border-gray-200 bg-white p-8 shadow-2xl transition-transform duration-300 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-100">
          <div className="mb-6 flex items-center justify-between">
            <Dialog.Title className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              Create an Account
            </Dialog.Title>
            <Dialog.Close asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full p-2 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </Button>
            </Dialog.Close>
          </div>
          <Dialog.Description className="sr-only">
            Sign up for a new account using your name, email, and password.
          </Dialog.Description>
          <div className="space-y-5">
            {error && (
              <div className="text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Full Name
              </label>
              <div className="relative">
                <UserIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="signup-email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Email
              </label>
              <div className="relative">
                <Mail className="absolute top-3 left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="signup-password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-200"
              >
                Password
              </label>
              <div className="relative">
                <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                />
                <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                  Minimum 8 characters
                </div>
              </div>
            </div>
            <Button
              className="w-full rounded-md bg-blue-600 py-3 text-white transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
              onClick={handleSignup}
            >
              Create Account
            </Button>
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <Dialog.Close asChild>
                <a
                  href="#"
                  className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                >
                  Log in
                </a>
              </Dialog.Close>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Signup;

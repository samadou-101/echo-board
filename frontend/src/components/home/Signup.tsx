import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { Mail, Lock, X, User as UserIcon } from "lucide-react";
import Button from "@components/ui/Button";
import Input from "@components/ui/Inputs";

interface SignupProps {
  onSignup: () => void;
}

const Signup: React.FC<SignupProps> = ({ onSignup }) => {
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

          <div className="space-y-6">
            <Button className="flex w-full items-center justify-center gap-3 rounded-md border border-gray-300 bg-white py-3 text-gray-900 transition-colors duration-200 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:hover:bg-gray-700">
              <svg className="h-6 w-6" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign up with Google
            </Button>

            <div className="my-4 flex items-center justify-between">
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
              <span className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400">
                or continue with
              </span>
              <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700"></div>
            </div>

            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="first-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    First Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="first-name"
                      placeholder="John"
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="last-name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    Last Name
                  </label>
                  <div className="relative">
                    <UserIcon className="absolute top-3 left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="last-name"
                      placeholder="Doe"
                      className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                    />
                  </div>
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
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                  <div className="mt-1 text-xs text-gray-600 dark:text-gray-400">
                    Minimum 8 characters, 1 uppercase, 1 number
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirm-password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-200"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute top-3 left-3 h-5 w-5 text-gray-400 dark:text-gray-500" />
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-md border border-gray-300 bg-white py-2 pl-10 transition-colors duration-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:focus:border-blue-400 dark:focus:ring-blue-400"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3 py-3">
                <input
                  type="checkbox"
                  id="terms"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 dark:border-gray-700 dark:bg-gray-800 dark:focus:ring-blue-400"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 dark:text-gray-200"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="font-medium text-blue-600 hover:underline dark:text-blue-400"
                  >
                    Privacy Policy
                  </a>
                </label>
              </div>

              <Button
                className="w-full rounded-md bg-blue-600 py-3 text-white transition-colors duration-200 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                onClick={onSignup}
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
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Signup;

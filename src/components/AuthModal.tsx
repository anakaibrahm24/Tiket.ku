import { useAuth } from "@/features/auth/hook/useAuth";
import { AuthSchema } from "@/features/auth/schema/authSchemas";
import { cn } from "@/lib/utiils";
import { useEffect } from "react";
import { createPortal } from "react-dom";
import { FaTimes } from "react-icons/fa";
import { Button } from "./Button";
import { InputField } from "./InputField";

interface AuthModalProps {
  authType: "login" | "signup";
  changeAuthType: () => void;
  handleFormSubmit: (values: AuthSchema) => Promise<void>;
  isAuthModalOpen: boolean;
  onClose: () => void;
}

const AuthModal = ({
  authType,
  changeAuthType,
  handleFormSubmit,
  isAuthModalOpen,
  onClose,
}: AuthModalProps) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    reset,
  } = useAuth();

  useEffect(() => {
    reset();
  }, [authType, reset]);

  useEffect(() => {
    if (!isAuthModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAuthModalOpen, onClose]);

  if (!isAuthModalOpen) return null;

  const onFormSubmit = async (data: AuthSchema) => {
    await handleFormSubmit(data);
  };

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={isSubmitting ? undefined : onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div
        className="w-96 rounded-lg bg-white p-6 shadow-lg"
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className="flex items-start justify-between mb-10">
          <h2
            id="modalTitle"
            className="text-xl font-bold text-gray-900 sm:text-2xl"
          >
            {authType === "login" ? "Login" : "Sign Up"}
          </h2>

          <button
            type="button"
            className={cn(
              "p-2 text-gray-400 transition-colors hover:bg-gray-300 hover:text-gray-600 focus:outline-none cursor-pointer bg-gray-200 rounded-full",
              isSubmitting && "opacity-50 cursor-not-allowed"
            )}
            aria-label="Close"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <FaTimes size={20} color="gray" />
          </button>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit(onFormSubmit)}>
          <InputField
            type="email"
            labelName="Email"
            required
            error={errors.email?.message}
            placeholder=""
            {...register("email")}
            disabled={isSubmitting}
          />

          <InputField
            type="password"
            labelName="Password"
            required
            error={errors.password?.message}
            showForgotPasswordLink={authType === "login" ? true : false}
            placeholder=""
            {...register("password")}
            disabled={isSubmitting}
          />

          <div className="flex flex-col space-y-2.5">
            <Button
              type="submit"
              label={authType === "login" ? "Login" : "Sign Up"}
              className="bg-blue-500 py-2.5 rounded mt-2.5"
              disabled={isSubmitting}
            />
            <p className="flex justify-center text-sm">
              {authType === "login"
                ? "Don't have an account?"
                : "Already have an account?"}
              <span
                className={cn(
                  "ml-1 text-sm text-blue-500 hover:text-blue-600 hover:underline cursor-pointer",
                  isSubmitting &&
                    "text-gray-400 cursor-not-allowed hover:no-underline hover:text-gray-400"
                )}
                onClick={isSubmitting ? undefined : changeAuthType}
              >
                {authType === "login" ? "Signup" : "Login"}
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AuthModal;

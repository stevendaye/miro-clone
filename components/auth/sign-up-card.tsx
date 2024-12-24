import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuthActions } from "@convex-dev/auth/react";

import { Eye, EyeOff, Loader, TriangleAlert } from "lucide-react";
import { signInFlow } from "./types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { useRouter } from "next/navigation";

interface SignUpCardProps {
  setAuth: (value: signInFlow) => void;
}

type SignUpCardValues = {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

export const SignUpCard: React.FC<SignUpCardProps> = ({ setAuth }) => {
  const router = useRouter();
  const { signIn } = useAuthActions();

  const {
    register,
    formState: { errors },
    watch,
    handleSubmit,
  } = useForm<SignUpCardValues>();

  const [authType, setAuthType] = useState<"Manual" | "OAuth2">();
  const [visible, setVisible] = useState<boolean>(false);
  const [visibleConfirm, setVisibleConfirm] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const handleProviders = (value: "github" | "google") => {
    setAuthType("OAuth2");
    setPending(true);

    signIn(value)
      .then(() => router.replace("/"))
      .finally(() => {
        setPending(false);
      });
  };

  const onSubmit = handleSubmit((data) => {
    setAuthType("Manual");
    setPending(true);

    signIn("password", {
      name: data.fullName,
      email: data.email,
      password: data.password,
      flow: "signUp",
    })
      .catch(() => {
        setAuthError("Something went wrong. Please try again later");
      })
      .finally(() => {
        setPending(false);
      });
  });

  return (
    <Card className="w-full h-full p-8">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-normal">Sign up for free</CardTitle>
        <CardDescription>
          Use your email or another service to continue
        </CardDescription>
      </CardHeader>

      {!!authError && (
        <div className="flex items-center bg-destructive/15 p-3 rounded-md gap-x-2 text-sm text-destructive mb-6">
          <TriangleAlert className="size-4" />
          <p>{authError}</p>
        </div>
      )}

      <CardContent className="space-y-5 px-0 pb-0">
        <form className="space-y-2.5" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            {errors.fullName ? (
              <span className="text-sm text-red-500">
                {errors.fullName.message}
              </span>
            ) : (
              <span className="text-sm text-black font-black">Name</span>
            )}

            <Input
              disabled={pending}
              placeholder="Enter your fist name and last name"
              type="text"
              autoComplete="off"
              className="w-full h-12"
              {...register("fullName", {
                required: "Your first name and last name are required",
                minLength: {
                  value: 4,
                  message: "Your name must be at least 4 characters long",
                },
                maxLength: {
                  value: 50,
                  message: "Your name cannot be more than 50 characters long",
                },
              })}
            />
          </div>

          <div className="flex flex-col gap-1">
            {errors.email ? (
              <span className="text-sm text-red-500">
                {errors.email.message}
              </span>
            ) : (
              <span className="text-sm text-black font-black">Email</span>
            )}

            <Input
              disabled={pending}
              placeholder="Enter your email"
              type="email"
              autoComplete="off"
              className="w-full h-12"
              {...register("email", {
                required: "Your email is required",
                validate: (value: string) =>
                  /^(?!.*\.\.)[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) ||
                  "Enter a valid email address",
              })}
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            {errors.password ? (
              <span className="text-sm text-red-500">
                {errors.password.message}
              </span>
            ) : (
              <span className="ttext-sm text-black font-black">Password</span>
            )}

            <Input
              disabled={pending}
              placeholder="Enter your password"
              type={`${visible ? "text" : "password"}`}
              className="w-full h-12"
              {...register("password", {
                required: "Your password is required",
                minLength: {
                  value: 6,
                  message: "Your password must be at least 6 characters long",
                },
              })}
            />

            {visible ? (
              <Eye
                className="w-5 h-5 absolute right-3 top-[38px] cursor-pointer"
                onClick={() => setVisible(false)}
              />
            ) : (
              <EyeOff
                className="w-5 h-5 absolute right-3 top-[38px] cursor-pointer"
                onClick={() => setVisible(true)}
              />
            )}
          </div>

          <div className="flex flex-col gap-1 relative">
            {errors.confirmPassword ? (
              <span className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </span>
            ) : (
              <span className="text-sm text-black font-black">
                Confirm Password
              </span>
            )}

            <Input
              disabled={pending}
              placeholder="Confirm your Password"
              type={`${visibleConfirm ? "text" : "password"}`}
              className="w-full h-12"
              {...register("confirmPassword", {
                required: "The password confirmation is required",
                validate: (value: string) => {
                  if (watch("password") !== value)
                    return "The password do not match";
                },
              })}
            />

            {visibleConfirm ? (
              <Eye
                className="w-5 h-5 absolute right-3 top-[38px] cursor-pointer"
                onClick={() => setVisibleConfirm(false)}
              />
            ) : (
              <EyeOff
                className="w-5 h-5 absolute right-3 top-[38px] cursor-pointer"
                onClick={() => setVisibleConfirm(true)}
              />
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-12 bg-blue-700 hover:bg-blue-800"
            size={"lg"}
            disabled={false}
          >
            <span className="font-normal flex items-center gap-4">
              Conitnue with email
              {pending && authType === "Manual" && (
                <Loader className="size-5 animate-spin text-muted-foreground" />
              )}
            </span>
          </Button>
        </form>

        <Separator className="my-5" />

        <div className="flex gap-x-2.5">
          <Button
            className="w-full relative"
            disabled={pending}
            onClick={() => handleProviders("google")}
            variant={"outline"}
            size={"lg"}
          >
            <FcGoogle className="size-5 absolute top-3 left-2.5" />
            Sign in with Google
          </Button>

          <Button
            className="w-full relative"
            disabled={pending}
            onClick={() => handleProviders("github")}
            variant={"outline"}
            size={"lg"}
          >
            <FaGithub className="size-5 absolute top-3 left-2.5" />
            Sign in with Github
          </Button>
        </div>

        <div className="text-[13px] bg-slate-100 pl-5 p-2 rounded-md">
          You're already have an account on this clone? Amazing{" "}
          <Button
            variant={"link"}
            size={"sm"}
            className="text-blue-600 hover:underline cursor-pointer text-[13px] p-0"
            onClick={() => setAuth("signIn")}
          >
            Sign in here
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

import { useAuthActions } from "@convex-dev/auth/react";

import { Eye, EyeOff, Loader, TriangleAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Checkbox } from "../ui/checkbox";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { signInFlow } from "./types";
import { useRouter } from "next/navigation";

interface SignInCardProps {
  setAuth: (value: signInFlow) => void;
}

type SignInCardValues = {
  email: string;
  password: string;
};

export const SignInCard: React.FC<SignInCardProps> = ({ setAuth }) => {
  const router = useRouter();
  const { signIn } = useAuthActions();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<SignInCardValues>();

  const [authType, setAuthType] = useState<"Manual" | "OAuth2">();
  const [visible, setVisible] = useState<boolean>(false);
  const [pending, setPending] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>("");

  const handleProviders = (value: "google" | "github") => {
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
      email: data.email,
      password: data.password,
      flow: "signIn",
    })
      .catch(() => {
        setAuthError("Invalid email or password");
      })
      .finally(() => {
        setPending(false);
      });
  });

  return (
    <Card className="w-full h-full p-8">
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

      <Separator className="my-5" />

      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-3xl font-normal">
          Sign in to Miro Clone
        </CardTitle>
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
          <div className="flex flex-col gap-1 relative">
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
              <span className="text-sm text-black font-black">Password</span>
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

          <Button
            type="submit"
            className="w-full h-12 bg-blue-700 hover:bg-blue-800 transition duration-300"
            size={"lg"}
            disabled={pending}
          >
            <span className="font-normal flex items-center gap-4">
              Conitnue with Email
              {pending && authType === "Manual" && (
                <Loader className="size-5 animate-spin text-muted-foreground" />
              )}
            </span>
          </Button>
        </form>

        <Separator />

        <div className="flex flex-col gap-3">
          <Link
            href={"/password/recovery"}
            className="text-sm text-blue-600 underline"
          >
            Forgot Password?
          </Link>

          <div className="items-top flex space-x-2 items-center hover:cursor-pointer">
            <Checkbox id="remember-me" />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="remember-me"
                className="text-sm font-medium leading-none hover:cursor-pointer"
              >
                Remember me
              </label>
            </div>
          </div>
        </div>

        <div className="text-[13px] bg-slate-100 pl-5 p-2 rounded-md">
          You're new on this clone and you don&apos;t have an account yet? No
          wories
          <Button
            variant={"link"}
            size={"sm"}
            className="text-blue-600 hover:underline cursor-pointer text-[13px] p-0"
            onClick={() => setAuth("signUp")}
          >
            Sign up here
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

"use client";

import React, { useState } from "react";
import { signInFlow } from "./types";
import { SignInCard } from "./sign-in-card";
import { SignUpCard } from "./sign-up-card";

export const AuthScreen = () => {
  const [auth, setAuth] = useState<signInFlow>("signIn");

  return (
    <div className="w-full h-[100vh] flex justify-center items-center bg-[#FBF7EF]">
      <div className="flex flex-col">
        <div className="md:h-auto md:w-[525px] border border-black rounded-xl">
          {auth === "signIn" ? (
            <SignInCard setAuth={setAuth} />
          ) : (
            <SignUpCard setAuth={setAuth} />
          )}
        </div>

        <p className="text-sm flex items-center justify-center w-full py-5 mt-auto">
          Lightweight Miro clone made with ❤️ by Steven Audrey Daye 🇧🇯
        </p>
      </div>
    </div>
  );
};

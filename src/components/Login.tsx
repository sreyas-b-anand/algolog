"use client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const handleAuthSwitch = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div>
      {isLogin ? (
        <div className="flex flex-col gap-4 items-center justify-center  p-6 rounded-lg ">
          <h1 className="text-2xl font-semibold">Login</h1>
          <p className="text-foreground/70 ">
            Enter your credentials to access your account
          </p>
          <div className="w-full flex flex-col gap-1">
            <Label className="text-foreground/70">Email </Label>
            <Input type="email" placeholder="email" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="text-foreground/70">Password </Label>
            <Input type="password" placeholder="password" />
          </div>
          <div className="w-full flex flex-col gap-1 py-2">
            <Button className="hover:cursor-pointer bg-accent">Login</Button>
          </div>
          <div className="w-full flex items-center justify-center gap-2 p-3">
            <p>New User?</p>{" "}
            <a
              onClick={handleAuthSwitch}
              className="underline hover:cursor-pointer"
              role="button"
            >
              Create an account
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center p-6 rounded-lg">
          <h1 className="text-2xl font-semibold">Signup</h1>
          <p className="text-foreground/70">
            Create a new account using your credentials
          </p>
          <div className="w-full flex flex-col gap-1">
            <Label className="text-foreground/70">Username </Label>
            <Input type="text" placeholder="username" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="text-foreground/70">Email</Label>
            <Input type="email" placeholder="email" />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="text-foreground/70">Password</Label>
            <Input type="password" placeholder="password" />
          </div>
          <div className="w-full flex flex-col gap-1 py-2">
            <Button className="hover:cursor-pointer bg-accent">Signup</Button>
          </div>
          <div className="w-full flex items-center justify-center gap-2 p-3">
            <p>Already have an account?</p>
            <a
              onClick={handleAuthSwitch}
              className="underline hover:cursor-pointer"
              role="button"
            >
              Login here
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

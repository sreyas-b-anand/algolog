"use client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import supabaseClient from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const signUpUserWithEmail = async () => {
    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (!data.session) {
      toast.success(
        "Signup successful! Please check your email to verify your account."
      );
      localStorage.setItem("algolog_email", email);
      router.push("/verify-email");
      return;
    }
    if (error) {
      toast.error(`Error signing up user`);
      console.error("Error signing up user:", error);
    }
  };

  const signInUserWithEmailAndPassword = async () => {
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (data.session) {
      toast.success("Login successfully!");
      router.push("/dashboard");
    }
    if (error) {
      toast.error(`Error logging in user`);
      console.error("Error signing up user:", error);
    }
  };

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
            <Input
              type="email"
              placeholder="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="text-foreground/70">Password </Label>
            <Input
              type="password"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-1 py-2">
            <Button
              className="hover:cursor-pointer bg-accent"
              onClick={signInUserWithEmailAndPassword}
            >
              Login
            </Button>
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
            <Label className="text-foreground/70">Email</Label>
            <Input
              type="email"
              placeholder="email"
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-1">
            <Label className="text-foreground/70">Password</Label>
            <Input
              type="password"
              placeholder="password"
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>
          <div className="w-full flex flex-col gap-1 py-2">
            <Button
              className="hover:cursor-pointer bg-accent"
              onClick={signUpUserWithEmail}
            >
              Signup
            </Button>
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

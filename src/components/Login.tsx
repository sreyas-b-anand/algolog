"use client";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@radix-ui/react-dropdown-menu";
import { useState } from "react";
import supabaseClient from "@/lib/supabase/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logo from "@/public/logo.png";
import Loader from "./Loader";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const signUpUserWithEmailandPassword = async () => {
    setIsLoading(true);

    const { data, error } = await supabaseClient.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });
    if (error) {
      if (error.message.toLowerCase().includes("user already registered")) {
        toast("An account with this email already exists.");
      } else {
        toast("Signup failed. Please try again.", {
          style: { backgroundColor: "#ef4444", color: "white" },
        });
      }
      console.error("Signup error:", error.message);
      setError(error.message);
      setIsLoading(false);
      return;
    }

    if (!data.session && !error) {
      toast("Sign Up successful!! Please verify your email", {
        style: { backgroundColor: "#22c55e", color: "white" },
      });
      localStorage.setItem("algolog_email", email);
      setIsLoading(false);
      router.push("/verify-email");
      return;
    } else if (data.session) {
      router.push("/dashboard");
      toast("Sign Up successful!! Redirecting to dashboard", {
        style: { backgroundColor: "#22c55e", color: "white" },
      });
      localStorage.setItem("algolog_email", email);
      setIsLoading(false);
      return;
    }
  };

  const signInUserWithEmailAndPassword = async () => {
    setIsLoading(true);
    const { data, error } = await supabaseClient.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (data.session) {
      toast("Login successful!!", {
        style: { backgroundColor: "#22c55e", color: "white" },
      });
      router.push("/dashboard");
      setIsLoading(false);
      setError(null);
      return;
    }
    if (error) {
      toast(`Error logging in user`, {
        style: { backgroundColor: "#ef4444", color: "white" },
      });
      console.error("Error signing up user:", error);
      setError(error.message);
      setIsLoading(false);
      return;
    }
  };

  const [isLogin, setIsLogin] = useState(true);
  const handleAuthSwitch = () => {
    setIsLogin(!isLogin);
  };
  return (
    <div>
      {isLogin ? (
        <div className="flex flex-col gap-4 items-center justify-center rounded-lg px-12 py-6 border-border">
          {/* Intro */}
          <div className="w-full flex items-center justify-start gap-2 pt-3">
            <Image
              className="rounded-full w-[35px] h-[35px]"
              src={logo}
              alt=""
            />
            <h1 className="text-3xl font-semibold">AlgoLog</h1>
          </div>
          <div className="w-full flex items-center justify-start gap-2">
            <p className="font-small text-md text-foreground/70">
              Login to AlgoLog now
            </p>
          </div>
          <div className="w-full flex flex-col gap-2  border-b border-border pt-3  pb-6">
            <Button
              className="bg-accent hover:cursor-pointer hover:bg-accent/80 w-full"
              disabled
            >
              Coming soon: Sign in with Google
            </Button>
          </div>

          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              signInUserWithEmailAndPassword();
            }}
            className="w-full flex flex-col gap-4"
          >
            <div className="w-full flex flex-col gap-1">
              <Label className="text-foreground/70">Email </Label>
              <Input
                required
                className="border-border border-[1px]"
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
                required
                minLength={6}
                className="border-border border-[1px]"
                type="password"
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="w-full flex flex-col gap-1 items-center justify-center">
              {error && (
                <p className="text-sm text-red-500 px-2 py-1 rounded">
                  {error}
                </p>
              )}
            </div>
            <div className="w-full flex flex-col gap-1 py-2">
              <Button
                className="hover:cursor-pointer hover:bg-accent/80 bg-accent"
                type="submit"
              >
                {isLoading ? <Loader /> : "Login"}
              </Button>
            </div>
          </form>

          <div className="w-full flex items-center justify-center gap-2 p-3">
            <p>Don&apos;t have an account?</p>{" "}
            <a
              onClick={handleAuthSwitch}
              className="underline hover:cursor-pointer"
              role="button"
            >
              Sign Up Now
            </a>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 items-center justify-center p-6 rounded-lg border-border ">
          <div className="w-full flex items-center justify-start gap-2 pt-3">
            <Image
              className="rounded-full w-[35px] h-[35px]"
              src={logo}
              alt=""
            />
            <h1 className="text-3xl font-semibold">AlgoLog</h1>
          </div>
          <div className="w-full flex items-center justify-start gap-2">
            <p className="font-small text-md text-foreground/70">
              SignUp to AlgoLog now
            </p>
          </div>
          <div className="w-full flex flex-col gap-2  border-b border-border pt-3  pb-6">
            <Button
              className="bg-accent hover:cursor-pointer hover:bg-accent/80 w-full"
              disabled
            >
              Coming soon: Sign in with Google
            </Button>
          </div>

          <form
            action=""
            onSubmit={(e) => {
              e.preventDefault();
              signUpUserWithEmailandPassword();
            }}
            className="w-full flex flex-col gap-4"
          >
            <div className="w-full flex flex-col gap-1">
              <Label className="text-foreground/70">Email</Label>
              <Input
                required
                className="border-border border-[1px]"
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
                minLength={6}
                required
                className="border-border border-[1px]"
                type="password"
                placeholder="password"
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>
            <div className="w-full flex flex-col gap-1 py-2">
              <Button type="submit" className="hover:cursor-pointer bg-accent">
                {isLoading ? <Loader /> : "Signup"}
              </Button>
            </div>
          </form>
          <div className="w-full flex flex-col gap-1 items-center justify-center">
            {error && (
              <p className="text-sm text-red-500 px-2 py-1 rounded">{error}</p>
            )}
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

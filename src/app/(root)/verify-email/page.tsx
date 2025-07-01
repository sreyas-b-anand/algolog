"use client";

import supabaseClient from "@/lib/supabase/client";
import { Button } from "@/src/components/ui/button";
import { Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { toast } from "sonner";

const VerifyEmail = () => {
  const router = useRouter();
  const resendEmail = async () => {
    const email = localStorage.getItem("algolog_email");
    if (!email) {
      toast.error("No email found. Please try signing up again.");
      router.push("/");
    }
    const { error } = await supabaseClient.auth.resend({
      type: "signup",
      email: email!,
    });
    if (error) {
      toast.error(
        "Error resending verification email. Please try again later."
      );
      console.error("Error resending verification email:", error);
    } else {
      toast.success("Verification email sent!");
    }
  };
  return (
    <div className="w-screen h-screen flex-col flex items-center justify-center gap-3 bg-background">
      <span className="p-3 rounded-full">
        {" "}
        <Mail size={50} />
      </span>
      <p className="font-semibold text-2xl">Check your inbox please!</p>
      <p className="text-foreground/70 text-center mb-4">
        We&apos;ve sent you a verification email. Please check your inbox and
        click the link to activate your account.
      </p>

      <Button
        className="bg-accent hover:cursor-pointer hover:opacity-[90%]"
        onClick={resendEmail}
      >
        Resend Email
      </Button>
    </div>
  );
};

export default VerifyEmail;

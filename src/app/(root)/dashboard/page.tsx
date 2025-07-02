"use client";
import supabaseClient from "@/lib/supabase/client";
import React from "react";
import { useEffect } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Navbar from "@/src/components/Navbar";
const Dashboard = () => {
  const router = useRouter();
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session && session.user.email_confirmed_at) {
        console.log("Logged in:", session.user);
      } else {
        router.push("/");
        toast.error("Please log in to access the dashboard.");
      }
    });
  }, []);
  return (
    <>
      <div>
        <div>
          <Navbar/>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

// hooks/useProblemSubmit.ts
import { createAxiosInstance } from "@/src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ProblemForm } from "../types/problem";
import supabaseClient from "@/lib/supabase/client";
import { queryClient } from "../utils/react-query";
export const useSubmitProblem = () => {
  return useMutation({
    mutationFn: async (form: ProblemForm) => {
      const {
        data: { session },
      } = await supabaseClient.auth.getSession();

      const token = session?.access_token;
      if (!token) throw new Error("User not logged in");

      const payload = {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()),
      };
      const axiosInstance = createAxiosInstance(token)
      

      const res = await axiosInstance.post(
        "add-problems",
        payload,
      );

      return res.data;
    },
    onSuccess: () => {
      toast("Upload successful", { richColors: true });
      queryClient.invalidateQueries({ queryKey: ["problems"] }); // ⬅️ Invalidate cache
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (err: any) => {
      toast("Upload failed: " + err.message, { richColors: true });
    },
  });
};

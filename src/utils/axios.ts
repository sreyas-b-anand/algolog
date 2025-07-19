// utils/axiosInstance.ts
import axios from "axios";

export const createAxiosInstance = (token: string) => {
  return axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/functions/v1/`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

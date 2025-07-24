/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
import { createAxiosInstance } from "@/src/utils/axios";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

import supabaseClient from "@/lib/supabase/client";
import { queryClient } from "@/src/utils/react-query";
import { useState } from "react";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textarea";
import { Switch } from "@/src/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";

import { CalendarIcon, Clock, Zap, Star, Tag, File } from "lucide-react";

import type { ProblemForm } from "@/src/types/problem";

export default function ProblemForm() {
  const [form, setForm] = useState<ProblemForm>({
    title: "",
    platform: "",
    question_number: "",
    difficulty: "",
    tags: "",
    pseudo_code: "",
    t_c: "",
    s_c: "",
    solved_at: new Date().toISOString().split("T")[0],
    is_important: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const mutation = useMutation({
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
      const axiosInstance = createAxiosInstance(token);

      const res = await axiosInstance.post("add-problems", payload);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form)
  };

  const difficulties = ["Easy", "Medium", "Hard"];
  const platforms = [
    "LeetCode",
    "HackerRank",
    "CodeForces",
    "AtCoder",
    "GeeksforGeeks",
  ];

  return (
    <div className="flex flex-col py-6 px-2 md:px-4 lg:px-6 xl:px-12 flex-1 space-y-6 w-full">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Add New Problem</h1>
        <p className="text-muted-foreground">
          Track your coding problem solutions and progress
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 w-full h-full">
        {/* Card Row */}
        <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full">
          {/* Basic Information */}
          <Card className="bg-card border-border w-full lg:w-1/3">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Basic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="title" className="text-foreground">
                  Problem Title
                </Label>
                <Input
                  id="title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="e.g., Two Sum, Binary Search Tree Validation"
                  className="bg-background border-border text-foreground"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="platform" className="text-foreground">
                    Platform
                  </Label>
                  <Select
                    value={form.platform}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, platform: value }))
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select platform" />
                    </SelectTrigger>
                    <SelectContent>
                      {platforms.map((platform) => (
                        <SelectItem key={platform} value={platform}>
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="question_number" className="text-foreground">
                    Question Number
                  </Label>
                  <Input
                    id="question_number"
                    name="question_number"
                    value={form.question_number}
                    onChange={handleChange}
                    placeholder="e.g., 1, 2, 3..."
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Problem Details */}
          <Card className="bg-card border-border w-full lg:w-1/3">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Problem Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="difficulty" className="text-foreground">
                    Difficulty
                  </Label>
                  <Select
                    value={form.difficulty}
                    onValueChange={(value) =>
                      setForm((prev) => ({ ...prev, difficulty: value }))
                    }
                  >
                    <SelectTrigger className="bg-background border-border text-foreground">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent>
                      {difficulties.map((difficulty) => (
                        <SelectItem key={difficulty} value={difficulty}>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${
                                difficulty === "Easy"
                                  ? "bg-green-500"
                                  : difficulty === "Medium"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            />
                            {difficulty}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="tags" className="text-foreground">
                    Tags{" "}
                    <p className="text-xs text-muted-foreground">
                      (Use commas)
                    </p>
                  </Label>
                  <Input
                    id="tags"
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="array, hash-table, two-pointers"
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="t_c" className="text-foreground">
                    Time Complexity
                  </Label>
                  <Input
                    id="t_c"
                    name="t_c"
                    value={form.t_c}
                    onChange={handleChange}
                    placeholder="O(n), O(log n), O(n²)"
                    className="bg-background border-border text-foreground"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="s_c" className="text-foreground">
                    Space Complexity
                  </Label>
                  <Input
                    id="s_c"
                    name="s_c"
                    value={form.s_c}
                    onChange={handleChange}
                    placeholder="O(1), O(n), O(log n)"
                    className="bg-background border-border text-foreground"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Other Details */}
          <Card className="bg-card border-border w-full lg:w-1/3">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center gap-2">
                <File className="h-5 w-5" />
                Other Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col gap-2">
                <Label
                  htmlFor="solved_at"
                  className="text-foreground flex items-center gap-2"
                >
                  <CalendarIcon className="h-4 w-4" />
                  Solved Date
                </Label>
                <Input
                  id="solved_at"
                  type="date"
                  name="solved_at"
                  value={form.solved_at}
                  onChange={handleChange}
                  className="bg-background border-border text-foreground flex "
                />
              </div>
              <div className="flex  gap-3">
                <Switch
                  id="important"
                  name="is_important"
                  checked={form.is_important}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, is_important: v }))
                  }
                />
                <Label
                  htmlFor="important"
                  className="text-foreground flex flex-row items-center gap-2"
                >
                  <Star className="h-4 w-4" />
                  Mark as Important
                </Label>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Solution Details */}
        <Card className="bg-card border-border w-full flex-1">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Solution Details
              <CardDescription>
                Document your approach and solution
              </CardDescription>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="pseudo_code" className="text-foreground">
                Pseudocode / Approach
              </Label>
              <Textarea
                id="pseudo_code"
                name="pseudo_code"
                rows={6}
                value={form.pseudo_code}
                onChange={handleChange}
                placeholder="Describe your approach step by step..."
                className="bg-background border-border text-foreground resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            type="submit"
            className="flex-1 bg-primary text-background hover:bg-primary/90"
          >
            Add Problem
          </Button>
          <Button
            disabled
            type="button"
            variant="outline"
            className="border-border text-foreground hover:bg-accent bg-transparent"
          >
            Save as Draft
          </Button>
        </div>
      </form>
    </div>
  );
}

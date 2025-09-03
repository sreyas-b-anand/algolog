/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import type React from "react";
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
        error: sessionError,
      } = await supabaseClient.auth.getSession();

      if (sessionError) throw new Error(sessionError.message);

      const user = session?.user;
      if (!user) throw new Error("User not logged in");

      const payload = {
        ...form,
        tags: form.tags.split(",").map((tag) => tag.trim()),
        user_id: user.id, // ✅ attach logged in user
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabaseClient
        .from("problems")
        .insert([payload])
        .select("*"); // return inserted row

      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      toast("Upload successful ✅", { richColors: true });
      queryClient.invalidateQueries({ queryKey: ["problems"] });
    },
    onError: (err: any) => {
      toast("Upload failed: " + err.message, { richColors: true });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(form);
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
    <div className="min-h-screen bg-background font-sans">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 space-y-2">
          <h1 className="text-3xl font-bold text-foreground">
            Add New Problem
          </h1>
          <p className="text-primary text-md">
            Track your coding problem solutions and progress
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Three Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Basic Information */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                  <Tag className="h-5 w-5 text-primary" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="title"
                    className="text-foreground text-sm font-medium"
                  >
                    Problem Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="e.g., Two Sum, Binary Search Tree Validation"
                    className="bg-background border-border text-foreground 
                             placeholder:text-primary focus:border-primary 
                             focus:ring-primary"
                    required
                  />
                </div>

                {/* Platform Select */}
                <div className="space-y-2">
                  <Label
                    htmlFor="platform"
                    className="text-foreground text-sm font-medium"
                  >
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
                    <SelectContent className="bg-card border-border">
                      {platforms.map((platform) => (
                        <SelectItem
                          key={platform}
                          value={platform}
                          className="text-foreground focus:bg-accent"
                        >
                          {platform}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="question_number"
                      className="text-[#f8f9fa] text-sm font-medium"
                    >
                      Question Number
                    </Label>
                    <Input
                      id="question_number"
                      name="question_number"
                      value={form.question_number}
                      onChange={handleChange}
                      placeholder="e.g., 1, 2, 3..."
                      className="bg-[#0f1113] border-[#2c2c3e] text-[#f8f9fa] placeholder:text-[#9a9a99] focus:border-[#9a9a99] focus:ring-[#9a9a99]"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem Details */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-primary" />
                  Problem Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="difficulty"
                      className="text-foreground text-sm font-medium"
                    >
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
                      <SelectContent className="bg-card border-border">
                        {difficulties.map((difficulty) => (
                          <SelectItem
                            key={difficulty}
                            value={difficulty}
                            className="text-foreground focus:bg-accent"
                          >
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

                  <div className="space-y-2">
                    <Label
                      htmlFor="tags"
                      className="text-foreground text-sm font-medium"
                    >
                      Tags{" "}
                      <span className="text-xs text-primary">(Use commas)</span>
                    </Label>
                    <Input
                      id="tags"
                      name="tags"
                      value={form.tags}
                      onChange={handleChange}
                      placeholder="array, hash-table, two-pointers"
                      className="bg-background border-border text-foreground placeholder:text-primary focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="t_c"
                      className="text-foreground text-sm font-medium"
                    >
                      Time Complexity
                    </Label>
                    <Input
                      id="t_c"
                      name="t_c"
                      value={form.t_c}
                      onChange={handleChange}
                      placeholder="O(n), O(log n), O(n²)"
                      className="bg-background border-border text-foreground placeholder:text-primary focus:border-primary focus:ring-primary"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="s_c"
                      className="text-foreground text-sm font-medium"
                    >
                      Space Complexity
                    </Label>
                    <Input
                      id="s_c"
                      name="s_c"
                      value={form.s_c}
                      onChange={handleChange}
                      placeholder="O(1), O(n), O(log n)"
                      className="bg-background border-border text-foreground placeholder:text-primary focus:border-primary focus:ring-primary"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Other Details */}
            <Card className="bg-card border-border">
              <CardHeader className="pb-4">
                <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                  <File className="h-5 w-5 text-primary" />
                  Other Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label
                    htmlFor="solved_at"
                    className="text-foreground flex items-center gap-2 text-sm font-medium"
                  >
                    <CalendarIcon className="h-4 w-4 text-primary" />
                    Solved Date
                  </Label>
                  <Input
                    id="solved_at"
                    type="date"
                    name="solved_at"
                    value={form.solved_at}
                    onChange={handleChange}
                    className="bg-background border-border text-foreground focus:border-primary focus:ring-primary"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Switch
                    id="important"
                    name="is_important"
                    checked={form.is_important}
                    onCheckedChange={(v) =>
                      setForm((prev) => ({ ...prev, is_important: v }))
                    }
                    className="data-[state=checked]:bg-primary"
                  />
                  <Label
                    htmlFor="important"
                    className="text-foreground flex items-center gap-2 text-sm font-medium cursor-pointer"
                  >
                    <Star className="h-4 w-4 text-primary" />
                    Mark as Important
                  </Label>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Solution Details - Full Width */}
          <Card className="bg-card border-border">
            <CardHeader className="pb-4">
              <CardTitle className="text-foreground flex items-center gap-2 text-lg">
                <Clock className="h-5 w-5 text-primary" />
                Solution Details
              </CardTitle>
              <CardDescription className="text-primary">
                Document your approach and solution
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label
                  htmlFor="pseudo_code"
                  className="text-foreground text-sm font-medium"
                >
                  Pseudocode / Approach
                </Label>
                <Textarea
                  id="pseudo_code"
                  name="pseudo_code"
                  rows={8}
                  value={form.pseudo_code}
                  onChange={handleChange}
                  placeholder="Describe your approach step by step...&#10;&#10;1. Initialize variables&#10;2. Process input&#10;3. Apply algorithm&#10;4. Return result"
                  className="bg-background border-border text-foreground placeholder:text-primary resize-none focus:border-primary focus:ring-primary min-h-[200px]"
                />
              </div>
            </CardContent>
          </Card>

          {/* Submit Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pb-8">
            <Button
              type="submit"
              disabled={mutation.isPending}
              className="flex-1 bg-primary text-background hover:bg-primary/90 
                       font-medium py-2.5 transition-colors"
            >
              {mutation.isPending ? "Adding Problem..." : "Add Problem"}
            </Button>
            <Button
              disabled
              type="button"
              variant="outline"
              className="border-border text-foreground hover:bg-accent 
                       bg-transparent font-medium py-2.5"
            >
              Save as Draft
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

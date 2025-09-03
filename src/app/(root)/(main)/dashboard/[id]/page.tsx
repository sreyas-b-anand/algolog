"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import supabaseClient from "@/lib/supabase/client";
import { Loader2, ArrowLeft, Star } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";

type Problem = {
  id: string;
  title: string;
  platform: string;
  question_number: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  is_important: boolean;
  solved_at: string;
  t_c: string;
  s_c: string;
  pseudo_code?: string;
};

const fetchProblemById = async (id: string): Promise<Problem | null> => {
  const { data, error } = await supabaseClient
    .from("problems")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return data;
};

const difficultyColor: Record<Problem["difficulty"], string> = {
  Easy: "bg-green-500 text-white",
  Medium: "bg-yellow-500 text-black",
  Hard: "bg-red-500 text-white",
};

export default function Log() {
  const { id } = useParams();
  const router = useRouter();

  const { data: problem, isLoading, isError, error } = useQuery({
    queryKey: ["problem", id],
    queryFn: () => fetchProblemById(id as string),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="animate-spin h-6 w-6" />
      </div>
    );
  }

  if (isError || !problem) {
    toast.error((error as Error)?.message || "Problem not found");
    return (
      <div className="p-6">
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </Button>

      <Card className="shadow-md">
        <CardContent className="p-6 space-y-6">
          {/* Title & Difficulty */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">{problem.title}</h1>
            <Badge className={difficultyColor[problem.difficulty]}>
              {problem.difficulty}
            </Badge>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
            <span>{problem.platform} #{problem.question_number}</span>
            <span>Solved on: {new Date(problem.solved_at).toLocaleDateString()}</span>
            {problem.is_important && (
              <span className="flex items-center gap-1 text-yellow-500 font-semibold">
                <Star className="h-4 w-4 fill-yellow-400" /> Important
              </span>
            )}
          </div>

          {/* Tags */}
          {problem.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {problem.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Complexities */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="bg-card border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Time Complexity</p>
                <h2 className="text-lg font-semibold">{problem.t_c}</h2>
              </CardContent>
            </Card>
            <Card className="bg-card border">
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Space Complexity</p>
                <h2 className="text-lg font-semibold">{problem.s_c}</h2>
              </CardContent>
            </Card>
          </div>

          {/* Pseudocode */}
          <div>
            <h2 className="text-lg font-semibold mb-2">Pseudocode</h2>
            <pre className="bg-muted p-4 rounded text-sm whitespace-pre-wrap">
              {problem.pseudo_code || "No pseudocode provided."}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Loader2, PlusCircle, Star, Trash2 } from "lucide-react";
import supabaseClient from "@/lib/supabase/client";

type Problem = {
  id: string;
  title: string;
  platform: string;
  question_number: string;
  difficulty: string;
  tags: string[];
  is_important: boolean;
  solved_at: string;
};

const fetchProblems = async (): Promise<Problem[]> => {
  const { data, error } = await supabaseClient
    .from("problems")
    .select("*")
    .order("solved_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

//  Delete problem
const deleteProblem = async (id: string) => {
  const { error } = await supabaseClient.from("problems").delete().eq("id", id);
  if (error) throw new Error(error.message);
  return id;
};

const LogsPage = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"All" | "Easy" | "Medium" | "Hard">(
    "All"
  );

  // session guard
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      if (!data.session || !data.session.user.email_confirmed_at) {
        router.push("/");
        toast.error("Please log in to access logs.");
      }
    });
  }, [router]);

  // React Query fetch
  const {
    data: problems = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["problems"],
    queryFn: fetchProblems,
    staleTime: 1000 * 60 * 2,
    retry: 1,
    refetchOnWindowFocus: false,
  });

  // Delete mutation
  const { mutate: removeProblem, isPending: isDeleting } = useMutation({
    mutationFn: deleteProblem,
    onSuccess: (id) => {
      toast.success("Problem deleted");
      queryClient.setQueryData<Problem[]>(["problems"], (old) =>
        old ? old.filter((p) => p.id !== id) : []
      );
    },
    onError: (err: Error) => {
      toast.error(err.message);
    },
  });

  if (isError) toast.error((error as Error).message);

  // Filtering
  const filteredProblems = problems.filter((p) => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "All" || p.difficulty === filter;
    return matchesSearch && matchesFilter;
  });

  // Stats
  const stats = {
    total: problems.length,
    easy: problems.filter((p) => p.difficulty === "Easy").length,
    medium: problems.filter((p) => p.difficulty === "Medium").length,
    hard: problems.filter((p) => p.difficulty === "Hard").length,
    important: problems.filter((p) => p.is_important).length,
  };

  return (
    <div className="min-h-screen bg-background text-color-foreground p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-3xl font-bold">Your Logs</h1>
        <p className="text-md text-primary">
          Track your solved problems and stats
        </p>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
        }}
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6"
      >
        {[
          { label: "Total", value: stats.total },
          { label: "Easy", value: stats.easy },
          { label: "Medium", value: stats.medium },
          { label: "Hard", value: stats.hard },
          { label: "⭐ Important", value: stats.important },
        ].map((s) => (
          <motion.div
            key={s.label}
            variants={{
              hidden: { opacity: 0, y: 10 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Card className="bg-card border border-border shadow">
              <CardContent className="p-4">
                <p className="text-sm text-primary">{s.label}</p>
                <h2 className="text-xl font-semibold">{s.value}</h2>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-card border-border"
        />
        <select
          className="bg-card border-border rounded-md p-2"
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as "All" | "Easy" | "Medium" | "Hard")
          }
        >
          <option value="All">All</option>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <Button
          onClick={() => router.push("/add")}
          className="ml-auto hover:cursor-pointer"
        >
          <PlusCircle /> Add Problem
        </Button>
      </div>

      {/* Problems List */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
      ) : filteredProblems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-primary"
        >
          No problems logged yet. <br />
          <Button
            onClick={() => router.push("/add")}
            className="mt-4 hover:cursor-pointer"
          >
            Add your first problem
          </Button>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-4"
        >
          {filteredProblems.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="bg-[var(--color-card)] border border-[var(--color-border)] hover:shadow-md transition">
                <CardContent className="p-4 flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <div className="flex items-center justify-center gap-2">
                      {p.is_important && (
                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => removeProblem(p.id)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-5 w-5 text-red-500" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => router.push(`/dashboard/${p.id}`)}
                      >
                        More Info
                      </Button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge
                      variant="outline"
                      className="capitalize text-white/70"
                    >
                      {p.difficulty}
                    </Badge>
                    <span className="text-white/70">
                      {p.platform} #{p.question_number}
                    </span>
                    <span className="ml-auto text-xs text-primary">
                      {new Date(p.solved_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {p.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default LogsPage;

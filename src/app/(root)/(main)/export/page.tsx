"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { motion } from "framer-motion";
import supabaseClient from "@/src/lib/supabase/client";
import { Card, CardContent } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Loader2, Download } from "lucide-react";
import { saveAs } from "file-saver";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";

type Problem = {
  id: string;
  title: string;
  difficulty: string;
  tags: string[];
  pseudo_code: string;
  t_c: string;
  s_c: string;
  is_important: boolean;
};

const fetchImportantProblems = async (): Promise<Problem[]> => {
  const { data, error } = await supabaseClient
    .from("problems")
    .select("*")
    .eq("is_important", true)
    .order("created_at", { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
};

// Styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 12,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: "bold",
  },
  section: {
    marginBottom: 8,
  },
  difficulty: {
    marginBottom: 6,
    fontWeight: "bold",
  },
  tag: {
    fontSize: 10,
    marginRight: 4,
    padding: 2,
    backgroundColor: "#eee",
  },
});

const ProblemPDF = ({ problem }: { problem: Problem }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>{problem.title}</Text>

      <Text style={styles.difficulty}>
        Difficulty: {problem.difficulty}
      </Text>

      <View style={styles.section}>
        <Text>Algorithm: {problem.pseudo_code || "N/A"}</Text>
      </View>

      <View style={styles.section}>
        <Text>Time Complexity: {problem.t_c || "N/A"}</Text>
        <Text>Space Complexity: {problem.s_c || "N/A"}</Text>
      </View>

      <View style={styles.section}>
        <Text>Tags:</Text>
        <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
          {problem.tags?.map((tag) => (
            <Text key={tag} style={styles.tag}>
              {tag}
            </Text>
          ))}
        </View>
      </View>
    </Page>
  </Document>
);

const exportProblemPDF = async (problem: Problem) => {
  const blob = await pdf(<ProblemPDF problem={problem} />).toBlob();
  saveAs(blob, `${problem.title}.pdf`);
};

const RevisionPage = () => {
  const router = useRouter();

  // Guard for logged-in users
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      if (!data.session || !data.session.user.email_confirmed_at) {
        router.push("/");
        toast.error("Please log in to access revision.");
      }
    });
  }, [router]);

  const {
    data: problems = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["important-problems"],
    queryFn: fetchImportantProblems,
    staleTime: 1000 * 60 * 2,
    retry: 1,
  });

  if (isError) toast.error((error as Error).message);

  return (
    <div className="min-h-screen bg-background text-foreground p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold">Revision</h1>
        <p className="text-sm text-primary">
          Quick flashcards of important problems
        </p>
      </motion.div>

      {/* Problems */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <Loader2 className="animate-spin h-6 w-6" />
        </div>
      ) : problems.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20 text-primary"
        >
          No important problems marked yet.
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
          }}
          className="grid gap-4 sm:grid-cols-2 md:grid-cols-3"
        >
          {problems.map((p) => (
            <motion.div
              key={p.id}
              variants={{
                hidden: { opacity: 0, y: 15 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="bg-card border border-border rounded-2xl shadow-md hover:shadow-lg transition">
                <CardContent className="p-4 flex flex-col gap-3">
                  {/* Title + Difficulty */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{p.title}</h2>
                    <Badge
                      className={`${
                        p.difficulty === "Easy"
                          ? "bg-green-500"
                          : p.difficulty === "Medium"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                      } text-white`}
                    >
                      {p.difficulty}
                    </Badge>
                  </div>

                  {/* Info */}
                  <div className="text-sm space-y-1">
                    <p>
                      <strong>Algorithm:</strong>{" "}
                      <span className="text-foreground/80">
                        {p.pseudo_code}
                      </span>
                    </p>
                    <p>
                      <strong>TC:</strong> {p.t_c || "N/A"}
                    </p>
                    <p>
                      <strong>SC:</strong> {p.s_c || "N/A"}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {p.tags?.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  {/* PDF Export */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2 flex items-center gap-2"
                    onClick={() => exportProblemPDF(p)}
                  >
                    <Download className="w-4 h-4" /> Export PDF
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default RevisionPage;

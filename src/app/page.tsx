"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Github, Sparkles, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

interface ProjectData {
  title: string;
  description: string;
  techStack: string[];
  challenges?: string;
  githubUrl?: string;
}
interface GeneratedCaption {
  caption: string;
  tone: string;
}

export default function LinkedInCaptionGenerator() {
  const [activeTab, setActiveTab] = useState("generate");
  const [loading, setLoading] = useState(false);
  const [generatedCaption, setGeneratedCaption] =
    useState<GeneratedCaption | null>(null);
  const [projectData, setProjectData] = useState<ProjectData>({
    title: "",
    description: "",
    techStack: [],
    challenges: "",
    githubUrl: "",
  });
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [techStackInput, setTechStackInput] = useState("");
  const [githubUrlInput, setGithubUrlInput] = useState("");

  const handleAddTechStack = () => {
    if (
      techStackInput.trim() &&
      techStackInput.includes(techStackInput.trim())
    ) {
      setProjectData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, techStackInput.trim()],
      }));
      setTechStackInput("");
    }
  };
  const handleRemoveTechStack = (tech: string) => {
    setProjectData((prev) => {
      const updatedTechStack = prev.techStack.filter((t) => {
        tech !== t;
      });
      return {
        ...prev,
        techStack: updatedTechStack,
      };
    });
  };
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key == "Enter") {
      e.preventDefault();
      handleAddTechStack();
    }
  };
  const copyToClipboard = (text: string) => {};
  return (
    // Main component for LinkedIn Caption Generator
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex items-center justify-center flex-col">
        <h1 className="text-2xl font-bold mb-2">LinkedIn Caption Generator</h1>
        <h2 className="text-med text-gray-500">
          Generate captions for your LinkedIn posts about your projects using AI{" "}
        </h2>
      </div>
      <Card className="mb-6 mt-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            Project Details
            <a href="/github" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              setIsGenerating(true);
              try {
                const res = await fetch('/api/generate-caption', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    githubUrl: projectData.githubUrl, // Make sure this is available in your projectData
                    tone: tone,
                  }),
                });
                const data = await res.json();
                setGeneratedCaption({
                  caption: data.caption,
                  tone: tone,
                });
              } catch (error) {
                setGeneratedCaption({
                  caption: 'Failed to generate caption.',
                  tone: tone,
                });
              }
              setIsGenerating(false);
            }}
          >
            <div className="space-y-4">
              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Github Project URL*</h2>
              </div>
              <Input
                
                value={githubUrlInput}
                onChange={(e) => setGithubUrlInput(e.target.value)}
                className="w-full"
                onBlur={() => {
                  if (githubUrlInput.trim()) {
                    setProjectData((prev) => ({
                      ...prev,
                      githubUrl: githubUrlInput.trim(),
                    }));
                  }
                }}
              />
              <div className="space-y-2">
                <h2 className="text-sm font-semibold">Caption Tone</h2>
              </div>
              <Select value={tone} onValueChange={setTone} >
                <SelectTrigger>
                  <SelectValue placeholder="Select Tone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="enthusiastic">Enthusiastic</SelectItem>
                  <SelectItem value="inspirational">Inspirational</SelectItem>
                  <SelectItem value="humorous">Humorous</SelectItem>
                </SelectContent>
              </Select>
              <Button type="submit" disabled={isGenerating} className="w-full">
                {isGenerating ? (
                  <Loader2 className="animate-spin h-4 w-4 mr-2" />
                ) : (
                  <RefreshCw className="h-4 w-4 mr-2" />
                )}
                Generate Caption
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      {generatedCaption && (
  <Card className="mb-6">
    <CardHeader>
      <CardTitle className="flex items-center">
        <Sparkles className="h-5 w-5 mr-2" />
        Generated Caption
      </CardTitle>
    </CardHeader>
    <CardContent>
      <Textarea
        value={generatedCaption.caption}
        readOnly
        className="w-full mb-2 text-medium"
        rows={6}
      />
      <div className="flex items-center">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            navigator.clipboard.writeText(generatedCaption.caption);
          }}
        >
          <Copy className="h-4 w-4 mr-1" /> Copy
        </Button>
      </div>
    </CardContent>
  </Card>
)}
    </div>
  );
}

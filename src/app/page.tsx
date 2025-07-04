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

  const copyToClipboard = () => {
    if (generatedCaption) {
      navigator.clipboard.writeText(generatedCaption.caption);
    }
  };

  return (
    // Main component for LinkedIn Caption Generator
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex items-center justify-center flex-col text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
          <Sparkles className="h-8 w-8 text-blue-500" />
          LinkedIn Caption Generator
        </h1>
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
                required
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
              <Button
                type="submit"
                disabled={isGenerating}
                className="w-full mt-6"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Caption
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
     
      <Card className="h-fit">
            <CardHeader>
              <CardTitle>Generated Caption</CardTitle>
            </CardHeader>
            <CardContent>
              {generatedCaption ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Badge variant="outline" className="capitalize">
                        {generatedCaption.tone}
                      </Badge>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                        </Button>
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedCaption.caption}</p>
                  </div>

                  <div className="text-sm text-gray-500">Character count: {generatedCaption.caption.length}/3000</div>

                  <Button onClick={copyToClipboard} className="w-full">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Caption
                  </Button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your generated caption will appear here</p>
                  <p className="text-sm mt-2">Fill in the project details and click "Generate Caption"</p>
                </div>
              )}
            </CardContent>
          </Card>

    </div>
  );
}

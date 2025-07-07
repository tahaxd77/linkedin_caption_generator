"use client";
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Github, Sparkles, Loader2, Check, X } from "lucide-react";

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
  const [githubUrlInput, setGithubUrlInput] = useState("");
  const [copied,setCopied] = useState(false);
  const [editText, setEditText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const copyToClipboard = () => {
    if (generatedCaption) {
      setCopied(true);
      navigator.clipboard.writeText(generatedCaption.caption);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const openEditCaption = () => {
    if (generatedCaption) {
      setEditText(generatedCaption.caption);
      setIsEditModalOpen(true);
    }
  };

  const saveEditCaption = () => {
    if (generatedCaption) {
      setGeneratedCaption({
        ...generatedCaption,
        caption: editText,
      });
      setIsEditModalOpen(false);
    }
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditText("");
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
            <a href="https://github.com/tahaxd77/linkedin_caption_generator" target="_blank" rel="noopener noreferrer">
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
                console.error(error);
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
                          {copied? (
                            <Check className="w-4 h-4"/>
                          ):(
                            <Copy className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </div>
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">{generatedCaption.caption}</p>
                  </div>
                  
                  <div className="text-sm text-gray-500 justify-between flex items-center">
                    Character count: {generatedCaption.caption.length}/3000
                    <Button onClick={openEditCaption}>
                      Edit
                    </Button>
                    </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>Your generated caption will appear here</p>
                  <p className="text-sm mt-2">Fill in the project details and click Generate Caption</p>
                </div>
              )}
            </CardContent>
          </Card>
          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6 text-center">
              <Github className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">GitHub Integration</h3>
              <p className="text-sm text-gray-600">Automatically extract project details from your GitHub repository</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <Sparkles className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">AI-Powered</h3>
              <p className="text-sm text-gray-600">Generate engaging captions using advanced AI technology</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 text-center">
              <RefreshCw className="w-8 h-8 mx-auto mb-3 text-blue-600" />
              <h3 className="font-semibold mb-2">Multiple Tones</h3>
              <p className="text-sm text-gray-600">Choose from professional, friendly, or technical tones</p>
            </CardContent>
          </Card>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 bg-white bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              <div className="flex items-center justify-between p-6 border-b">
                <h3 className="text-lg font-semibold">Edit Caption</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={closeEditModal}
                  className="h-8 w-8"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Caption Text
                    </label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      placeholder="Edit your caption here..."
                      className="min-h-[200px] w-full resize-none rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Character count: {editText.length}/3000
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={closeEditModal}>
                        Cancel
                      </Button>
                      <Button onClick={saveEditCaption}>
                        Save Changes
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
}

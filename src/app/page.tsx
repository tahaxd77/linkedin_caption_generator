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
import {
  Copy,
  RefreshCw,
  Github,
  Sparkles,
  Loader2,
  Check,
  X,
  AlertCircle,
} from "lucide-react";
import { generateCaption } from "@/actions/generateCaption";

interface GeneratedCaption {
  caption: string;
  tone: string;
}

export default function LinkedInCaptionGenerator() {
  const [generatedCaption, setGeneratedCaption] = useState<GeneratedCaption | null>(null);
  const [tone, setTone] = useState("professional");
  const [isGenerating, setIsGenerating] = useState(false);
  const [githubUrlInput, setGithubUrlInput] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [editText, setEditText] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!githubUrlInput.trim()) return;

    setIsGenerating(true);
    setErrorMessage(null);

    try {
      const formData = new FormData();
      formData.set("githubUrl", githubUrlInput.trim());
      formData.set("tone", tone);

      const data = await generateCaption(formData);
      if (!data?.caption) {
        throw new Error("No caption was returned by the server.");
      }

      setGeneratedCaption({
        caption: data.caption,
        tone: data.tone || tone,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to generate caption.";
      setErrorMessage(message);
      console.error("Caption generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="flex items-center justify-center flex-col text-center">
        <h2 className="text-gray-600 font-medium">
          Generate captions for your LinkedIn posts about your projects using AI
        </h2>
      </div>

      <Card className="mb-6 mt-6 max-w-3xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between text-2xl font-bold">
            Project Details
            <a
              href="https://github.com/tahaxd77/linkedin_caption_generator"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold">GitHub Project URL*</label>
                <Input
                  name="githubUrl"
                  placeholder="https://github.com/owner/repository"
                  value={githubUrlInput}
                  onChange={(e) => setGithubUrlInput(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold">Caption Tone</label>
                <Select name="tone" value={tone} onValueChange={setTone}>
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
              </div>

              <Button
                type="submit"
                disabled={isGenerating || !githubUrlInput.trim()}
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

              {errorMessage && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-md flex items-center gap-2 mt-4">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <Card className="mt-8">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">Generated Caption</CardTitle>
                </CardHeader>
                <CardContent>
                  {generatedCaption ? (
                    <div className="space-y-4">
                      <div className="bg-gray-50 p-4 rounded-lg border">
                        <div className="flex items-center justify-between mb-3">
                          <Badge variant="outline" className="capitalize">
                            {generatedCaption.tone}
                          </Badge>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={isGenerating}
                              onClick={() => handleSubmit()}
                              title="Regenerate"
                            >
                              <RefreshCw
                                className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`}
                              />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={copyToClipboard}
                              title="Copy to clipboard"
                            >
                              {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                            </Button>
                          </div>
                        </div>
                        <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-sm">
                          {generatedCaption.caption}
                        </p>
                      </div>

                      <div className="text-sm text-gray-500 justify-between flex items-center">
                        <span>Character count: {generatedCaption.caption.length}/3000</span>
                        <Button type="button" variant="outline" size="sm" onClick={openEditCaption}>
                          Edit
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-10 text-gray-500">
                      <Sparkles className="w-10 h-10 mx-auto mb-3 text-gray-300" />
                      <p className="font-medium text-gray-700">Your caption will appear here</p>
                      <p className="text-xs text-gray-400 mt-1">
                        Enter your repository link and click Generate Caption
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-base font-semibold">Edit Caption</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeEditModal}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-4 space-y-4">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                rows={8}
                placeholder="Edit your caption here..."
                className="w-full resize-none rounded-md border border-gray-300 p-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  Character count: {editText.length}/3000
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={closeEditModal}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={saveEditCaption}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
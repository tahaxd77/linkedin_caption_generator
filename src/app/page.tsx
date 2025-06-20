"use client"
import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
interface GeneratedCaption{
  caption: string;
  tone: string;
}

export default function LinkedInCaptionGenerator() {
  const [activeTab, setActiveTab] = useState("generate");
  const [loading, setLoading] = useState(false);
  const [generatedCaption, setGeneratedCaption] = useState<GeneratedCaption | null>(null);
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
    if (techStackInput.trim() && techStackInput.includes(techStackInput.trim())) {
      setProjectData((prev) => ({
        ...prev,
        techStack: [...prev.techStack, techStackInput.trim()],
      }));
      setTechStackInput("");
    }  
  }
  const handleRemoveTechStack = (tech: string) => {
    setProjectData((prev) => {
      const updatedTechStack = prev.techStack.filter((t) => { tech !== t })
      return {
        ...prev,
        techStack: updatedTechStack,
      }
    })
  }
  const handleKeyPress = (e: React.KeyboardEvent)=>{
    if (e.key == "Enter") {
      e.preventDefault()
      handleAddTechStack();
    }
  }
  const copyToClipboard = (text: string)=>{
    
  }
  return (
    // Main component for LinkedIn Caption Generator
    <div className="max-w-3xl mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            LinkedIn Caption Generator
            <a href="/github" target="_blank" rel="noopener noreferrer">
              <Button variant="ghost" size="icon">
                <Github className="h-5 w-5" />
              </Button>
            </a>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="generate">Generate Caption</TabsTrigger>
              <TabsTrigger value="examples">Examples</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="generate">
              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  setIsGenerating(true);
                  // Simulate API call
                  setTimeout(() => { 
                    setGeneratedCaption({
                      caption: `🚀 Excited to share my latest project: ${projectData.title}! ${projectData.description} #${projectData.techStack.join(" #")}`,
                      tone: tone,
                    });
                    setIsGenerating(false);
                  }
                  , 2000);
                }}
              >
                <div className="space-y-4">
                  <Input
                    placeholder="Project Title"
                    value={projectData.title}
                    onChange={(e) => setProjectData({ ...projectData, title: e.target.value })}
                    className="w-full"
                    required
                  />
                  <Textarea
                    placeholder="Project Description"
                    value={projectData.description}
                    onChange={(e) => setProjectData({ ...projectData, description: e.target.value })}
                    className="w-full"
                    required
                  />
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder="Tech Stack (e.g., React, Node.js)" 
                      value={techStackInput}
                      onChange={(e) => setTechStackInput(e.target.value)}
                      onKeyDown={handleKeyPress}
                      className="w-full"
                      required
                    />
                    <Button onClick={handleAddTechStack} disabled={!techStackInput.trim()}>
                      Add
                    </Button>
                    <div className="flex flex-wrap gap-2">
                      {projectData.techStack.map((tech) => (
                        <Badge
                          key={tech}
                          className="cursor-pointer"
                          onClick={() => handleRemoveTechStack(tech)}
                        >
                          {tech} <span className="ml-2 text-red-500">x</span>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <Input
                    placeholder="Challenges Faced (optional)"
                    value={projectData.challenges}
                    onChange={(e) => setProjectData({ ...projectData, challenges: e.target.value })}
                    className="w-full" 
                    
                  />
                  <Input
                    placeholder="GitHub URL (optional)"
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
                  <Select value={tone} onValueChange={setTone} className="w-full">
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
              {generatedCaption && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Generated Caption</h3>
                  <Textarea
                    value={generatedCaption.caption}
                    readOnly
                    className="w-full h-32 bg-gray-100"
                    onClick={() => copyToClipboard(generatedCaption.caption)}
                  />
                  <div className="mt-2 flex items-center space-x-2">  
                    <Badge className="cursor-pointer" onClick={() => copyToClipboard(generatedCaption.caption)}>
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Caption
                    </Badge>
                    <Badge className="cursor-pointer">
                      <Sparkles className="h-4 w-4 mr-1" />
                      {generatedCaption.tone.charAt(0).toUpperCase() + generatedCaption.tone.slice(1)}
                    </Badge>
                    {projectData.githubUrl && (
                      <Badge className="cursor-pointer" onClick={() => window.open(projectData.githubUrl, "_blank")}>
                        <Github className="h-4 w-4 mr-1" />
                        View on GitHub
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="examples">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Example Captions</h3>
                <Card>
                  <CardContent>
                    <p>
                      🚀 Excited to share my latest project: <strong>AI-Powered Chatbot</strong>!
                      This chatbot uses natural language processing to understand and respond to user queries effectively.
                      <br />
                      <span className="text-sm text-gray-500">#AI #Chatbot #NLP</span>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p>
                      🌟 Just launched my new web application: <strong>Task Manager Pro</strong>!
                      This app helps you organize your tasks efficiently with a sleek interface and powerful features.
                      <br />
                      <span className="text-sm text-gray-500">#WebDevelopment #TaskManager #Productivity</span>
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent>
                    <p>
                      🎉 Thrilled to announce my latest project: <strong>Portfolio Website</strong>!
                      This website showcases my skills, projects, and experiences in a visually appealing way.
                      <br />
                      <span className="text-sm text-gray-500">#Portfolio #WebDesign #FrontendDevelopment</span>
                    </p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="about">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">About This Tool</h3>
                <p>
                  This LinkedIn Caption Generator helps you create engaging captions for your LinkedIn posts about your projects.
                  Simply fill in the project details, select a tone, and generate a caption that highlights your work effectively.
                </p>
                <p>
                  The tool is designed to save you time and help you craft professional, casual, or enthusiastic captions that resonate with your audience.
                </p>
                <p>
                  <strong>Features:</strong>
                </p>
                <ul className="list-disc pl-5">
                  <li>Generate captions based on project details</li>
                  <li>Choose from various tones (professional, casual, enthusiastic, etc.)</li>
                  <li>Copy generated captions to clipboard</li>
                  <li>View examples of generated captions</li>
                  <li>Access project details and GitHub links</li>
                </ul>
              </div>
            </TabsContent>
            <TabsContent value="settings">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Settings</h3>
                <p>
                  Currently, there are no specific settings available. The tool is designed to be straightforward and easy to use.
                </p>
                <p> 
                  If you have any suggestions for features or improvements, feel free to reach out on GitHub!
                </p>
                <a href="/github" target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full">
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </Button>
                </a> 
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

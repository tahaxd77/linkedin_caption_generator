"use server";

const TONE_INSTRUCTIONS: Record<string, string> = {
  professional:
    "Write in a professional, business-appropriate tone. Use formal language and focus on achievements and technical skills.",
  casual:
    "Write in a casual, friendly tone. Use informal language and focus on the project's impact and user experience.",
  enthusiastic:
    "Write in an enthusiastic, passionate tone. Use strong language and focus on the project's impact and user experience.",
  inspirational:
    "Write in an inspirational, motivating tone. Use strong language and focus on the project's impact and user experience.",
  humorous:
    "Write in a humorous, light-hearted tone. Use playful language and focus on the project's impact and user experience.",
};

function parseGitHubUrl(url: string): { owner: string; repo: string } | null {
  try {
    const cleanUrl = url.trim().startsWith("http")
      ? url.trim()
      : `https://${url.trim()}`;
    const parsed = new URL(cleanUrl);
    if (!parsed.hostname.includes("github.com")) return null;

    const segments = parsed.pathname.split("/").filter(Boolean);
    if (segments.length < 2) return null;

    return {
      owner: segments[0],
      repo: segments[1].replace(/\.git$/, ""),
    };
  } catch {
    return null;
  }
}

export async function generateCaption(formData: FormData) {
  const githubUrl = formData.get("githubUrl") as string;
  const tone = (formData.get("tone") as string) || "professional";

  if (!githubUrl) {
    throw new Error("GitHub repository URL is required.");
  }

  const parsed = parseGitHubUrl(githubUrl);
  if (!parsed) {
    throw new Error("Invalid GitHub URL provided.");
  }
  const { owner, repo } = parsed;

  const githubHeaders: HeadersInit = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "NextJS-App",
    ...(process.env.GITHUB_TOKEN && {
      Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    }),
  };

  // 1. Fetch Repository details and README directly
  const [repoRes, readmeRes] = await Promise.all([
    fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: githubHeaders,
    }),
    fetch(`https://api.github.com/repos/${owner}/${repo}/readme`, {
      headers: githubHeaders,
    }),
  ]);

  if (!repoRes.ok) {
    if (repoRes.status === 404) {
      throw new Error(
        `Repository "${owner}/${repo}" was not found or is private.`,
      );
    }
    if (repoRes.status === 403) {
      throw new Error(
        "GitHub rate limit reached. Add a GITHUB_TOKEN to your .env.local.",
      );
    }
    throw new Error(`GitHub API error: status ${repoRes.status}`);
  }

  const repoData = await repoRes.json();

  let readmeText = "";
  if (readmeRes.ok) {
    const readmeData = await readmeRes.json();
    if (readmeData.content) {
      readmeText = Buffer.from(readmeData.content, "base64")
        .toString("utf-8")
        .slice(0, 3000);
    }
  }

  const projectText = `
Name: ${repoData.name}
Description: ${repoData.description || "No description provided"}
Language: ${repoData.language || "Not specified"}
Topics: ${(repoData.topics || []).join(", ") || "None"}
Stars: ${repoData.stargazers_count}
License: ${repoData.license?.name || "None"}
  `.trim();

  const toneInstruction =
    TONE_INSTRUCTIONS[tone] || TONE_INSTRUCTIONS.professional;

  const prompt = `You are a LinkedIn content expert. Create an engaging LinkedIn post caption for the following project.
GitHub URL: ${githubUrl}

Tone Instructions:
${toneInstruction}

Project Metadata:
${projectText}

${readmeText ? `README Excerpt:\n${readmeText}` : ""}

Requirements:
- Keep it under 300 words.
- Highlight key technical skills, tools, and the problem it solves.
- Include 3-5 relevant hashtags.
- Return ONLY the caption text, with no preamble or markdown code blocks.`;

  // 2. Call Gemini API directly
  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
  }

  const geminiRes = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${geminiApiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    },
  );

  if (!geminiRes.ok) {
    const err = await geminiRes.text();
    throw new Error(`Gemini API error: ${err}`);
  }

  const geminiData = await geminiRes.json();
  const caption =
    geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
    "No caption generated.";

  return { caption, tone };
}

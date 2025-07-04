import { NextRequest, NextResponse } from 'next/server';

function getToneInstruction(tone: string){
    switch(tone){
        case "professional":
            return "Write in a professional, business-appropriate tone. Use formal language and focus on achievements and technical skills.";
        case "casual":
            return "Write in a casual, friendly tone. Use informal language and focus on the project's impact and user experience.";
        case "enthusiastic":
            return "Write in an enthusiastic, passionate tone. Use strong language and focus on the project's impact and user experience.";
        case "inspirational":
            return "Write in an inspirational, motivating tone. Use strong language and focus on the project's impact and user experience.";
        case 'humorous':
            return "Write in a humorous, light-hearted tone. Use playful language and focus on the project's impact and user experience.";
        default:
            return "Write in a professional, business-appropriate tone. Use formal language and focus on achievements and technical skills.";
    }
}
export async function POST(req: NextRequest) {
  try {
    const { githubUrl, tone } = await req.json();
    if (!githubUrl || !tone) {
      return NextResponse.json({ error: 'Missing githubUrl or tone' }, { status: 400 });
    }

    // Extract owner and repo from the GitHub URL
    const match = githubUrl.match(/github.com\/(.+?)\/(.+?)(?:$|\/|\?)/);
    if (!match) {
      return NextResponse.json({ error: 'Invalid GitHub URL' }, { status: 400 });
    }
    const owner = match[1];
    const repo = match[2];

    // Fetch README from GitHub
    const repoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`);
    let projectText = '';
    if (repoRes.ok) {
        const repoData = await repoRes.json();
        projectText = `
        Name: ${repoData.name}
        Description: ${repoData.description || 'No description'}
        Topics: ${(repoData.topics || []).join(', ')}
        Stars: ${repoData.stargazers_count}
        Forks: ${repoData.forks_count}
        Watchers: ${repoData.watchers_count}
        License: ${repoData.license?.name || 'None'}
        Homepage: ${repoData.homepage || 'N/A'}
        Created at: ${repoData.created_at}
        Last updated: ${repoData.updated_at}
      `;
      }
    if (!projectText) {
      return NextResponse.json({ error: 'Could not fetch project details from GitHub.' }, { status: 404 });
    }
    const toneInstruction = getToneInstruction(tone);
    // Construct prompt for Gemini
    const prompt = `You are a LinkedIn content expert. Create an engaging LinkedIn post caption for the following project.

    ${toneInstruction}
    
    Project Information:
    ${projectText}
    
    Requirements:
    - Keep it under 300 words
    - Make it engaging and professional for LinkedIn
    - Include relevant hashtags (3-5)
    - Highlight key achievements and technical skills
    - Make it shareable and likely to get engagement
    - ${tone === "casual" ? "Include appropriate emojis" : "Use minimal emojis if any"}
    - Focus on the value and impact of the project
    
    Generate only the caption text, no additional formatting or explanations.
        `;

    // Call Gemini API
    const geminiApiKey = process.env.GEMINI_API_KEY;
    if (!geminiApiKey) {
      return NextResponse.json({ error: 'Gemini API key not set.' }, { status: 500 });
    }

    const geminiRes = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + geminiApiKey, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });
    console.log(geminiRes);
    if (!geminiRes.ok) {
      const error = await geminiRes.text();
      console.error('Gemini API error:', error);
      return NextResponse.json({ error: 'Gemini API error', details: error }, { status: 500 });
    }
    const geminiData = await geminiRes.json();
    const caption = geminiData.candidates?.[0]?.content?.parts?.[0]?.text || 'No caption generated.';

    return NextResponse.json({ caption });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error', details: String(error) }, { status: 500 });
  }
}

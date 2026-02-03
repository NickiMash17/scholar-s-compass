import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const systemPrompt = `You are an expert software engineering educator and learning scientist with 15+ years of experience designing adaptive curricula. Your specialty is creating personalized, time-efficient study plans that maximize retention and practical skill development.

Core Principles:
- Prioritize hands-on practice over passive reading (70/30 split)
- Use spaced repetition principles for concept reinforcement
- Include mini-projects that simulate real-world scenarios
- Provide clear success criteria for each task
- Assume learner has limited time but high motivation
- Scale difficulty progressively across 7 days
- Include debugging/troubleshooting practice

You must respond with valid JSON only, no markdown formatting or extra text.`;

interface DiagnosticData {
  topic: string;
  topicLabel: string;
  confidenceLevel: number;
  quizAnswer: string;
  goal: string;
  availableTime: number;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const { diagnosticData } = await req.json() as { diagnosticData: DiagnosticData };
    
    const { topic, topicLabel, confidenceLevel, quizAnswer, goal, availableTime } = diagnosticData;

    // Infer level from confidence and quiz performance
    const inferredLevel = confidenceLevel <= 2 ? "beginner" : confidenceLevel <= 4 ? "intermediate" : "advanced";

    const userPrompt = `Generate a 7-day intensive study plan for: ${topicLabel}

Student Profile:
- Current confidence: ${confidenceLevel}/5
- Diagnostic performance: ${quizAnswer === "correct" ? "Answered correctly" : "Needs improvement"}
- Primary goal: ${goal}
- Daily availability: ${availableTime} minutes
- Starting knowledge: ${inferredLevel}

Requirements:
1. Start with foundational review (Day 1-2)
2. Build to intermediate application (Day 3-5)
3. Culminate in integration project (Day 6-7)
4. Each day: 60% coding practice, 30% concept learning, 10% reflection
5. Include debugging scenarios
6. Provide 2-3 quality resources per day (official docs, select tutorials)
7. Final project must demonstrate mastery across 3+ concepts

Return JSON with this exact structure (no markdown, no code blocks, just raw JSON):
{
  "overview": "2-sentence plan summary",
  "targetLevel": "beginner|intermediate|advanced",
  "days": [
    {
      "day": 1,
      "focus": "Focus area title",
      "tasks": [
        {
          "id": "d1_t1",
          "description": "specific action item",
          "type": "coding|reading|quiz|project",
          "estimatedMinutes": 20,
          "resources": ["resource description or URL"]
        }
      ],
      "practiceChallenge": "specific coding challenge",
      "successCriteria": "what mastery looks like"
    }
  ],
  "weekProject": "comprehensive final project description"
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service credits exhausted. Please add credits to continue." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to generate study plan" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("No content in AI response");
    }

    // Clean up the response - remove markdown code blocks if present
    let cleanedContent = content.trim();
    if (cleanedContent.startsWith("```json")) {
      cleanedContent = cleanedContent.slice(7);
    }
    if (cleanedContent.startsWith("```")) {
      cleanedContent = cleanedContent.slice(3);
    }
    if (cleanedContent.endsWith("```")) {
      cleanedContent = cleanedContent.slice(0, -3);
    }
    cleanedContent = cleanedContent.trim();

    // Parse the JSON response
    const studyPlan = JSON.parse(cleanedContent);

    return new Response(JSON.stringify({ plan: studyPlan }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error generating study plan:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

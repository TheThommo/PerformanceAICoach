import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface CoachingResponse {
  message: string;
  suggestions: string[];
  redHeadIndicators?: string[];
  blueHeadTechniques?: string[];
  urgencyLevel: "low" | "medium" | "high";
}

export interface AssessmentAnalysis {
  overallState: "red_head" | "blue_head" | "transitional";
  strengths: string[];
  opportunities: string[];
  recommendedTechniques: string[];
  insights: string[];
  nextSteps: string[];
}

export async function getCoachingResponse(
  userMessage: string,
  conversationHistory: any[],
  userContext?: {
    latestAssessment?: any;
    recentProgress?: any[];
  }
): Promise<CoachingResponse> {
  try {
    const systemPrompt = `You are Flo, a Red2Blue mental performance coach for golfers. Your role is to help golfers shift from "Red Head" (stressed, reactive state) to "Blue Head" (calm, focused performance state) using proven methodology.

COMMUNICATION RULES:
- Use simple, everyday language (ELI5 level)
- No complex or unusual words; keep it conversational
- No em dashes (-) for sentence separation; use semicolons (;) if needed
- Avoid clichés like "game-changing", "cutting-edge", "essential"
- Avoid redundant phrases like "in today's world", "plays a significant role"
- Be direct and practical; no fluff
- Don't use multiple words when one will do

COMPREHENSIVE RED2BLUE KNOWLEDGE BASE:

CORE PHILOSOPHY:
Red Head State: Reactive, emotional, distracted mindset that impairs performance
- Characteristics: Overthinking, dwelling on mistakes, worrying about outcomes, physical tension, negative self-talk
- Triggers: Pressure situations, bad shots, course conditions, playing partners, expectations

Blue Head State: Calm, focused, present mindset that enhances performance  
- Characteristics: Present awareness, controlled breathing, positive self-talk, clear decisions, routine consistency
- Benefits: Better shot execution, emotional control, resilience, confidence

FUNDAMENTAL TECHNIQUES:

1. BOX BREATHING (Primary Reset Tool):
- Pattern: Inhale 4 counts → Hold 4 → Exhale 4 → Hold 4
- When to use: Before shots, between holes, during pressure moments
- Effect: Activates parasympathetic nervous system, instant calm
- Practice: 5 cycles minimum for effectiveness

2. PRE-SHOT ROUTINE (25-Second Structure):
- Physical Ritual (10s): Deep breath + balance check + club selection confidence
- Visualize Shot (6s): See ball flight, trajectory, landing with specific target
- Align & Commit (4s): Address ball, align to target, commit fully to shot
- Practice Swing (3s): One purposeful swing feeling the intended shot
- Execute (2s): Step up, settle, trust, fire

3. CONTROL CIRCLES TECHNIQUE:
Inner Circle (Complete Control): Breathing, attitude, effort, preparation, routine
Middle Circle (Influence): Strategy, course management, shot selection, practice quality
Outer Circle (No Control): Weather, course conditions, other players, results
RULE: Invest energy ONLY in Inner and Middle circles

4. 3-2-1 FOCUS RESET:
- 3 things you can see (specific details)
- 2 things you can hear (present sounds)  
- 1 thing you can feel (physical sensation)
- Purpose: Grounds attention in present moment, breaks negative thought loops

5. MENTAL SKILLS X-CHECK ASSESSMENT:
Intensity Management: Controlling arousal and energy levels
Decision Making: Clear, committed shot choices
Diversions Control: Managing distractions and staying focused  
Execution: Trusting technique and following through

SPECIFIC INTERVENTIONS:

Bad Shot Recovery:
- Immediate: Box breathing, acknowledge without judgment
- Process: "What can I learn?" vs "Why did I do that?"
- Refocus: Next shot routine, target selection
- Mantra: "This shot, right now"

Pre-Round Nerves:
- Physical: Progressive muscle relaxation, dynamic warm-up
- Mental: Visualization of successful shots and good feelings
- Process focus: Commit to routine and process goals
- Acceptance: Nervous energy is normal and useful

During Round Pressure:
- Slow down all movements and decisions
- Extra emphasis on breathing and routine
- Simplify shot selection and strategy
- Trust your practice and preparation

RED HEAD INTERVENTIONS:
Overthinking: "Stop, breathe, simplify" - Single swing thought maximum
Dwelling on Mistakes: "File it and move on" - Physical reset routine
Future Worry: "One shot at a time" - Present moment awareness
Physical Tension: Progressive muscle relaxation, breathing exercises

BLUE HEAD ENHANCEMENT:
Confidence Building: Recall past successes, positive visualization
Flow State: Challenge-skill balance, clear goals, focused attention
Resilience: Growth mindset, adversity as opportunity, long-term perspective

COACHING PRINCIPLES:
- Meet athletes where they are emotionally
- Provide immediate, actionable techniques
- Build confidence through small wins
- Focus on process over outcome
- Use confident, encouraging tone

Analyze messages for Red Head indicators and provide specific Blue Head solutions using this comprehensive methodology. Always provide practical next steps.

Respond in JSON format with:
{
  "message": "Your detailed coaching response using Red2Blue methodology",
  "suggestions": ["specific actionable techniques from knowledge base"],
  "redHeadIndicators": ["any red head signs detected in their message"],
  "blueHeadTechniques": ["recommended blue head techniques"],
  "urgencyLevel": "low|medium|high"
}`;

    const contextInfo = userContext ? `
User's latest assessment scores: ${JSON.stringify(userContext.latestAssessment)}
Recent progress: ${JSON.stringify(userContext.recentProgress)}
` : '';

    const conversationContext = conversationHistory.length > 0 ? 
      `Previous conversation: ${JSON.stringify(conversationHistory.slice(-5))}` : '';

    const fullPrompt = `${systemPrompt}

${contextInfo}
${conversationContext}

User message: "${userMessage}"

Please provide a coaching response in JSON format.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        message: parsed.message || "I understand you're facing a challenge. Let's work through this together with some practical Red2Blue techniques.",
        suggestions: parsed.suggestions || ["Practice box breathing (4-4-4-4)", "Use your pre-shot routine", "Focus on what you can control"],
        redHeadIndicators: parsed.redHeadIndicators || [],
        blueHeadTechniques: parsed.blueHeadTechniques || ["Box breathing", "Present moment awareness", "Control circles"],
        urgencyLevel: parsed.urgencyLevel || "medium"
      };
    }
    
    // Fallback if JSON parsing fails
    return {
      message: "I'm here to help you shift from Red Head to Blue Head. Let's work on some specific techniques based on what you're experiencing.",
      suggestions: ["Practice box breathing (4-4-4-4)", "Use your pre-shot routine consistently", "Focus on what you can control"],
      redHeadIndicators: [],
      blueHeadTechniques: ["Box breathing", "Present moment awareness", "Control circles"],
      urgencyLevel: "medium"
    };
    
  } catch (error) {
    console.error("Gemini coaching response error:", error);
    
    // Comprehensive fallback response based on Red2Blue methodology
    return {
      message: "I'm here to support your mental game development using the Red2Blue methodology. Our goal is shifting from reactive Red Head states to focused Blue Head states. The foundation is always breathing, routine, and focusing on what you can control. What specific situation on the course would you like to work on?",
      suggestions: [
        "Practice box breathing: 4 counts in, hold 4, out 4, hold 4",
        "Establish a consistent 25-second pre-shot routine",
        "Use Control Circles - focus only on what you can control"
      ],
      redHeadIndicators: [],
      blueHeadTechniques: [
        "Box breathing for instant calm",
        "Present moment awareness with 3-2-1 focus reset", 
        "Control circles technique",
        "Pre-shot routine consistency"
      ],
      urgencyLevel: "medium"
    };
  }
}

export async function analyzeAssessmentResults(
  intensityScore: number,
  decisionMakingScore: number,
  diversionsScore: number,
  executionScore: number,
  previousAssessments?: any[]
): Promise<AssessmentAnalysis> {
  try {
    const totalScore = intensityScore + decisionMakingScore + diversionsScore + executionScore;
    
    const prompt = `Analyze these Red2Blue mental skills assessment results for a golfer:

Intensity Management: ${intensityScore}/100
Decision Making: ${decisionMakingScore}/100
Focus & Diversions: ${diversionsScore}/100
Execution: ${executionScore}/100
Total: ${totalScore}/400

Previous assessments: ${JSON.stringify(previousAssessments || [])}

As Flo, the Red2Blue coach, provide analysis in JSON format with:
- overallState: "red_head", "blue_head", or "transitional"
- strengths: array of specific strengths identified
- opportunities: array of areas for improvement
- recommendedTechniques: array of specific techniques to practice
- insights: array of behavioral insights
- nextSteps: array of actionable next steps

Focus on practical, golf-specific insights and simple language.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return parsed;
    }
    
    // Fallback analysis
    return {
      overallState: totalScore >= 300 ? "blue_head" : totalScore >= 200 ? "transitional" : "red_head",
      strengths: ["Taking the assessment shows commitment to improvement"],
      opportunities: ["Focus on consistency", "Build mental resilience"],
      recommendedTechniques: ["Box breathing", "Pre-shot routine", "Control circles"],
      insights: ["Assessment provides baseline for improvement"],
      nextSteps: ["Practice breathing exercises daily", "Establish consistent routine"]
    };
    
  } catch (error) {
    console.error("Gemini assessment analysis error:", error);
    return {
      overallState: "transitional",
      strengths: ["Commitment to mental game improvement"],
      opportunities: ["Develop consistent mental strategies"],
      recommendedTechniques: ["Box breathing", "Pre-shot routine"],
      insights: ["Regular assessment helps track progress"],
      nextSteps: ["Focus on one technique at a time"]
    };
  }
}

export async function generateAIProfile(
  assessmentData: any,
  userGoals: string,
  golfExperience: string
): Promise<string> {
  try {
    const prompt = `Create a personalized Red2Blue mental performance profile for this golfer:

Assessment Results: ${JSON.stringify(assessmentData)}
Goals: ${userGoals}
Experience Level: ${golfExperience}

Provide a comprehensive but concise profile highlighting their mental game strengths, areas for development, and personalized Red2Blue techniques that would be most effective for them.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    return response.text() || "Your mental game profile shows dedication to improvement. Focus on consistent application of Red2Blue techniques.";
    
  } catch (error) {
    console.error("Gemini profile generation error:", error);
    return "Your mental performance profile shows commitment to developing your mental game. Focus on building consistent routines and managing pressure situations with Red2Blue techniques.";
  }
}

export async function generatePersonalizedPlan(
  userLevel: string,
  specificChallenges: string[],
  availableTime: string
): Promise<any> {
  try {
    const prompt = `Create a personalized Red2Blue training plan for:

Skill Level: ${userLevel}
Specific Challenges: ${specificChallenges.join(", ")}
Available Practice Time: ${availableTime}

Provide a structured plan with daily practices, weekly goals, and specific Red2Blue techniques to address their challenges. Format as JSON with daily_practices, weekly_goals, and monthly_milestones.`;

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    // Fallback plan
    return {
      daily_practices: ["5 minutes box breathing", "Pre-shot routine practice"],
      weekly_goals: ["Consistent routine execution", "Pressure situation practice"],
      monthly_milestones: ["Improved focus under pressure", "Consistent Red2Blue application"]
    };
    
  } catch (error) {
    console.error("Gemini plan generation error:", error);
    return {
      daily_practices: ["Box breathing practice", "Mental skills assessment"],
      weekly_goals: ["Routine consistency", "Emotional regulation"],
      monthly_milestones: ["Improved mental game", "Better performance under pressure"]
    };
  }
}
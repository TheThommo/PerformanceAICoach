import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAssessmentSchema, insertChatSessionSchema, insertUserProgressSchema } from "@shared/schema";
import { getCoachingResponse, analyzeAssessmentResults, generatePersonalizedPlan } from "./openai";

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Assessment routes
  app.post("/api/assessments", async (req, res) => {
    try {
      const data = insertAssessmentSchema.parse(req.body);
      const totalScore = data.intensityScore + data.decisionMakingScore + data.diversionsScore + data.executionScore;
      
      const assessment = await storage.createAssessment({
        ...data,
        totalScore
      });

      // Get AI analysis
      const previousAssessments = await storage.getUserAssessments(data.userId);
      const analysis = await analyzeAssessmentResults(
        data.intensityScore,
        data.decisionMakingScore,
        data.diversionsScore,
        data.executionScore,
        previousAssessments.slice(1, 4) // Last 3 previous assessments
      );

      res.json({ assessment, analysis });
    } catch (error) {
      res.status(400).json({ message: "Invalid assessment data", error: (error as Error).message });
    }
  });

  app.get("/api/assessments/latest/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assessment = await storage.getLatestAssessment(userId);
      
      if (!assessment) {
        return res.status(404).json({ message: "No assessments found" });
      }

      res.json(assessment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessment", error: (error as Error).message });
    }
  });

  app.get("/api/assessments/user/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assessments = await storage.getUserAssessments(userId);
      res.json(assessments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch assessments", error: (error as Error).message });
    }
  });

  // Chat routes
  app.post("/api/chat", async (req, res) => {
    try {
      const { userId, message, sessionId } = req.body;
      
      if (!userId || !message) {
        return res.status(400).json({ message: "User ID and message are required" });
      }

      let session;
      if (sessionId) {
        session = await storage.getChatSession(sessionId);
        if (!session) {
          return res.status(404).json({ message: "Chat session not found" });
        }
      } else {
        // Create new session
        session = await storage.createChatSession({
          userId,
          messages: []
        });
      }

      // Get user context for better coaching
      const latestAssessment = await storage.getLatestAssessment(userId);
      const recentProgress = await storage.getUserProgress(userId, 7);
      
      const userContext = {
        latestAssessment,
        recentProgress
      };

      // Get AI coaching response
      const coachingResponse = await getCoachingResponse(
        message,
        session.messages as any[],
        userContext
      );

      // Update session with new messages
      const updatedMessages = [
        ...(session.messages as any[]),
        { role: "user", content: message, timestamp: new Date() },
        { role: "assistant", content: coachingResponse.message, timestamp: new Date(), metadata: coachingResponse }
      ];

      const updatedSession = await storage.updateChatSession(session.id, updatedMessages);

      res.json({ 
        session: updatedSession,
        response: coachingResponse
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to process chat message", error: (error as Error).message });
    }
  });

  app.get("/api/chat/sessions/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sessions = await storage.getUserChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat sessions", error: (error as Error).message });
    }
  });

  // Progress routes
  app.post("/api/progress", async (req, res) => {
    try {
      const data = insertUserProgressSchema.parse(req.body);
      const progress = await storage.createUserProgress(data);
      res.json(progress);
    } catch (error) {
      res.status(400).json({ message: "Invalid progress data", error: (error as Error).message });
    }
  });

  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const days = parseInt(req.query.days as string) || 7;
      const progress = await storage.getUserProgress(userId, days);
      res.json(progress);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress", error: (error as Error).message });
    }
  });

  // Technique routes
  app.get("/api/techniques", async (req, res) => {
    try {
      const category = req.query.category as string;
      const techniques = category 
        ? await storage.getTechniquesByCategory(category)
        : await storage.getAllTechniques();
      res.json(techniques);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch techniques", error: (error as Error).message });
    }
  });

  // Scenario routes
  app.get("/api/scenarios", async (req, res) => {
    try {
      const pressureLevel = req.query.pressureLevel as string;
      const scenarios = pressureLevel
        ? await storage.getScenariosByPressureLevel(pressureLevel)
        : await storage.getAllScenarios();
      res.json(scenarios);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scenarios", error: (error as Error).message });
    }
  });

  // Personalized plan generation
  app.post("/api/generate-plan/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { goals } = req.body;

      const assessments = await storage.getUserAssessments(userId);
      const progress = await storage.getUserProgress(userId, 30);

      const plan = await generatePersonalizedPlan(assessments, progress, goals);
      
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate plan", error: (error as Error).message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

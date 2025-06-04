import type { Express } from "express";
import { createServer, type Server } from "http";
import session from "express-session";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertAssessmentSchema, insertChatSessionSchema, insertUserProgressSchema, insertPreShotRoutineSchema, insertMentalSkillsXCheckSchema, insertControlCircleSchema } from "@shared/schema";
import { getCoachingResponse, analyzeAssessmentResults, generatePersonalizedPlan } from "./openai";
import { sessionConfig, requireAuth, requirePremium, registerUser, loginUser, AuthRequest } from "./auth";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-05-28.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Session middleware
  app.use(session(sessionConfig));

  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const user = await registerUser(req.body);
      req.session.userId = user.id;
      
      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await loginUser(email, password);
      req.session.userId = user.id;
      
      res.json(user);
    } catch (error: any) {
      res.status(401).json({ message: error.message });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Could not log out" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  app.get("/api/auth/me", async (req: AuthRequest, res) => {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    try {
      const user = await storage.getUser(req.session.userId);
      if (!user) {
        return res.status(401).json({ message: "User not found" });
      }

      // Remove password from response
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Server error" });
    }
  });

  // Stripe one-time payment routes
  app.post("/api/payment/create", requireAuth, async (req: AuthRequest, res) => {
    try {
      const { tier } = req.body; // 'premium' or 'ultimate'
      const user = req.user;

      if (!user.email) {
        return res.status(400).json({ message: 'Email required for payment' });
      }

      // Create or retrieve Stripe customer
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
        });
        customerId = customer.id;
        
        // Update user with customer ID
        await storage.updateUser(user.id, { stripeCustomerId: customerId });
      }

      // Define pricing based on tier using your product IDs
      const productPricing = {
        premium: {
          productId: 'prod_SR3rZuRQG7JnqR',
          amount: 69000, // $690.00 in cents
          description: 'Premium Access - Lifetime',
        },
        ultimate: {
          productId: 'prod_SR3txKbR55uws2',
          amount: 159000, // $1590.00 in cents
          description: 'Ultimate Access - Lifetime',
        },
      };

      const pricing = productPricing[tier as keyof typeof productPricing];
      if (!pricing) {
        return res.status(400).json({ message: 'Invalid access tier' });
      }

      // Create checkout session for one-time payment
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product: pricing.productId,
              unit_amount: pricing.amount,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${req.headers.origin}/?payment=success&tier=${tier}`,
        cancel_url: `${req.headers.origin}/?payment=cancelled`,
        metadata: {
          userId: user.id.toString(),
          tier: tier,
        },
      });

      res.json({ sessionUrl: session.url });
    } catch (error: any) {
      console.error('Payment creation error:', error);
      res.status(500).json({ message: 'Failed to create payment session' });
    }
  });

  // Webhook for Stripe events
  app.post("/api/webhook/stripe", async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (err: any) {
      console.log(`Webhook signature verification failed.`, err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle payment events
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await handlePaymentSuccess(session);
        break;
    }

    res.json({ received: true });
  });

  async function handlePaymentSuccess(session: any) {
    // Get user ID and tier from session metadata
    const userId = parseInt(session.metadata.userId);
    const tier = session.metadata.tier;
    
    if (userId && tier) {
      await storage.updateUser(userId, {
        isSubscribed: true,
        subscriptionTier: tier,
        stripeCustomerId: session.customer,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: null, // Lifetime access
      });
    }
  }

  // Document download routes for Free tier
  app.get("/api/downloads/master-your-moment", (req, res) => {
    const filePath = "/home/runner/workspace/attached_assets/Master Your Moment by Cero Golf.pdf";
    res.download(filePath, "Master Your Moment by Cero Golf.pdf", (err) => {
      if (err) {
        res.status(404).json({ message: "File not found" });
      }
    });
  });

  app.get("/api/downloads/ability-to-focus", (req, res) => {
    const filePath = "/home/runner/workspace/attached_assets/Ability to Focus - Book.pdf";
    res.download(filePath, "Ability to Focus - Book.pdf", (err) => {
      if (err) {
        res.status(404).json({ message: "File not found" });
      }
    });
  });

  app.get("/api/downloads/mental-toughness", (req, res) => {
    const filePath = "/home/runner/workspace/attached_assets/Mental Toughness - Book.pdf";
    res.download(filePath, "Mental Toughness - Book.pdf", (err) => {
      if (err) {
        res.status(404).json({ message: "File not found" });
      }
    });
  });

  // Community leaderboard and check-in routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      // For now, return mock data with 15 test clients (12 Premium, 3 Ultimate)
      const mockLeaderboard = [
        { id: 101, username: "Tiger_Elite", points: 2850, streak: 45, tier: "ultimate", lastCheckIn: "2024-06-04", rank: 1 },
        { id: 102, username: "PGA_Champion", points: 2620, streak: 38, tier: "premium", lastCheckIn: "2024-06-04", rank: 2 },
        { id: 103, username: "MindsetMaster", points: 2480, streak: 42, tier: "ultimate", lastCheckIn: "2024-06-03", rank: 3 },
        { id: 104, username: "FocusFlow", points: 2350, streak: 35, tier: "premium", lastCheckIn: "2024-06-04", rank: 4 },
        { id: 105, username: "PressureProof", points: 2210, streak: 28, tier: "premium", lastCheckIn: "2024-06-04", rank: 5 },
        { id: 106, username: "ZoneWarrior", points: 2080, streak: 31, tier: "premium", lastCheckIn: "2024-06-03", rank: 6 },
        { id: 107, username: "ClutchPlayer", points: 1950, streak: 25, tier: "ultimate", lastCheckIn: "2024-06-04", rank: 7 },
        { id: 108, username: "MentalTough", points: 1820, streak: 22, tier: "premium", lastCheckIn: "2024-06-04", rank: 8 },
        { id: 109, username: "VisualizePro", points: 1690, streak: 19, tier: "premium", lastCheckIn: "2024-06-03", rank: 9 },
        { id: 110, username: "ConfidenceKing", points: 1560, streak: 16, tier: "premium", lastCheckIn: "2024-06-04", rank: 10 },
        { id: 111, username: "BreatheMaster", points: 1430, streak: 13, tier: "premium", lastCheckIn: "2024-06-04", rank: 11 },
        { id: 112, username: "FlowState", points: 1300, streak: 10, tier: "premium", lastCheckIn: "2024-06-03", rank: 12 },
        { id: 113, username: "WinnerMindset", points: 1170, streak: 7, tier: "premium", lastCheckIn: "2024-06-04", rank: 13 },
        { id: 114, username: "ChampionFocus", points: 1040, streak: 4, tier: "premium", lastCheckIn: "2024-06-04", rank: 14 },
        { id: 115, username: "ElitePerformer", points: 910, streak: 1, tier: "premium", lastCheckIn: "2024-06-04", rank: 15 }
      ];
      
      res.json(mockLeaderboard);
    } catch (error: any) {
      console.error('Leaderboard error:', error);
      res.status(500).json({ message: 'Failed to fetch leaderboard' });
    }
  });

  app.get("/api/check-in/today/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const today = new Date().toISOString().split('T')[0];
      
      // Mock response for today's check-in status
      const mockCheckIn = {
        completedToday: Math.random() > 0.7, // 30% chance already completed
        streakCount: Math.floor(Math.random() * 20) + 1,
        totalPoints: Math.floor(Math.random() * 1000) + 100
      };
      
      res.json(mockCheckIn);
    } catch (error: any) {
      console.error('Check-in status error:', error);
      res.status(500).json({ message: 'Failed to fetch check-in status' });
    }
  });

  app.post("/api/check-in", async (req, res) => {
    try {
      const { userId } = req.body;
      
      // Mock successful check-in
      const result = {
        success: true,
        pointsEarned: 10,
        newStreak: Math.floor(Math.random() * 20) + 2,
        totalPoints: Math.floor(Math.random() * 1000) + 110
      };
      
      res.json(result);
    } catch (error: any) {
      console.error('Check-in error:', error);
      res.status(500).json({ message: 'Failed to complete check-in' });
    }
  });

  app.get("/api/progress/techniques/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Mock technique progress data
      const mockProgress = [
        {
          id: 1,
          techniqueId: 1,
          techniqueName: "Box Breathing",
          category: "focus",
          practiceCount: 15,
          masteryLevel: "intermediate",
          totalTimeSpent: 75,
          lastPracticed: "2024-06-03",
          streakDays: 5
        },
        {
          id: 2,
          techniqueId: 2,
          techniqueName: "Visualization Training",
          category: "visualization",
          practiceCount: 8,
          masteryLevel: "beginner",
          totalTimeSpent: 40,
          lastPracticed: "2024-06-02",
          streakDays: 2
        },
        {
          id: 3,
          techniqueId: 3,
          techniqueName: "Pressure Response",
          category: "pressure",
          practiceCount: 22,
          masteryLevel: "advanced",
          totalTimeSpent: 110,
          lastPracticed: "2024-06-04",
          streakDays: 8
        }
      ];
      
      res.json(mockProgress);
    } catch (error: any) {
      console.error('Progress fetch error:', error);
      res.status(500).json({ message: 'Failed to fetch technique progress' });
    }
  });

  app.post("/api/progress/practice-session", async (req, res) => {
    try {
      const { userId, techniqueId, duration } = req.body;
      
      // Mock successful practice session
      const result = {
        success: true,
        sessionCompleted: true,
        timeAdded: duration,
        practiceCountIncremented: true,
        streakMaintained: true
      };
      
      res.json(result);
    } catch (error: any) {
      console.error('Practice session error:', error);
      res.status(500).json({ message: 'Failed to record practice session' });
    }
  });
  
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

  // Pre-shot routine routes
  app.post("/api/pre-shot-routines", async (req, res) => {
    try {
      const data = insertPreShotRoutineSchema.parse(req.body);
      const routine = await storage.createPreShotRoutine(data);
      res.status(201).json(routine);
    } catch (error) {
      res.status(400).json({ message: "Failed to create pre-shot routine", error: (error as Error).message });
    }
  });

  app.get("/api/pre-shot-routines/active/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const routine = await storage.getActivePreShotRoutine(userId);
      if (!routine) {
        return res.status(404).json({ message: "No active routine found" });
      }
      res.json(routine);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch active routine", error: (error as Error).message });
    }
  });

  app.get("/api/pre-shot-routines/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const routines = await storage.getUserPreShotRoutines(userId);
      res.json(routines);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user routines", error: (error as Error).message });
    }
  });

  // Mental Skills X-Check routes
  app.post("/api/mental-skills-xcheck", async (req, res) => {
    try {
      const data = insertMentalSkillsXCheckSchema.parse(req.body);
      const xcheck = await storage.createMentalSkillsXCheck(data);
      res.status(201).json(xcheck);
    } catch (error) {
      res.status(400).json({ message: "Failed to create mental skills x-check", error: (error as Error).message });
    }
  });

  app.get("/api/mental-skills-xcheck/latest/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const xcheck = await storage.getLatestMentalSkillsXCheck(userId);
      if (!xcheck) {
        return res.status(404).json({ message: "No x-check found" });
      }
      res.json(xcheck);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest x-check", error: (error as Error).message });
    }
  });

  app.get("/api/mental-skills-xcheck/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const xchecks = await storage.getUserMentalSkillsXChecks(userId);
      res.json(xchecks);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user x-checks", error: (error as Error).message });
    }
  });

  // Control Circles routes
  app.post("/api/control-circles", async (req, res) => {
    try {
      const data = insertControlCircleSchema.parse(req.body);
      const circle = await storage.createControlCircle(data);
      res.status(201).json(circle);
    } catch (error) {
      res.status(400).json({ message: "Failed to create control circle", error: (error as Error).message });
    }
  });

  app.get("/api/control-circles/latest/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const circle = await storage.getLatestControlCircle(userId);
      if (!circle) {
        return res.status(404).json({ message: "No control circle found" });
      }
      res.json(circle);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest control circle", error: (error as Error).message });
    }
  });

  app.get("/api/control-circles/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const circles = await storage.getUserControlCircles(userId);
      res.json(circles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user control circles", error: (error as Error).message });
    }
  });

  // Coach dashboard routes
  app.get("/api/coach/students", async (req, res) => {
    try {
      const allUsers = await storage.getAllUsers();
      const studentSummaries = await Promise.all(
        allUsers.map(async (user) => {
          const assessments = await storage.getUserAssessments(user.id);
          const latestAssessment = assessments[0];
          
          // Calculate risk level based on latest scores
          let riskLevel = 'low';
          if (latestAssessment) {
            const avgScore = (latestAssessment.intensityScore + latestAssessment.decisionMakingScore + 
                           latestAssessment.diversionsScore + latestAssessment.executionScore) / 4;
            if (avgScore < 60) riskLevel = 'high';
            else if (avgScore < 75) riskLevel = 'medium';
          }

          // Calculate trend direction
          let trends = { direction: 'stable', change: 0 };
          if (assessments.length >= 2) {
            const recent = assessments[0].totalScore;
            const previous = assessments[1].totalScore;
            const change = recent - previous;
            trends = {
              direction: change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable',
              change
            };
          }

          return {
            id: user.id,
            username: user.username,
            email: user.email,
            lastAssessment: latestAssessment,
            assessmentCount: assessments.length,
            lastActivity: latestAssessment?.createdAt || user.createdAt,
            riskLevel,
            trends
          };
        })
      );

      res.json(studentSummaries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students", error: (error as Error).message });
    }
  });

  app.get("/api/coach/student-detail/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const assessments = await storage.getUserAssessments(userId);
      const progress = await storage.getUserProgress(userId, 30);
      const xchecks = await storage.getUserMentalSkillsXChecks(userId);
      const circles = await storage.getUserControlCircles(userId);
      const routines = await storage.getUserPreShotRoutines(userId);

      // Format assessment history for chart
      const assessmentHistory = assessments.slice(0, 10).reverse().map(a => ({
        date: a.createdAt ? new Date(a.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        totalScore: a.totalScore,
        intensity: a.intensityScore,
        decisionMaking: a.decisionMakingScore,
        diversions: a.diversionsScore,
        execution: a.executionScore
      }));

      // Tool usage summary
      const toolUsage = [
        { name: "Mental Skills X-Check", lastUsed: xchecks[0]?.createdAt ? new Date(xchecks[0].createdAt).toLocaleDateString() : "Never" },
        { name: "Control Circles", lastUsed: circles[0]?.createdAt ? new Date(circles[0].createdAt).toLocaleDateString() : "Never" },
        { name: "Pre-Shot Routine", lastUsed: routines[0]?.createdAt ? new Date(routines[0].createdAt).toLocaleDateString() : "Never" }
      ];

      // Generate coaching recommendations based on latest assessment
      const recommendations = [];
      if (assessments[0]) {
        const latest = assessments[0];
        if (latest.intensityScore < 70) recommendations.push("Focus on intensity management techniques - practice breathing exercises");
        if (latest.decisionMakingScore < 70) recommendations.push("Work on decision-making clarity - use visualization drills");
        if (latest.diversionsScore < 70) recommendations.push("Improve focus and attention - practice mindfulness meditation");
        if (latest.executionScore < 70) recommendations.push("Build execution confidence - work on pre-shot routine consistency");
      }

      res.json({
        assessmentHistory,
        toolUsage,
        recommendations: recommendations.length > 0 ? recommendations : ["Continue current training program - performance is strong"]
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student details", error: (error as Error).message });
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

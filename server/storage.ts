import { 
  users, assessments, chatSessions, userProgress, techniques, scenarios,
  preShotRoutines, mentalSkillsXChecks, controlCircles, userCoachingProfiles,
  aiRecommendations, coachingInsights, userEngagementMetrics, dailyMoods,
  type User, type InsertUser, type Assessment, type InsertAssessment,
  type ChatSession, type InsertChatSession, type UserProgress, type InsertUserProgress,
  type Technique, type InsertTechnique, type Scenario, type InsertScenario,
  type PreShotRoutine, type InsertPreShotRoutine, type MentalSkillsXCheck, 
  type InsertMentalSkillsXCheck, type ControlCircle, type InsertControlCircle,
  type UserCoachingProfile, type InsertUserCoachingProfile, type AiRecommendation,
  type InsertAiRecommendation, type CoachingInsight, type InsertCoachingInsight,
  type UserEngagementMetric, type InsertUserEngagementMetric, type DailyMood,
  type InsertDailyMood, type UserGoal, type InsertUserGoal, userGoals
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, updates: Partial<User>): Promise<User>;
  getAllUsers(): Promise<User[]>;

  // Assessment operations
  createAssessment(assessment: InsertAssessment): Promise<Assessment>;
  getLatestAssessment(userId: number): Promise<Assessment | undefined>;
  getUserAssessments(userId: number): Promise<Assessment[]>;

  // Chat operations
  createChatSession(session: InsertChatSession): Promise<ChatSession>;
  getChatSession(id: number): Promise<ChatSession | undefined>;
  getUserChatSessions(userId: number): Promise<ChatSession[]>;
  updateChatSession(id: number, messages: any[]): Promise<ChatSession>;

  // Progress operations
  createUserProgress(progress: InsertUserProgress): Promise<UserProgress>;
  getUserProgress(userId: number, days?: number): Promise<UserProgress[]>;

  // Technique operations
  getAllTechniques(): Promise<Technique[]>;
  getTechniquesByCategory(category: string): Promise<Technique[]>;
  createTechnique(technique: InsertTechnique): Promise<Technique>;

  // Scenario operations
  getAllScenarios(): Promise<Scenario[]>;
  getScenariosByPressureLevel(level: string): Promise<Scenario[]>;
  createScenario(scenario: InsertScenario): Promise<Scenario>;

  // Pre-shot routine operations
  createPreShotRoutine(routine: InsertPreShotRoutine): Promise<PreShotRoutine>;
  getUserPreShotRoutines(userId: number): Promise<PreShotRoutine[]>;
  getActivePreShotRoutine(userId: number): Promise<PreShotRoutine | undefined>;
  updatePreShotRoutine(id: number, routine: Partial<PreShotRoutine>): Promise<PreShotRoutine>;

  // Mental Skills X-Check operations
  createMentalSkillsXCheck(xcheck: InsertMentalSkillsXCheck): Promise<MentalSkillsXCheck>;
  getUserMentalSkillsXChecks(userId: number): Promise<MentalSkillsXCheck[]>;
  getLatestMentalSkillsXCheck(userId: number): Promise<MentalSkillsXCheck | undefined>;

  // Control Circle operations
  createControlCircle(circle: InsertControlCircle): Promise<ControlCircle>;
  getUserControlCircles(userId: number): Promise<ControlCircle[]>;
  getLatestControlCircle(userId: number): Promise<ControlCircle | undefined>;

  // Daily Mood operations
  createDailyMood(mood: InsertDailyMood): Promise<DailyMood>;
  getDailyMood(userId: number, date: string): Promise<DailyMood | undefined>;
  updateDailyMood(id: number, updates: Partial<DailyMood>): Promise<DailyMood>;
  getUserMoods(userId: number, days?: number): Promise<DailyMood[]>;

  // AI Recommendation Engine operations
  createUserCoachingProfile(profile: InsertUserCoachingProfile): Promise<UserCoachingProfile>;
  getUserCoachingProfile(userId: number): Promise<UserCoachingProfile | undefined>;
  updateUserCoachingProfile(userId: number, updates: Partial<UserCoachingProfile>): Promise<UserCoachingProfile>;
  
  createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation>;
  getUserRecommendations(userId: number, isActive?: boolean): Promise<AiRecommendation[]>;
  updateRecommendationFeedback(id: number, feedback: number, comments?: string): Promise<AiRecommendation>;
  markRecommendationApplied(id: number, effectivenessMeasure?: number): Promise<AiRecommendation>;
  
  createCoachingInsight(insight: InsertCoachingInsight): Promise<CoachingInsight>;
  getUserInsights(userId: number, isAcknowledged?: boolean): Promise<CoachingInsight[]>;
  acknowledgeInsight(id: number): Promise<CoachingInsight>;
  
  createEngagementMetric(metric: InsertUserEngagementMetric): Promise<UserEngagementMetric>;
  getUserEngagementMetrics(userId: number, days?: number): Promise<UserEngagementMetric[]>;
  updateEngagementMetric(userId: number, date: string, updates: Partial<UserEngagementMetric>): Promise<UserEngagementMetric>;
  
  // Goal tracking operations
  createUserGoal(goal: InsertUserGoal): Promise<UserGoal>;
  getUserGoals(userId: number): Promise<UserGoal[]>;
  updateUserGoal(id: number, updates: Partial<UserGoal>): Promise<UserGoal>;
  toggleGoalCompletion(id: number, isCompleted: boolean): Promise<UserGoal>;
  deleteUserGoal(id: number): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private chatSessions: Map<number, ChatSession>;
  private userProgress: Map<number, UserProgress>;
  private techniques: Map<number, Technique>;
  private scenarios: Map<number, Scenario>;
  private preShotRoutines: Map<number, PreShotRoutine>;
  private mentalSkillsXChecks: Map<number, MentalSkillsXCheck>;
  private controlCircles: Map<number, ControlCircle>;
  private userCoachingProfiles: Map<number, UserCoachingProfile>;
  private aiRecommendations: Map<number, AiRecommendation>;
  private coachingInsights: Map<number, CoachingInsight>;
  private userEngagementMetrics: Map<number, UserEngagementMetric>;
  private dailyMoods: Map<number, DailyMood>;
  private userGoals: Map<number, UserGoal>;
  private currentId: number;

  private initialized = false;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.chatSessions = new Map();
    this.userProgress = new Map();
    this.techniques = new Map();
    this.scenarios = new Map();
    this.preShotRoutines = new Map();
    this.mentalSkillsXChecks = new Map();
    this.controlCircles = new Map();
    this.userCoachingProfiles = new Map();
    this.aiRecommendations = new Map();
    this.coachingInsights = new Map();
    this.userEngagementMetrics = new Map();
    this.dailyMoods = new Map();
    this.userGoals = new Map();
    this.currentId = 1;
    this.seedData().catch(console.error);
  }

  private async ensureInitialized() {
    if (!this.initialized) {
      await this.seedData();
    }
  }

  private async seedData() {
    if (this.initialized) return;
    
    try {
      // Seed admin user
      const { hashPassword } = await import('./auth');
      const adminPassword = await hashPassword('mindsetskills101');
      
      const adminUser: User = {
        id: 1,
        username: 'mark',
        email: 'mark@cero-international.com',
        password: adminPassword,
        dateOfBirth: new Date('1980-01-01'),
        dexterity: 'right',
        gender: 'male',
        golfHandicap: 5,
        golfExperience: 'expert',
        goals: 'Help golfers achieve peak mental performance through Red2Blue methodology',
        bio: 'System Administrator and Golf Mental Performance Expert',
        aiGeneratedProfile: null,
        profileImageUrl: null,
        isSubscribed: true,
        subscriptionTier: 'ultimate',
        role: 'admin',
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.users.set(1, adminUser);
      
      // Add test users for coach dashboard demonstration
      const testUser1Password = await hashPassword('password123');
      const testUser1: User = {
        id: 2,
        username: 'test1',
        email: 'test1@example.com',
        password: testUser1Password,
        dateOfBirth: new Date('1990-05-15'),
        dexterity: 'right',
        gender: 'male',
        golfHandicap: 12,
        golfExperience: 'intermediate',
        goals: 'Improve mental toughness and reduce course anxiety',
        bio: 'Aspiring golfer working on mental game',
        aiGeneratedProfile: null,
        profileImageUrl: null,
        isSubscribed: true,
        subscriptionTier: 'premium',
        role: 'student',
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const floPassword = await hashPassword('password123');
      const floUser: User = {
        id: 3,
        username: 'flo',
        email: 'flo@example.com',
        password: floPassword,
        dateOfBirth: new Date('1985-03-20'),
        dexterity: 'left',
        gender: 'male',
        golfHandicap: 8,
        golfExperience: 'advanced',
        goals: 'Achieve single-digit handicap and improve tournament performance',
        bio: 'Advanced golfer focusing on competitive mental performance',
        aiGeneratedProfile: null,
        profileImageUrl: null,
        isSubscribed: true,
        subscriptionTier: 'ultimate',
        role: 'student',
        stripeCustomerId: null,
        stripeSubscriptionId: null,
        subscriptionStartDate: new Date(),
        subscriptionEndDate: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      this.users.set(2, testUser1);
      this.users.set(3, floUser);
      this.currentId = 4;

    // Seed default techniques
    const defaultTechniques: InsertTechnique[] = [
      {
        name: "Box Breathing",
        category: "breathing",
        description: "4-4-4-4 breathing pattern to instantly calm your nervous system",
        instructions: "Breathe in for 4 counts, hold for 4, breathe out for 4, hold for 4. Repeat 3-5 times.",
        duration: 60,
        difficulty: "beginner"
      },
      {
        name: "3-2-1 Focus Reset",
        category: "focus",
        description: "Quick technique to regain concentration after distractions",
        instructions: "Notice 3 things you can see, 2 things you can hear, 1 thing you can feel. Then refocus on your target.",
        duration: 30,
        difficulty: "beginner"
      },
      {
        name: "Pressure Valve",
        category: "pressure",
        description: "Release tension and embrace the challenge in high-stakes moments",
        instructions: "Take a deep breath, roll your shoulders, and say 'I embrace this challenge' before your shot.",
        duration: 15,
        difficulty: "intermediate"
      },
      {
        name: "Performance Anchor",
        category: "anchor",
        description: "Create a physical trigger to access your best mental state",
        instructions: "Choose a physical gesture (tap glove, touch ball). Practice it during good shots to create a confidence anchor.",
        duration: 0,
        difficulty: "advanced"
      }
    ];

    defaultTechniques.forEach(technique => {
      const id = this.currentId++;
      this.techniques.set(id, { ...technique, id, duration: technique.duration || null });
    });

    // Seed default scenarios
    const defaultScenarios: InsertScenario[] = [
      {
        title: "Final Hole Lead Protection",
        description: "You're leading by one stroke on the 18th tee. Your heart is racing and you're thinking about winning.",
        pressureLevel: "high",
        category: "tournament",
        redHeadTriggers: ["thinking about outcome", "heart racing", "fear of losing lead"],
        blueHeadTechniques: ["box breathing", "process focus", "one shot at a time"]
      },
      {
        title: "Recovery Shot After Mistake",
        description: "You just hit into the water. Anger and frustration are building as you prepare for your penalty shot.",
        pressureLevel: "medium",
        category: "recovery",
        redHeadTriggers: ["anger", "frustration", "dwelling on mistake"],
        blueHeadTechniques: ["pressure valve", "reset routine", "forward focus"]
      },
      {
        title: "Difficult Putt to Make Cut",
        description: "You need this 6-footer to make the tournament cut. Miss it and your weekend is over.",
        pressureLevel: "high",
        category: "putting",
        redHeadTriggers: ["outcome pressure", "career implications", "technical overthinking"],
        blueHeadTechniques: ["3-2-1 reset", "routine trust", "performance anchor"]
      }
    ];

    defaultScenarios.forEach(scenario => {
      const id = this.currentId++;
      this.scenarios.set(id, { 
        ...scenario, 
        id,
        redHeadTriggers: scenario.redHeadTriggers || null,
        blueHeadTechniques: scenario.blueHeadTechniques || null
      });
    });

    // Seed default pre-shot routines
    const defaultRoutine: InsertPreShotRoutine = {
      userId: 1, // Demo user
      name: "Red2Blue 25-Second Routine",
      steps: [
        { name: "Ritual Physical Action", duration: 10, description: "Deep breath (4 in, 6 out) + feet movement for balance" },
        { name: "Visualize the Shot", duration: 6, description: "Picture trajectory, speed, spin with keyword 'Smooth'" },
        { name: "Align and Commit", duration: 4, description: "Approach ball, align to target, commit fully" },
        { name: "Practice Swing", duration: 3, description: "One purposeful swing with intended feel and tempo" },
        { name: "Execute", duration: 5, description: "Step up, settle, execute with complete trust" }
      ],
      totalDuration: 28,
      isActive: true
    };

    const routineId = this.currentId++;
    this.preShotRoutines.set(routineId, { 
      ...defaultRoutine, 
      id: routineId, 
      isActive: defaultRoutine.isActive || false,
      createdAt: new Date() 
    });

    // Add sample assessments for test users
    const testAssessment1: Assessment = {
      id: this.currentId++,
      userId: 2, // test1 user
      intensityScore: 65,
      decisionMakingScore: 72,
      diversionsScore: 58,
      executionScore: 68,
      totalScore: 66,
      responses: {
        intensity: ["3", "4", "3", "3", "4"],
        decisionMaking: ["4", "3", "4", "4", "3"],
        diversions: ["2", "3", "3", "3", "3"],
        execution: ["3", "4", "3", "4", "3"]
      },
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
    };

    const testAssessment2: Assessment = {
      id: this.currentId++,
      userId: 3, // thethommo user
      intensityScore: 82,
      decisionMakingScore: 78,
      diversionsScore: 85,
      executionScore: 80,
      totalScore: 81,
      responses: {
        intensity: ["4", "4", "4", "5", "4"],
        decisionMaking: ["4", "4", "3", "4", "4"],
        diversions: ["4", "5", "4", "4", "4"],
        execution: ["4", "4", "4", "4", "4"]
      },
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
    };

    this.assessments.set(testAssessment1.id, testAssessment1);
    this.assessments.set(testAssessment2.id, testAssessment2);
    
    this.initialized = true;
    console.log('Storage initialized with admin user:', this.users.get(1)?.email);
    } catch (error) {
      console.error('Failed to seed data:', error);
    }
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    await this.ensureInitialized();
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const existingUser = this.users.get(id);
    if (!existingUser) {
      throw new Error('User not found');
    }
    const updatedUser = { ...existingUser, ...updates };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
      email: insertUser.email || null,
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const id = this.currentId++;
    const assessment: Assessment = {
      ...insertAssessment,
      id,
      createdAt: new Date()
    };
    this.assessments.set(id, assessment);
    return assessment;
  }

  async getLatestAssessment(userId: number): Promise<Assessment | undefined> {
    const userAssessments = Array.from(this.assessments.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
    return userAssessments[0];
  }

  async getUserAssessments(userId: number): Promise<Assessment[]> {
    return Array.from(this.assessments.values())
      .filter(a => a.userId === userId)
      .sort((a, b) => (b.createdAt?.getTime() || 0) - (a.createdAt?.getTime() || 0));
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const id = this.currentId++;
    const session: ChatSession = {
      ...insertSession,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.chatSessions.set(id, session);
    return session;
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    return this.chatSessions.get(id);
  }

  async getUserChatSessions(userId: number): Promise<ChatSession[]> {
    return Array.from(this.chatSessions.values())
      .filter(s => s.userId === userId)
      .sort((a, b) => (b.updatedAt?.getTime() || 0) - (a.updatedAt?.getTime() || 0));
  }

  async updateChatSession(id: number, messages: any[]): Promise<ChatSession> {
    const session = this.chatSessions.get(id);
    if (!session) {
      throw new Error("Chat session not found");
    }
    const updated = { ...session, messages, updatedAt: new Date() };
    this.chatSessions.set(id, updated);
    return updated;
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const id = this.currentId++;
    const progress: UserProgress = { 
      ...insertProgress, 
      id,
      techniquesUsed: insertProgress.techniquesUsed || null
    };
    this.userProgress.set(id, progress);
    return progress;
  }

  async getUserProgress(userId: number, days: number = 7): Promise<UserProgress[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.userProgress.values())
      .filter(p => p.userId === userId && p.date >= cutoffDate)
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async getAllTechniques(): Promise<Technique[]> {
    return Array.from(this.techniques.values());
  }

  async getTechniquesByCategory(category: string): Promise<Technique[]> {
    return Array.from(this.techniques.values()).filter(t => t.category === category);
  }

  async createTechnique(insertTechnique: InsertTechnique): Promise<Technique> {
    const id = this.currentId++;
    const technique: Technique = { 
      ...insertTechnique, 
      id,
      duration: insertTechnique.duration || null
    };
    this.techniques.set(id, technique);
    return technique;
  }

  async getAllScenarios(): Promise<Scenario[]> {
    return Array.from(this.scenarios.values());
  }

  async getScenariosByPressureLevel(level: string): Promise<Scenario[]> {
    return Array.from(this.scenarios.values()).filter(s => s.pressureLevel === level);
  }

  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const id = this.currentId++;
    const scenario: Scenario = { 
      ...insertScenario, 
      id,
      redHeadTriggers: insertScenario.redHeadTriggers || null,
      blueHeadTechniques: insertScenario.blueHeadTechniques || null
    };
    this.scenarios.set(id, scenario);
    return scenario;
  }

  // Pre-shot routine operations
  async createPreShotRoutine(insertRoutine: InsertPreShotRoutine): Promise<PreShotRoutine> {
    const id = this.currentId++;
    const routine: PreShotRoutine = { 
      ...insertRoutine, 
      id,
      isActive: insertRoutine.isActive || false,
      createdAt: new Date()
    };
    this.preShotRoutines.set(id, routine);
    return routine;
  }

  async getUserPreShotRoutines(userId: number): Promise<PreShotRoutine[]> {
    return Array.from(this.preShotRoutines.values()).filter(routine => routine.userId === userId);
  }

  async getActivePreShotRoutine(userId: number): Promise<PreShotRoutine | undefined> {
    return Array.from(this.preShotRoutines.values()).find(routine => 
      routine.userId === userId && routine.isActive
    );
  }

  async getPreShotRoutineById(id: number): Promise<PreShotRoutine | undefined> {
    return this.preShotRoutines.get(id);
  }

  async updatePreShotRoutine(id: number, updates: Partial<PreShotRoutine>): Promise<PreShotRoutine> {
    const existing = this.preShotRoutines.get(id);
    if (!existing) throw new Error("Pre-shot routine not found");
    
    const updated: PreShotRoutine = { ...existing, ...updates };
    this.preShotRoutines.set(id, updated);
    return updated;
  }

  async deletePreShotRoutine(id: number): Promise<void> {
    if (!this.preShotRoutines.has(id)) {
      throw new Error("Pre-shot routine not found");
    }
    this.preShotRoutines.delete(id);
  }

  // Mental Skills X-Check operations
  async createMentalSkillsXCheck(insertXCheck: InsertMentalSkillsXCheck): Promise<MentalSkillsXCheck> {
    const id = this.currentId++;
    const xcheck: MentalSkillsXCheck = { 
      ...insertXCheck, 
      id,
      whatDidWell: insertXCheck.whatDidWell || null,
      whatCouldDoBetter: insertXCheck.whatCouldDoBetter || null,
      actionPlan: insertXCheck.actionPlan || null,
      context: insertXCheck.context || null,
      createdAt: new Date()
    };
    this.mentalSkillsXChecks.set(id, xcheck);
    return xcheck;
  }

  async getUserMentalSkillsXChecks(userId: number): Promise<MentalSkillsXCheck[]> {
    return Array.from(this.mentalSkillsXChecks.values())
      .filter(xcheck => xcheck.userId === userId)
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
  }

  async getLatestMentalSkillsXCheck(userId: number): Promise<MentalSkillsXCheck | undefined> {
    const checks = await this.getUserMentalSkillsXChecks(userId);
    return checks[0];
  }

  // Control Circle operations
  async createControlCircle(insertCircle: InsertControlCircle): Promise<ControlCircle> {
    const id = this.currentId++;
    const circle: ControlCircle = { 
      ...insertCircle, 
      id,
      context: insertCircle.context || null,
      reflections: insertCircle.reflections || null,
      cantControl: insertCircle.cantControl || null,
      canInfluence: insertCircle.canInfluence || null,
      canControl: insertCircle.canControl || null,
      createdAt: new Date()
    };
    this.controlCircles.set(id, circle);
    return circle;
  }

  async getUserControlCircles(userId: number): Promise<ControlCircle[]> {
    return Array.from(this.controlCircles.values())
      .filter(circle => circle.userId === userId)
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
  }

  async getLatestControlCircle(userId: number): Promise<ControlCircle | undefined> {
    const circles = await this.getUserControlCircles(userId);
    return circles[0];
  }

  // Daily Mood operations
  async createDailyMood(insertMood: InsertDailyMood): Promise<DailyMood> {
    const id = this.currentId++;
    const mood: DailyMood = { 
      ...insertMood, 
      id,
      createdAt: new Date()
    };
    this.dailyMoods.set(id, mood);
    return mood;
  }

  async getDailyMood(userId: number, date: string): Promise<DailyMood | undefined> {
    return Array.from(this.dailyMoods.values())
      .find(mood => mood.userId === userId && mood.date === date);
  }

  async updateDailyMood(id: number, updates: Partial<DailyMood>): Promise<DailyMood> {
    const existing = this.dailyMoods.get(id);
    if (!existing) {
      throw new Error('Daily mood not found');
    }
    const updated: DailyMood = { ...existing, ...updates };
    this.dailyMoods.set(id, updated);
    return updated;
  }

  async getUserMoods(userId: number, days: number = 30): Promise<DailyMood[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.dailyMoods.values())
      .filter(mood => mood.userId === userId && new Date(mood.date) >= cutoffDate)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // AI Recommendation Engine implementation
  async createUserCoachingProfile(insertProfile: InsertUserCoachingProfile): Promise<UserCoachingProfile> {
    await this.ensureInitialized();
    const id = this.currentId++;
    const profile: UserCoachingProfile = { 
      id,
      ...insertProfile,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userCoachingProfiles.set(id, profile);
    return profile;
  }

  async getUserCoachingProfile(userId: number): Promise<UserCoachingProfile | undefined> {
    await this.ensureInitialized();
    return Array.from(this.userCoachingProfiles.values())
      .find(profile => profile.userId === userId);
  }

  async updateUserCoachingProfile(userId: number, updates: Partial<UserCoachingProfile>): Promise<UserCoachingProfile> {
    await this.ensureInitialized();
    const existing = await this.getUserCoachingProfile(userId);
    if (!existing) {
      throw new Error('User coaching profile not found');
    }
    const updated: UserCoachingProfile = { 
      ...existing, 
      ...updates, 
      updatedAt: new Date() 
    };
    this.userCoachingProfiles.set(existing.id, updated);
    return updated;
  }

  async createAiRecommendation(insertRecommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    await this.ensureInitialized();
    const id = this.currentId++;
    const recommendation: AiRecommendation = { 
      id,
      ...insertRecommendation,
      createdAt: new Date()
    };
    this.aiRecommendations.set(id, recommendation);
    return recommendation;
  }

  async getUserRecommendations(userId: number, isActive?: boolean): Promise<AiRecommendation[]> {
    await this.ensureInitialized();
    return Array.from(this.aiRecommendations.values())
      .filter(rec => {
        if (rec.userId !== userId) return false;
        if (isActive !== undefined && rec.isActive !== isActive) return false;
        return true;
      })
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
  }

  async updateRecommendationFeedback(id: number, feedback: number, comments?: string): Promise<AiRecommendation> {
    await this.ensureInitialized();
    const existing = this.aiRecommendations.get(id);
    if (!existing) {
      throw new Error('Recommendation not found');
    }
    const updated: AiRecommendation = { 
      ...existing, 
      userFeedback: feedback,
      feedbackComments: comments || existing.feedbackComments
    };
    this.aiRecommendations.set(id, updated);
    return updated;
  }

  async markRecommendationApplied(id: number, effectivenessMeasure?: number): Promise<AiRecommendation> {
    await this.ensureInitialized();
    const existing = this.aiRecommendations.get(id);
    if (!existing) {
      throw new Error('Recommendation not found');
    }
    const updated: AiRecommendation = { 
      ...existing, 
      wasApplied: true,
      effectivenessMeasure: effectivenessMeasure || existing.effectivenessMeasure
    };
    this.aiRecommendations.set(id, updated);
    return updated;
  }

  async createCoachingInsight(insertInsight: InsertCoachingInsight): Promise<CoachingInsight> {
    await this.ensureInitialized();
    const id = this.currentId++;
    const insight: CoachingInsight = { 
      id,
      ...insertInsight,
      createdAt: new Date()
    };
    this.coachingInsights.set(id, insight);
    return insight;
  }

  async getUserInsights(userId: number, isAcknowledged?: boolean): Promise<CoachingInsight[]> {
    await this.ensureInitialized();
    return Array.from(this.coachingInsights.values())
      .filter(insight => {
        if (insight.userId !== userId) return false;
        if (isAcknowledged !== undefined && insight.isAcknowledged !== isAcknowledged) return false;
        return true;
      })
      .sort((a, b) => {
        const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bDate - aDate;
      });
  }

  async acknowledgeInsight(id: number): Promise<CoachingInsight> {
    await this.ensureInitialized();
    const existing = this.coachingInsights.get(id);
    if (!existing) {
      throw new Error('Insight not found');
    }
    const updated: CoachingInsight = { 
      ...existing, 
      isAcknowledged: true
    };
    this.coachingInsights.set(id, updated);
    return updated;
  }

  async createEngagementMetric(insertMetric: InsertUserEngagementMetric): Promise<UserEngagementMetric> {
    await this.ensureInitialized();
    const id = this.currentId++;
    const metric: UserEngagementMetric = { 
      id,
      ...insertMetric,
      createdAt: new Date()
    };
    this.userEngagementMetrics.set(id, metric);
    return metric;
  }

  async getUserEngagementMetrics(userId: number, days: number = 30): Promise<UserEngagementMetric[]> {
    await this.ensureInitialized();
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return Array.from(this.userEngagementMetrics.values())
      .filter(metric => {
        if (metric.userId !== userId) return false;
        const metricDate = new Date(metric.date);
        return metricDate >= cutoffDate;
      })
      .sort((a, b) => {
        const aDate = new Date(a.date).getTime();
        const bDate = new Date(b.date).getTime();
        return bDate - aDate;
      });
  }

  async updateEngagementMetric(userId: number, date: string, updates: Partial<UserEngagementMetric>): Promise<UserEngagementMetric> {
    await this.ensureInitialized();
    const existing = Array.from(this.userEngagementMetrics.values())
      .find(metric => metric.userId === userId && metric.date === date);
    
    if (existing) {
      const updated: UserEngagementMetric = { ...existing, ...updates };
      this.userEngagementMetrics.set(existing.id, updated);
      return updated;
    } else {
      return await this.createEngagementMetric({
        userId,
        date,
        ...updates
      } as InsertUserEngagementMetric);
    }
  }

  // Goal tracking operations
  async createUserGoal(insertGoal: InsertUserGoal): Promise<UserGoal> {
    await this.ensureInitialized();
    const id = this.currentId++;
    const goal: UserGoal = {
      id,
      ...insertGoal,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.userGoals.set(id, goal);
    return goal;
  }

  async getUserGoals(userId: number): Promise<UserGoal[]> {
    await this.ensureInitialized();
    return Array.from(this.userGoals.values())
      .filter(goal => goal.userId === userId)
      .sort((a, b) => {
        // Sort by completion status (incomplete first), then by priority (high to low), then by created date (newest first)
        if (a.isCompleted !== b.isCompleted) {
          return a.isCompleted ? 1 : -1;
        }
        if (a.priority !== b.priority) {
          return (b.priority || 0) - (a.priority || 0);
        }
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      });
  }

  async updateUserGoal(id: number, updates: Partial<UserGoal>): Promise<UserGoal> {
    await this.ensureInitialized();
    const existing = this.userGoals.get(id);
    if (!existing) {
      throw new Error('Goal not found');
    }
    
    const updated: UserGoal = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.userGoals.set(id, updated);
    return updated;
  }

  async toggleGoalCompletion(id: number, isCompleted: boolean): Promise<UserGoal> {
    await this.ensureInitialized();
    const existing = this.userGoals.get(id);
    if (!existing) {
      throw new Error('Goal not found');
    }
    
    const updated: UserGoal = {
      ...existing,
      isCompleted,
      completedAt: isCompleted ? new Date() : null,
      updatedAt: new Date()
    };
    this.userGoals.set(id, updated);
    return updated;
  }

  async deleteUserGoal(id: number): Promise<void> {
    await this.ensureInitialized();
    this.userGoals.delete(id);
  }
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async updateUser(id: number, updates: Partial<User>): Promise<User> {
    const [user] = await db
      .update(users)
      .set(updates)
      .where(eq(users.id, id))
      .returning();
    return user;
  }

  async createAssessment(insertAssessment: InsertAssessment): Promise<Assessment> {
    const [assessment] = await db
      .insert(assessments)
      .values(insertAssessment)
      .returning();
    return assessment;
  }

  async getLatestAssessment(userId: number): Promise<Assessment | undefined> {
    const [assessment] = await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt))
      .limit(1);
    return assessment || undefined;
  }

  async getUserAssessments(userId: number): Promise<Assessment[]> {
    return await db
      .select()
      .from(assessments)
      .where(eq(assessments.userId, userId))
      .orderBy(desc(assessments.createdAt));
  }

  async createChatSession(insertSession: InsertChatSession): Promise<ChatSession> {
    const [session] = await db
      .insert(chatSessions)
      .values(insertSession)
      .returning();
    return session;
  }

  async getChatSession(id: number): Promise<ChatSession | undefined> {
    const [session] = await db.select().from(chatSessions).where(eq(chatSessions.id, id));
    return session || undefined;
  }

  async getUserChatSessions(userId: number): Promise<ChatSession[]> {
    return await db
      .select()
      .from(chatSessions)
      .where(eq(chatSessions.userId, userId))
      .orderBy(desc(chatSessions.createdAt));
  }

  async updateChatSession(id: number, messages: any[]): Promise<ChatSession> {
    const [session] = await db
      .update(chatSessions)
      .set({ messages })
      .where(eq(chatSessions.id, id))
      .returning();
    return session;
  }

  async createUserProgress(insertProgress: InsertUserProgress): Promise<UserProgress> {
    const [progress] = await db
      .insert(userProgress)
      .values(insertProgress)
      .returning();
    return progress;
  }

  async getUserProgress(userId: number, days: number = 7): Promise<UserProgress[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return await db
      .select()
      .from(userProgress)
      .where(eq(userProgress.userId, userId))
      .orderBy(desc(userProgress.date));
  }

  async getAllTechniques(): Promise<Technique[]> {
    return await db.select().from(techniques);
  }

  async getTechniquesByCategory(category: string): Promise<Technique[]> {
    return await db
      .select()
      .from(techniques)
      .where(eq(techniques.category, category));
  }

  async createTechnique(insertTechnique: InsertTechnique): Promise<Technique> {
    const [technique] = await db
      .insert(techniques)
      .values(insertTechnique)
      .returning();
    return technique;
  }

  async getAllScenarios(): Promise<Scenario[]> {
    return await db.select().from(scenarios);
  }

  async getScenariosByPressureLevel(level: string): Promise<Scenario[]> {
    return await db
      .select()
      .from(scenarios)
      .where(eq(scenarios.pressureLevel, level));
  }

  async createScenario(insertScenario: InsertScenario): Promise<Scenario> {
    const [scenario] = await db
      .insert(scenarios)
      .values(insertScenario)
      .returning();
    return scenario;
  }

  async createPreShotRoutine(insertRoutine: InsertPreShotRoutine): Promise<PreShotRoutine> {
    const [routine] = await db
      .insert(preShotRoutines)
      .values(insertRoutine)
      .returning();
    return routine;
  }

  async getUserPreShotRoutines(userId: number): Promise<PreShotRoutine[]> {
    return await db
      .select()
      .from(preShotRoutines)
      .where(eq(preShotRoutines.userId, userId))
      .orderBy(desc(preShotRoutines.createdAt));
  }

  async getActivePreShotRoutine(userId: number): Promise<PreShotRoutine | undefined> {
    const [routine] = await db
      .select()
      .from(preShotRoutines)
      .where(eq(preShotRoutines.userId, userId))
      .orderBy(desc(preShotRoutines.createdAt))
      .limit(1);
    return routine || undefined;
  }

  async updatePreShotRoutine(id: number, updates: Partial<PreShotRoutine>): Promise<PreShotRoutine> {
    const [routine] = await db
      .update(preShotRoutines)
      .set(updates)
      .where(eq(preShotRoutines.id, id))
      .returning();
    return routine;
  }

  async createMentalSkillsXCheck(insertXCheck: InsertMentalSkillsXCheck): Promise<MentalSkillsXCheck> {
    const [xcheck] = await db
      .insert(mentalSkillsXChecks)
      .values(insertXCheck)
      .returning();
    return xcheck;
  }

  async getUserMentalSkillsXChecks(userId: number): Promise<MentalSkillsXCheck[]> {
    return await db
      .select()
      .from(mentalSkillsXChecks)
      .where(eq(mentalSkillsXChecks.userId, userId))
      .orderBy(desc(mentalSkillsXChecks.createdAt));
  }

  async getLatestMentalSkillsXCheck(userId: number): Promise<MentalSkillsXCheck | undefined> {
    const [xcheck] = await db
      .select()
      .from(mentalSkillsXChecks)
      .where(eq(mentalSkillsXChecks.userId, userId))
      .orderBy(desc(mentalSkillsXChecks.createdAt))
      .limit(1);
    return xcheck || undefined;
  }

  async createControlCircle(insertCircle: InsertControlCircle): Promise<ControlCircle> {
    const [circle] = await db
      .insert(controlCircles)
      .values(insertCircle)
      .returning();
    return circle;
  }

  async getUserControlCircles(userId: number): Promise<ControlCircle[]> {
    return await db
      .select()
      .from(controlCircles)
      .where(eq(controlCircles.userId, userId))
      .orderBy(desc(controlCircles.createdAt));
  }

  async getLatestControlCircle(userId: number): Promise<ControlCircle | undefined> {
    const [circle] = await db
      .select()
      .from(controlCircles)
      .where(eq(controlCircles.userId, userId))
      .orderBy(desc(controlCircles.createdAt))
      .limit(1);
    return circle || undefined;
  }

  // Daily Mood operations
  async createDailyMood(insertMood: InsertDailyMood): Promise<DailyMood> {
    const [mood] = await db
      .insert(dailyMoods)
      .values(insertMood)
      .returning();
    return mood;
  }

  async getDailyMood(userId: number, date: string): Promise<DailyMood | undefined> {
    const [mood] = await db
      .select()
      .from(dailyMoods)
      .where(eq(dailyMoods.userId, userId) && eq(dailyMoods.date, date))
      .limit(1);
    return mood || undefined;
  }

  async updateDailyMood(id: number, updates: Partial<DailyMood>): Promise<DailyMood> {
    const [mood] = await db
      .update(dailyMoods)
      .set(updates)
      .where(eq(dailyMoods.id, id))
      .returning();
    return mood;
  }

  async getUserMoods(userId: number, days: number = 30): Promise<DailyMood[]> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);
    
    return await db
      .select()
      .from(dailyMoods)
      .where(eq(dailyMoods.userId, userId))
      .orderBy(desc(dailyMoods.date));
  }

  // Placeholder methods for missing interface requirements
  async createUserCoachingProfile(profile: InsertUserCoachingProfile): Promise<UserCoachingProfile> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async getUserCoachingProfile(userId: number): Promise<UserCoachingProfile | undefined> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async updateUserCoachingProfile(userId: number, updates: Partial<UserCoachingProfile>): Promise<UserCoachingProfile> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async createAiRecommendation(recommendation: InsertAiRecommendation): Promise<AiRecommendation> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async getUserRecommendations(userId: number, isActive?: boolean): Promise<AiRecommendation[]> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async updateRecommendationFeedback(id: number, feedback: number, comments?: string): Promise<AiRecommendation> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async markRecommendationApplied(id: number, effectivenessMeasure?: number): Promise<AiRecommendation> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async createCoachingInsight(insight: InsertCoachingInsight): Promise<CoachingInsight> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async getUserInsights(userId: number, isAcknowledged?: boolean): Promise<CoachingInsight[]> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async acknowledgeInsight(id: number): Promise<CoachingInsight> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async createEngagementMetric(metric: InsertUserEngagementMetric): Promise<UserEngagementMetric> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async getUserEngagementMetrics(userId: number, days?: number): Promise<UserEngagementMetric[]> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  async updateEngagementMetric(userId: number, date: string, updates: Partial<UserEngagementMetric>): Promise<UserEngagementMetric> {
    throw new Error('Method not implemented in DatabaseStorage');
  }

  // Goal tracking operations
  async createUserGoal(insertGoal: InsertUserGoal): Promise<UserGoal> {
    const [goal] = await db
      .insert(userGoals)
      .values(insertGoal)
      .returning();
    return goal;
  }

  async getUserGoals(userId: number): Promise<UserGoal[]> {
    const goals = await db
      .select()
      .from(userGoals)
      .where(eq(userGoals.userId, userId))
      .orderBy(desc(userGoals.createdAt));
    return goals;
  }

  async updateUserGoal(id: number, updates: Partial<UserGoal>): Promise<UserGoal> {
    const [goal] = await db
      .update(userGoals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(userGoals.id, id))
      .returning();
    if (!goal) {
      throw new Error('Goal not found');
    }
    return goal;
  }

  async toggleGoalCompletion(id: number, isCompleted: boolean): Promise<UserGoal> {
    const [goal] = await db
      .update(userGoals)
      .set({ 
        isCompleted, 
        completedAt: isCompleted ? new Date() : null,
        updatedAt: new Date()
      })
      .where(eq(userGoals.id, id))
      .returning();
    if (!goal) {
      throw new Error('Goal not found');
    }
    return goal;
  }

  async deleteUserGoal(id: number): Promise<void> {
    await db.delete(userGoals).where(eq(userGoals.id, id));
  }
}

export const storage = new MemStorage();

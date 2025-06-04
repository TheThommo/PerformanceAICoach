import { 
  users, assessments, chatSessions, userProgress, techniques, scenarios,
  preShotRoutines, mentalSkillsXChecks, controlCircles,
  type User, type InsertUser, type Assessment, type InsertAssessment,
  type ChatSession, type InsertChatSession, type UserProgress, type InsertUserProgress,
  type Technique, type InsertTechnique, type Scenario, type InsertScenario,
  type PreShotRoutine, type InsertPreShotRoutine, type MentalSkillsXCheck, 
  type InsertMentalSkillsXCheck, type ControlCircle, type InsertControlCircle
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
  private currentId: number;

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
    this.currentId = 1;
    this.seedData().catch(console.error);
  }

  private async seedData() {
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
    this.currentId = 2;

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
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
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

  async updatePreShotRoutine(id: number, updates: Partial<PreShotRoutine>): Promise<PreShotRoutine> {
    const existing = this.preShotRoutines.get(id);
    if (!existing) throw new Error("Pre-shot routine not found");
    
    const updated: PreShotRoutine = { ...existing, ...updates };
    this.preShotRoutines.set(id, updated);
    return updated;
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
}

export const storage = new DatabaseStorage();

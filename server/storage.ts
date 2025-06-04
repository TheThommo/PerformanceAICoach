import { 
  users, assessments, chatSessions, userProgress, techniques, scenarios,
  type User, type InsertUser, type Assessment, type InsertAssessment,
  type ChatSession, type InsertChatSession, type UserProgress, type InsertUserProgress,
  type Technique, type InsertTechnique, type Scenario, type InsertScenario
} from "@shared/schema";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: Map<number, Assessment>;
  private chatSessions: Map<number, ChatSession>;
  private userProgress: Map<number, UserProgress>;
  private techniques: Map<number, Technique>;
  private scenarios: Map<number, Scenario>;
  private currentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = new Map();
    this.chatSessions = new Map();
    this.userProgress = new Map();
    this.techniques = new Map();
    this.scenarios = new Map();
    this.currentId = 1;
    this.seedData();
  }

  private seedData() {
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
      this.techniques.set(id, { ...technique, id });
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
      this.scenarios.set(id, { ...scenario, id });
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { 
      ...insertUser, 
      id, 
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
    const progress: UserProgress = { ...insertProgress, id };
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
    const technique: Technique = { ...insertTechnique, id };
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
    const scenario: Scenario = { ...insertScenario, id };
    this.scenarios.set(id, scenario);
    return scenario;
  }
}

export const storage = new MemStorage();

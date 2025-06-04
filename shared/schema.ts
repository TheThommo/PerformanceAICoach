import { pgTable, text, serial, integer, boolean, timestamp, jsonb, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  dateOfBirth: timestamp("date_of_birth"),
  dexterity: text("dexterity"), // "left" or "right"
  gender: text("gender"), // "male" or "female"
  golfHandicap: integer("golf_handicap"),
  bio: text("bio"),
  aiGeneratedProfile: text("ai_generated_profile"),
  profileImageUrl: text("profile_image_url"),
  isSubscribed: boolean("is_subscribed").default(false),
  subscriptionTier: text("subscription_tier").default("free"), // "free", "premium", "ultimate"
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  subscriptionStartDate: timestamp("subscription_start_date"),
  subscriptionEndDate: timestamp("subscription_end_date"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const assessments = pgTable("assessments", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  intensityScore: integer("intensity_score").notNull(), // 0-100
  decisionMakingScore: integer("decision_making_score").notNull(), // 0-100
  diversionsScore: integer("diversions_score").notNull(), // 0-100
  executionScore: integer("execution_score").notNull(), // 0-100
  totalScore: integer("total_score").notNull(), // sum of all scores
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatSessions = pgTable("chat_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  messages: jsonb("messages").notNull(), // array of {role, content, timestamp}
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const userProgress = pgTable("user_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: timestamp("date").notNull(),
  overallScore: integer("overall_score").notNull(),
  redHeadInstances: integer("red_head_instances").notNull(),
  blueHeadInstances: integer("blue_head_instances").notNull(),
  techniquesUsed: text("techniques_used").array(),
});

export const techniques = pgTable("techniques", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // breathing, focus, pressure, anchor
  description: text("description").notNull(),
  instructions: text("instructions").notNull(),
  duration: integer("duration"), // in seconds
  difficulty: text("difficulty").notNull(), // beginner, intermediate, advanced
});

export const scenarios = pgTable("scenarios", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  pressureLevel: text("pressure_level").notNull(), // low, medium, high
  category: text("category").notNull(), // golf-specific categories
  redHeadTriggers: text("red_head_triggers").array(),
  blueHeadTechniques: text("blue_head_techniques").array(),
});

export const preShotRoutines = pgTable("pre_shot_routines", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  name: text("name").notNull(),
  steps: jsonb("steps").notNull(), // array of routine steps with timings
  totalDuration: integer("total_duration").notNull(), // in seconds
  isActive: boolean("is_active").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const mentalSkillsXChecks = pgTable("mental_skills_x_checks", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  intensityScores: jsonb("intensity_scores").notNull(), // array of 3 scores 0-100
  decisionMakingScores: jsonb("decision_making_scores").notNull(), // array of 3 scores 0-100
  diversionsScores: jsonb("diversions_scores").notNull(), // array of 3 scores 0-100
  executionScores: jsonb("execution_scores").notNull(), // array of 3 scores 0-100
  whatDidWell: text("what_did_well"),
  whatCouldDoBetter: text("what_could_do_better"),
  actionPlan: text("action_plan"),
  context: text("context"), // round, tournament, practice, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const controlCircles = pgTable("control_circles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  cantControl: text("cant_control").array(),
  canInfluence: text("can_influence").array(),
  canControl: text("can_control").array(),
  reflections: text("reflections"),
  context: text("context"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Daily check-ins and leaderboard
export const dailyCheckIns = pgTable("daily_check_ins", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: date("date").notNull(),
  completed: boolean("completed").default(false),
  points: integer("points").default(10),
  streakCount: integer("streak_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Progress tracking for techniques
export const techniqueProgress = pgTable("technique_progress", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  techniqueId: integer("technique_id").notNull(),
  practiceCount: integer("practice_count").default(0),
  masteryLevel: text("mastery_level").$type<"beginner" | "intermediate" | "advanced" | "expert">().default("beginner"),
  lastPracticed: timestamp("last_practiced").defaultNow(),
  totalTimeSpent: integer("total_time_spent").default(0), // in minutes
  createdAt: timestamp("created_at").defaultNow(),
});

// Calendar reminders
export const calendarReminders = pgTable("calendar_reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  provider: text("provider").$type<"outlook" | "google" | "icloud">().notNull(),
  reminderTime: text("reminder_time").notNull(), // HH:MM format
  timezone: text("timezone").default("UTC"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertAssessmentSchema = createInsertSchema(assessments).omit({
  id: true,
  createdAt: true,
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertUserProgressSchema = createInsertSchema(userProgress).omit({
  id: true,
});

export const insertTechniqueSchema = createInsertSchema(techniques).omit({
  id: true,
});

export const insertScenarioSchema = createInsertSchema(scenarios).omit({
  id: true,
});

export const insertPreShotRoutineSchema = createInsertSchema(preShotRoutines).omit({
  id: true,
  createdAt: true,
});

export const insertMentalSkillsXCheckSchema = createInsertSchema(mentalSkillsXChecks).omit({
  id: true,
  createdAt: true,
});

export const insertControlCircleSchema = createInsertSchema(controlCircles).omit({
  id: true,
  createdAt: true,
});

export const insertDailyCheckInSchema = createInsertSchema(dailyCheckIns).omit({
  id: true,
  createdAt: true,
});

export const insertTechniqueProgressSchema = createInsertSchema(techniqueProgress).omit({
  id: true,
  createdAt: true,
});

export const insertCalendarReminderSchema = createInsertSchema(calendarReminders).omit({
  id: true,
  createdAt: true,
});

export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = z.infer<typeof insertAssessmentSchema>;
export type ChatSession = typeof chatSessions.$inferSelect;
export type InsertChatSession = z.infer<typeof insertChatSessionSchema>;
export type UserProgress = typeof userProgress.$inferSelect;
export type InsertUserProgress = z.infer<typeof insertUserProgressSchema>;
export type Technique = typeof techniques.$inferSelect;
export type InsertTechnique = z.infer<typeof insertTechniqueSchema>;
export type Scenario = typeof scenarios.$inferSelect;
export type InsertScenario = z.infer<typeof insertScenarioSchema>;
export type PreShotRoutine = typeof preShotRoutines.$inferSelect;
export type InsertPreShotRoutine = z.infer<typeof insertPreShotRoutineSchema>;
export type MentalSkillsXCheck = typeof mentalSkillsXChecks.$inferSelect;
export type InsertMentalSkillsXCheck = z.infer<typeof insertMentalSkillsXCheckSchema>;
export type ControlCircle = typeof controlCircles.$inferSelect;
export type InsertControlCircle = z.infer<typeof insertControlCircleSchema>;
export type DailyCheckIn = typeof dailyCheckIns.$inferSelect;
export type InsertDailyCheckIn = z.infer<typeof insertDailyCheckInSchema>;
export type TechniqueProgress = typeof techniqueProgress.$inferSelect;
export type InsertTechniqueProgress = z.infer<typeof insertTechniqueProgressSchema>;
export type CalendarReminder = typeof calendarReminders.$inferSelect;
export type InsertCalendarReminder = z.infer<typeof insertCalendarReminderSchema>;

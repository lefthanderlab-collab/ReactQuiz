import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const videos = pgTable("videos", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  vimeoUrl: text("vimeo_url").notNull(),
  category: text("category").notNull(),
  thumbnailUrl: text("thumbnail_url"),
  isFeatured: text("is_featured").notNull().default("false"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  message: text("message").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  profileName: text("profile_name").notNull().default("oneglass"),
  profileTitle: text("profile_title").notNull().default("Film Director & Video Creator"),
  profileDescription: text("profile_description").notNull().default("창의적인 영상으로 스토리를 전달합니다. 브랜드의 본질을 담은 영상 콘텐츠를 통해 감동과 메시지를 전달하는 비디오 디자이너입니다."),
  contactTitle: text("contact_title").notNull().default("연락하기"),
  contactDescription: text("contact_description").notNull().default("프로젝트 문의나 협업 제안이 있으시면 언제든지 연락주세요. 창의적인 영상 제작을 통해 브랜드의 스토리를 함께 만들어가겠습니다."),
  contactEmail: text("contact_email").notNull().default("oneglass@example.com"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVideoSchema = createInsertSchema(videos).omit({
  id: true,
  createdAt: true,
});

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
  createdAt: true,
});

export const insertSiteSettingsSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});

export type InsertVideo = z.infer<typeof insertVideoSchema>;
export type Video = typeof videos.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertSiteSettings = z.infer<typeof insertSiteSettingsSchema>;
export type SiteSettings = typeof siteSettings.$inferSelect;

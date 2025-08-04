import { videos, contacts, siteSettings, type Video, type InsertVideo, type Contact, type InsertContact, type SiteSettings, type InsertSiteSettings } from "@shared/schema";
import { db } from "./db";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Video operations
  getAllVideos(): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideo(id: string, video: InsertVideo): Promise<Video | undefined>;
  deleteVideo(id: string): Promise<boolean>;
  
  // Contact operations
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Site settings operations
  getSiteSettings(): Promise<SiteSettings>;
  updateSiteSettings(settings: InsertSiteSettings): Promise<SiteSettings>;
}

export class DatabaseStorage implements IStorage {
  async getAllVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(videos.createdAt);
  }

  async getVideo(id: string): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video || undefined;
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [newVideo] = await db
      .insert(videos)
      .values(insertVideo)
      .returning();
    return newVideo;
  }

  async updateVideo(id: string, insertVideo: InsertVideo): Promise<Video | undefined> {
    const [updatedVideo] = await db
      .update(videos)
      .set(insertVideo)
      .where(eq(videos.id, id))
      .returning();
    return updatedVideo || undefined;
  }

  async deleteVideo(id: string): Promise<boolean> {
    const result = await db.delete(videos).where(eq(videos.id, id));
    return (result.rowCount ?? 0) > 0;
  }

  async getAllContacts(): Promise<Contact[]> {
    return await db.select().from(contacts).orderBy(contacts.createdAt);
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [newContact] = await db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return newContact;
  }

  async getSiteSettings(): Promise<SiteSettings> {
    const [settings] = await db.select().from(siteSettings).limit(1);
    if (!settings) {
      // Create default settings if none exist
      const [newSettings] = await db
        .insert(siteSettings)
        .values({})
        .returning();
      return newSettings;
    }
    return settings;
  }

  async updateSiteSettings(insertSettings: InsertSiteSettings): Promise<SiteSettings> {
    // Get the first (and should be only) settings record
    const [existingSettings] = await db.select().from(siteSettings).limit(1);
    
    if (!existingSettings) {
      // Create new settings if none exist
      const [newSettings] = await db
        .insert(siteSettings)
        .values(insertSettings)
        .returning();
      return newSettings;
    } else {
      // Update existing settings
      const [updatedSettings] = await db
        .update(siteSettings)
        .set({ ...insertSettings, updatedAt: new Date() })
        .where(eq(siteSettings.id, existingSettings.id))
        .returning();
      return updatedSettings;
    }
  }
}

export const storage = new DatabaseStorage();

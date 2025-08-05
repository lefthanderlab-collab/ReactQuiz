import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import fs from "fs";
import { storage } from "./storage";
import { insertContactSchema, insertVideoSchema, insertSiteSettingsSchema } from "@shared/schema";
import { z } from "zod";

// Configure multer for thumbnail uploads
const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = 'uploads/thumbnails';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'thumbnail-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve static thumbnail files
  app.use('/uploads', express.static('uploads'));

  // Upload thumbnail endpoint
  app.post('/api/upload-thumbnail', upload.single('thumbnail'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }
      
      const thumbnailUrl = `/uploads/thumbnails/${req.file.filename}`;
      res.json({ thumbnailUrl });
    } catch (error) {
      console.error('Thumbnail upload error:', error);
      res.status(500).json({ error: 'Failed to upload thumbnail' });
    }
  });

  // Get all videos
  app.get("/api/videos", async (req, res) => {
    try {
      const videos = await storage.getAllVideos();
      res.json(videos);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch videos" });
    }
  });

  // Get single video
  app.get("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const video = await storage.getVideo(id);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch video" });
    }
  });

  // Submit contact form
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.status(201).json(contact);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid contact data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to submit contact form" });
    }
  });

  // Get all contacts (for admin purposes)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contacts" });
    }
  });

  // Create a new video
  app.post("/api/videos", async (req, res) => {
    try {
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.createVideo(validatedData);
      res.status(201).json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid video data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create video" });
    }
  });

  // Update a video
  app.put("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertVideoSchema.parse(req.body);
      const video = await storage.updateVideo(id, validatedData);
      
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.json(video);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid video data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update video" });
    }
  });

  // Delete a video
  app.delete("/api/videos/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteVideo(id);
      
      if (!success) {
        return res.status(404).json({ message: "Video not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete video" });
    }
  });

  // Get site settings
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  // Update site settings
  app.put("/api/site-settings", async (req, res) => {
    try {
      const validatedData = insertSiteSettingsSchema.parse(req.body);
      const settings = await storage.updateSiteSettings(validatedData);
      res.json(settings);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid settings data", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to update site settings" });
    }
  });

  // Toggle video featured status
  app.patch("/api/videos/:id/featured", async (req, res) => {
    try {
      const { id } = req.params;
      const { isFeatured } = req.body;
      
      const video = await storage.getVideo(id);
      if (!video) {
        return res.status(404).json({ message: "Video not found" });
      }

      const updatedVideo = await storage.updateVideo(id, {
        ...video,
        isFeatured: isFeatured ? "true" : "false"
      });
      
      res.json(updatedVideo);
    } catch (error) {
      res.status(500).json({ message: "Failed to update video featured status" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

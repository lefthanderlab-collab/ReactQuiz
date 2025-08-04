import { type Video, type InsertVideo, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Video operations
  getAllVideos(): Promise<Video[]>;
  getVideo(id: string): Promise<Video | undefined>;
  createVideo(video: InsertVideo): Promise<Video>;
  
  // Contact operations
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private videos: Map<string, Video>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.videos = new Map();
    this.contacts = new Map();
    
    // Initialize with sample videos
    this.initializeSampleData();
  }

  private async initializeSampleData() {
    const sampleVideos: InsertVideo[] = [
      {
        title: "Brand Identity Animation",
        description: "기업 브랜드 아이덴티티를 위한 모션 그래픽 프로젝트",
        vimeoUrl: "https://player.vimeo.com/video/76979871",
        category: "Motion Graphics"
      },
      {
        title: "Product Launch Video",
        description: "신제품 런칭을 위한 프로모션 영상 제작",
        vimeoUrl: "https://player.vimeo.com/video/148003889",
        category: "Commercial"
      },
      {
        title: "Interactive UI Animation",
        description: "웹사이트 UI/UX를 위한 인터랙티브 애니메이션",
        vimeoUrl: "https://player.vimeo.com/video/169599296",
        category: "UI/UX"
      },
      {
        title: "Corporate Presentation",
        description: "기업 프레젠테이션을 위한 모션 그래픽",
        vimeoUrl: "https://player.vimeo.com/video/148003889",
        category: "Corporate"
      },
      {
        title: "Social Media Campaign",
        description: "소셜미디어 캠페인을 위한 짧은 영상 콘텐츠",
        vimeoUrl: "https://player.vimeo.com/video/76979871",
        category: "Social Media"
      },
      {
        title: "Music Video Graphics",
        description: "뮤직비디오를 위한 비주얼 이펙트",
        vimeoUrl: "https://player.vimeo.com/video/169599296",
        category: "Music Video"
      },
      {
        title: "Event Opening Title",
        description: "이벤트 오프닝을 위한 타이틀 시퀀스",
        vimeoUrl: "https://player.vimeo.com/video/148003889",
        category: "Event"
      },
      {
        title: "App Store Preview",
        description: "앱스토어 프리뷰 영상 제작",
        vimeoUrl: "https://player.vimeo.com/video/76979871",
        category: "Mobile App"
      },
      {
        title: "Documentary Graphics",
        description: "다큐멘터리를 위한 인포그래픽 애니메이션",
        vimeoUrl: "https://player.vimeo.com/video/169599296",
        category: "Documentary"
      },
      {
        title: "Website Hero Animation",
        description: "웹사이트 메인 페이지를 위한 히어로 애니메이션",
        vimeoUrl: "https://player.vimeo.com/video/148003889",
        category: "Web Design"
      }
    ];

    for (const video of sampleVideos) {
      await this.createVideo(video);
    }
  }

  async getAllVideos(): Promise<Video[]> {
    return Array.from(this.videos.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async getVideo(id: string): Promise<Video | undefined> {
    return this.videos.get(id);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = randomUUID();
    const video: Video = { 
      ...insertVideo, 
      id, 
      createdAt: new Date() 
    };
    this.videos.set(id, video);
    return video;
  }

  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contacts.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = { 
      ...insertContact, 
      id, 
      createdAt: new Date() 
    };
    this.contacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();

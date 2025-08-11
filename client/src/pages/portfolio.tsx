import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Video, SiteSettings } from "@shared/schema";
import { ArrowLeft, Home, ExternalLink, Settings, Play, Pause, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import AdminAuthModal from "../components/admin-auth-modal";

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  
  // Video player states
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<{[key: string]: number}>({});
  const [videoDuration, setVideoDuration] = useState<{[key: string]: number}>({});
  const [videoVolume, setVideoVolume] = useState<{[key: string]: number}>({});

  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const categories = ["all", ...Array.from(new Set(videos.map(video => video.category)))];
  
  // Function to get video thumbnail URL
  const getVideoThumbnail = (url: string, title: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (url.includes('vimeo.com/')) {
      // For Vimeo, we'll use a placeholder since getting thumbnails requires API
      return `data:image/svg+xml;base64,${btoa(`
        <svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
          <rect width="480" height="270" fill="#1a202c"/>
          <text x="240" y="120" text-anchor="middle" fill="#e2e8f0" font-family="Arial" font-size="18" font-weight="bold">
            ${title}
          </text>
          <circle cx="240" cy="160" r="30" fill="#4a5568"/>
          <polygon points="225,145 225,175 255,160" fill="#e2e8f0"/>
        </svg>
      `)}`;
    }
    return url;
  };

  // Function to get embed URL for playing video
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0&modestbranding=1&rel=0`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}?autoplay=1&controls=0&title=0&byline=0&portrait=0`;
    }
    return url;
  };

  // Video player control functions
  const handleVideoPlay = (videoId: string) => {
    setPlayingVideo(videoId);
  };

  const handleVideoPause = (videoId: string) => {
    setPlayingVideo(null);
  };

  const handleVideoSeek = (videoId: string, progress: number) => {
    setVideoProgress(prev => ({ ...prev, [videoId]: progress }));
  };

  const handleVolumeChange = (videoId: string, volume: number) => {
    setVideoVolume(prev => ({ ...prev, [videoId]: volume }));
  };

  const filteredVideos = selectedCategory === "all" 
    ? videos 
    : videos.filter(video => video.category === selectedCategory);

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "motion graphics":
        return "bg-blue-500";
      case "commercial":
        return "bg-green-500";
      case "ui/ux":
        return "bg-purple-500";
      case "corporate":
        return "bg-orange-500";
      case "social media":
        return "bg-pink-500";
      case "music video":
        return "bg-red-500";
      case "event":
        return "bg-yellow-500";
      case "mobile app":
        return "bg-indigo-500";
      case "documentary":
        return "bg-teal-500";
      case "web design":
        return "bg-cyan-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>포트폴리오 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-mesh">
      {/* Admin Settings Button */}
      <div className="fixed top-6 right-6 z-50 admin-button-mobile">
        <Button
          size="sm"
          className="bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/30 backdrop-blur-sm border border-white/20 dark:border-white/10 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          title="영상 관리"
          onClick={() => setShowAdminAuth(true)}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-center mb-8 bg-gradient-to-r from-blue-500 to-purple-600 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-6 shadow-lg relative">
          <Link href="/" className="absolute left-6">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <Home className="w-5 h-5" />
            </Button>
          </Link>
          
          <h1 className="font-bold text-white text-[24px] text-center">
            VIEW ALL
          </h1>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className="px-2 md:px-4 py-1 md:py-2 rounded-full transition-all duration-200 glass-card hover:bg-white/30 text-[#737373] ml-[1px] md:ml-[2px] mr-[1px] md:mr-[2px] pt-[2px] md:pt-[9px] pb-[2px] md:pb-[9px] font-bold text-[12px] md:text-[16px]"
            >
              {category === "all" ? "전체" : category}
            </button>
          ))}
        </div>

        {/* Projects Grid - Interactive Hover Player */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {filteredVideos.map((video) => (
            <div 
              key={video.id}
              className="group cursor-pointer"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => {
                setHoveredVideo(null);
                setPlayingVideo(null);
              }}
            >
              <div className="glass-surface rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
                <div className="aspect-video relative rounded-2xl overflow-hidden mb-4">
                  {/* Thumbnail Image */}
                  <img
                    src={video.thumbnailUrl || getVideoThumbnail(video.vimeoUrl, video.title)}
                    alt={video.title}
                    className={`w-full h-full object-cover transition-opacity duration-300 ${
                      playingVideo === video.id ? 'opacity-0' : 'opacity-100'
                    }`}
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `data:image/svg+xml;base64,${btoa(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="480" height="270" viewBox="0 0 480 270">
                          <rect width="480" height="270" fill="#1a202c"/>
                          <text x="240" y="120" text-anchor="middle" fill="#e2e8f0" font-family="Arial" font-size="16" font-weight="bold">
                            ${video.title}
                          </text>
                          <circle cx="240" cy="160" r="25" fill="#4a5568"/>
                          <polygon points="230,150 230,170 250,160" fill="#e2e8f0"/>
                        </svg>
                      `)}`;
                    }}
                  />

                  {/* Video Player (shown when playing) */}
                  {playingVideo === video.id && (
                    <iframe
                      src={getEmbedUrl(video.vimeoUrl)}
                      className="absolute inset-0 w-full h-full"
                      frameBorder="0"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                      title={video.title}
                    />
                  )}

                  {/* Play button overlay (shown on hover) */}
                  {hoveredVideo === video.id && playingVideo !== video.id && (
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleVideoPlay(video.id);
                        }}
                        className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-200"
                      >
                        <Play className="w-6 h-6 text-white ml-1" />
                      </button>
                    </div>
                  )}

                  {/* Video Controls (shown when hovered and playing) */}
                  {hoveredVideo === video.id && playingVideo === video.id && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                      {/* Progress Bar */}
                      <div className="flex items-center space-x-2 mb-2">
                        <div className="flex-1 bg-white/30 h-1 rounded-full">
                          <div 
                            className="bg-red-600 h-1 rounded-full transition-all"
                            style={{ width: `${videoProgress[video.id] || 0}%` }}
                          />
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleVideoPause(video.id);
                            }}
                            className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Pause className="w-3 h-3 text-white" />
                          </button>
                          
                          <div className="flex items-center space-x-1">
                            <Volume2 className="w-3 h-3 text-white" />
                            <div className="w-12 bg-white/30 h-1 rounded-full">
                              <div 
                                className="bg-white h-1 rounded-full"
                                style={{ width: `${videoVolume[video.id] || 100}%` }}
                              />
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(video.vimeoUrl, '_blank');
                          }}
                          className="w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                          <ExternalLink className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Category badge */}
                  <div className="absolute bottom-2 right-2">
                    <span className={`text-xs px-2 py-1 rounded-full text-white font-medium ${getCategoryColor(video.category)} shadow-lg`}>
                      {video.category}
                    </span>
                  </div>
                </div>
                
                {/* Video Info */}
                <div className="mt-4">
                  <h3 className="text-xl font-bold mb-2 text-[#595959]">{video.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{video.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        
      </div>
      
      {/* Admin Auth Modal */}
      <AdminAuthModal
        isOpen={showAdminAuth}
        onClose={() => setShowAdminAuth(false)}
        onAuth={() => {
          // Navigate to admin page after successful authentication
          window.location.href = '/admin';
        }}
      />
    </div>
  );
}
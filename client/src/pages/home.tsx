import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Video, SiteSettings } from "@shared/schema";
import { Instagram, Youtube, Mail, Phone, Settings, Play, Pause, Volume2, ExternalLink } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@/components/ui/button";

import AdminAuthModal from "../components/admin-auth-modal";

export default function Home() {
  const [showAdminAuth, setShowAdminAuth] = useState(false);
  
  // Animation states
  const [hasLoaded, setHasLoaded] = useState(false);
  
  // Video player states
  const [hoveredVideo, setHoveredVideo] = useState<string | null>(null);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [videoProgress, setVideoProgress] = useState<{[key: string]: number}>({});
  const [videoDuration, setVideoDuration] = useState<{[key: string]: number}>({});
  const [videoVolume, setVideoVolume] = useState<{[key: string]: number}>({});
  


  // Initial load animation - Apple style sequential entrance
  useEffect(() => {
    const timer = setTimeout(() => {
      setHasLoaded(true);
    }, 100); // Small delay to ensure DOM is ready

    return () => clearTimeout(timer);
  }, []);
  
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const { data: siteSettings } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
  });



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

  const portfolioImages = videos; // Show all videos in grid

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading portfolio...</p>
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
          className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
          title="영상 관리"
          onClick={() => setShowAdminAuth(true)}
        >
          <Settings className="w-5 h-5" />
        </Button>
      </div>
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Introduction Section */}
        <div 
          className={`bg-gradient-to-r from-blue-500 to-purple-600 dark:bg-black rounded-3xl p-8 mb-8 shadow-lg transform transition-all duration-1000 ease-out ${
            hasLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: hasLoaded ? '200ms' : '0ms' }}
        >
          <div className="text-center">
            <h1 className="text-4xl font-bold text-white mb-2">
              {siteSettings?.profileName || "oneglass"}
            </h1>
            <p className="text-xl text-white/90 font-semibold mb-4">
              {siteSettings?.profileTitle || "Film Director & Video Creator"}
            </p>
            <p className="text-white/80 text-lg leading-relaxed max-w-2xl mx-auto whitespace-pre-line">
              {siteSettings?.profileDescription || "창의적인 영상으로 스토리를 전달합니다. 브랜드의 본질을 담은                             영상 콘텐츠를 통해 감동과 메세지를 전달하는 비디오 디자이너입니다."}
            </p>
          </div>
        </div>

        {/* Video Gallery - Interactive Hover Player */}
        <div 
          className={`grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 transform transition-all duration-1000 ease-out ${
            hasLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: hasLoaded ? '600ms' : '0ms' }}
        >
          {(() => {
            const featuredVideos = portfolioImages.filter(video => video.isFeatured === "true");
            const videosToShow = featuredVideos.length > 0 ? featuredVideos : portfolioImages.slice(0, 4);
            return videosToShow;
          })().map((video, index) => (
            <div 
              key={video.id} 
              className="group cursor-pointer relative"
              onMouseEnter={() => setHoveredVideo(video.id)}
              onMouseLeave={() => {
                setHoveredVideo(null);
                setPlayingVideo(null);
              }}
            >
              <div className="aspect-video relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02]">
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
                        <text x="240" y="120" text-anchor="middle" fill="#e2e8f0" font-family="Arial" font-size="18" font-weight="bold">
                          ${video.title}
                        </text>
                        <circle cx="240" cy="160" r="30" fill="#4a5568"/>
                        <polygon points="225,145 225,175 255,160" fill="#e2e8f0"/>
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
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleVideoPlay(video.id);
                      }}
                      className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-xl transform hover:scale-110 transition-transform duration-200"
                    >
                      <Play className="w-8 h-8 text-white ml-1" />
                    </button>
                  </div>
                )}

                {/* Video Controls (shown when hovered and playing) */}
                {hoveredVideo === video.id && playingVideo === video.id && (
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                    {/* Progress Bar */}
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex-1 bg-white/30 h-1 rounded-full">
                        <div 
                          className="bg-red-600 h-1 rounded-full transition-all"
                          style={{ width: `${videoProgress[video.id] || 0}%` }}
                        />
                      </div>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleVideoPause(video.id);
                          }}
                          className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                        >
                          <Pause className="w-4 h-4 text-white" />
                        </button>
                        
                        <div className="flex items-center space-x-1">
                          <Volume2 className="w-4 h-4 text-white" />
                          <div className="w-16 bg-white/30 h-1 rounded-full">
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
                        className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* View All Videos Button */}
        <div 
          className={`text-center mb-12 transform transition-all duration-1000 ease-out ${
            hasLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: hasLoaded ? '1000ms' : '0ms' }}
        >
          <Link href="/portfolio">
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
            >VIEW ALL</Button>
          </Link>
        </div>

        {/* Contact Section */}
        <div 
          className={`glass-surface dark:bg-black rounded-3xl p-8 mb-8 transform transition-all duration-1000 ease-out ${
            hasLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
          style={{ transitionDelay: hasLoaded ? '1400ms' : '0ms' }}
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
              {siteSettings?.contactTitle || "연락하기"}
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg mb-8 max-w-2xl mx-auto whitespace-pre-line">
              {siteSettings?.contactDescription || "프로젝트 문의나 협업 제안이 있으시면 언제든지 연락주세요. 창의적인 영상 제작을 통해 브랜드의 스토리를 함께 만들어가겠습니다."}
            </p>
          </div>
          
          {/* Email Contact */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="text-lg text-gray-700 dark:text-gray-300">
                h4n23@naver.com
              </span>
            </div>
          </div>
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

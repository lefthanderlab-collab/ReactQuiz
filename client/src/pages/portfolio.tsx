import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Video } from "@shared/schema";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Portfolio() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const categories = ["all", ...Array.from(new Set(videos.map(video => video.category)))];
  
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
      <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Portföy yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-400 to-red-600">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/20 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Ana Sayfa
            </Button>
          </Link>
          
          <h1 className="text-3xl font-bold text-white">Tüm Projeler</h1>
          
          <div className="w-24"></div>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedCategory === category
                  ? "bg-white text-red-500 shadow-lg"
                  : "bg-white/20 text-white hover:bg-white/30"
              }`}
            >
              {category === "all" ? "Tümü" : category}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredVideos.map((video) => (
            <div 
              key={video.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="aspect-video relative">
                <iframe
                  src={video.vimeoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              </div>
              
              <div className="p-4 text-white">
                <h3 className="text-lg font-semibold mb-2 line-clamp-1">
                  {video.title}
                </h3>
                <p className="text-white/80 text-sm mb-3 line-clamp-2">
                  {video.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`text-xs px-3 py-1 rounded-full text-white font-medium ${getCategoryColor(video.category)}`}>
                    {video.category}
                  </span>
                  <button className="text-white/80 hover:text-white text-sm font-medium flex items-center space-x-1 transition-colors">
                    <span>Detay</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Results Count */}
        <div className="text-center text-white/80">
          <p className="text-lg">
            {filteredVideos.length} proje gösteriliyor
            {selectedCategory !== "all" && ` (${selectedCategory})`}
          </p>
        </div>
      </div>
    </div>
  );
}
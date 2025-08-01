import { Video } from "@shared/schema";
import { ExternalLink } from "lucide-react";

interface VideoCardProps {
  video: Video;
}

export default function VideoCard({ video }: VideoCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "motion graphics":
        return "bg-blue-50 text-blue-700";
      case "commercial":
        return "bg-green-50 text-green-700";
      case "ui/ux":
        return "bg-purple-50 text-purple-700";
      case "corporate":
        return "bg-orange-50 text-orange-700";
      case "social media":
        return "bg-pink-50 text-pink-700";
      case "music video":
        return "bg-red-50 text-red-700";
      case "event":
        return "bg-yellow-50 text-yellow-700";
      case "mobile app":
        return "bg-indigo-50 text-indigo-700";
      case "documentary":
        return "bg-teal-50 text-teal-700";
      case "web design":
        return "bg-cyan-50 text-cyan-700";
      default:
        return "bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="video-card bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
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
      <div className="p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {video.title}
        </h3>
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {video.description}
        </p>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${getCategoryColor(video.category)}`}>
            {video.category}
          </span>
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1">
            <span>자세히 보기</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
}

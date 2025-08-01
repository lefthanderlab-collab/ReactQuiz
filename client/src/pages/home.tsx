import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Video } from "@shared/schema";
import VideoCard from "@/components/video-card";
import ContactModal from "@/components/contact-modal";
import { ChevronDown, MessageCircle } from "lucide-react";

export default function Home() {
  const [showAll, setShowAll] = useState(false);
  const [showContactForm, setShowContactForm] = useState(false);

  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const visibleVideos = showAll ? videos : videos.slice(0, 3);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">포트폴리오를 불러오는 중...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              🎬 Motion Graphics Portfolio
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              창의적인 모션 그래픽과 비주얼 스토리텔링을 통해 브랜드에 생명을 불어넣습니다
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured Projects Section */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-semibold text-gray-900">Featured Projects</h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>{visibleVideos.length}</span>
              <span>of</span>
              <span>{videos.length}</span>
              <span>projects</span>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {visibleVideos.map((video) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>

          {/* Show More Button */}
          {!showAll && videos.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(true)}
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                <span>더보기</span>
                <ChevronDown className="ml-2 w-4 h-4" />
              </button>
            </div>
          )}

          {/* Show Less Button */}
          {showAll && videos.length > 3 && (
            <div className="text-center">
              <button
                onClick={() => setShowAll(false)}
                className="inline-flex items-center px-6 py-3 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 shadow-sm"
              >
                <span>접기</span>
                <ChevronDown className="ml-2 w-4 h-4 transform rotate-180" />
              </button>
            </div>
          )}
        </section>

        {/* About Section */}
        <section className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">About My Work</h2>
            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              10여 년간 모션 그래픽 분야에서 활동하며, 브랜드 스토리를 시각적으로 전달하는 창의적인 솔루션을 제공합니다.
              각 프로젝트마다 고유한 스타일과 메시지를 담아 기억에 남는 경험을 만들어냅니다.
            </p>

            {/* Skills Tags */}
            <div className="flex flex-wrap justify-center gap-3">
              <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">After Effects</span>
              <span className="px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium">Cinema 4D</span>
              <span className="px-4 py-2 bg-purple-50 text-purple-700 rounded-full text-sm font-medium">Premiere Pro</span>
              <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-full text-sm font-medium">Illustrator</span>
              <span className="px-4 py-2 bg-pink-50 text-pink-700 rounded-full text-sm font-medium">Brand Identity</span>
            </div>
          </div>
        </section>
      </main>

      {/* Floating Contact Button */}
      <button
        onClick={() => setShowContactForm(true)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg hover:shadow-xl flex items-center justify-center transition-all duration-300 z-50 animate-pulse"
        title="메시지 남기기"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Contact Form Modal */}
      <ContactModal
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
      />

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2024 Motion Graphics Portfolio. All rights reserved.</p>
            <p className="text-sm mt-2">Creative visual storytelling through motion graphics</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

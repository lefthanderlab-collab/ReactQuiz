import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Video } from "@shared/schema";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactModal from "../components/contact-modal";

export default function Home() {
  const [showContactForm, setShowContactForm] = useState(false);
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

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
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Navigation */}
        <nav className="bg-white/90 backdrop-blur-sm rounded-2xl px-8 py-4 mb-12 shadow-lg">
          <div className="flex justify-center space-x-8">
            <button 
              onClick={() => setShowContactForm(true)}
              className="text-gray-700 hover:text-blue-600 transition-colors font-medium"
            >
              연락하기
            </button>
            <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              소개
            </button>
            <button className="text-blue-600 font-medium">
              홈
            </button>
            <Link href="/portfolio">
              <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                포트폴리오
              </button>
            </Link>
            <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              서비스
            </button>
          </div>
        </nav>

        {/* Main Content Layout with Profile and Video Grid */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl">
          {/* Header with Title */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">포트폴리오</h1>
          </div>
          
          {/* Video Grid with Profile */}
          <div className="grid grid-cols-3 gap-6">
            {/* Profile Card - Top Left */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-6 flex flex-col items-center justify-center text-white shadow-lg">
              <div className="w-20 h-20 rounded-full overflow-hidden mb-4 border-3 border-white/30">
                <img 
                  src="https://images.unsplash.com/photo-1494790108755-2616b612b1a5?w=150&h=150&fit=crop&crop=face" 
                  alt="oneglass profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h2 className="text-lg font-bold mb-1">oneglass</h2>
              <p className="text-sm text-white/80 text-center leading-tight">
                창의적인 영상으로<br/>스토리를 전달합니다
              </p>
            </div>
            
            {/* Video Cards */}
            {portfolioImages.slice(0, 8).map((video, index) => (
              <div key={video.id} className="bg-gray-100 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="aspect-video relative">
                  <iframe
                    src={video.vimeoUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  ></iframe>
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-all duration-300"></div>
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 mb-1 truncate">{video.title}</h3>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                    {video.category}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Button */}
          <div className="text-center mt-8">
            <Link href="/portfolio">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                전체보기 →
              </Button>
            </Link>
          </div>
        </div>

        {/* Services Section - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <h3 className="text-lg font-semibold mb-3">Film Direction</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              브랜드의 스토리를 시각적으로 전달하는 창의적인 영상 제작과 연출
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <h3 className="text-lg font-semibold mb-3">Video Production</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              기업 홍보영상부터 소셜미디어 콘텐츠까지 다양한 영상 제작
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <h3 className="text-lg font-semibold mb-3">Brand Storytelling</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              브랜드만의 고유한 스토리와 가치를 영상을 통해 효과적으로 전달
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-2xl">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">연락하기</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              프로젝트 문의나 협업 제안이 있으시면 언제든지 연락주세요.<br/>
              창의적인 영상 제작을 통해 브랜드의 스토리를 함께 만들어가겠습니다.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                onClick={() => setShowContactForm(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-8 py-4 rounded-lg text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                메시지 보내기
              </Button>
              
              <div className="flex flex-col sm:flex-row gap-4 text-gray-600">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Email: oneglass@example.com</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Phone: +82 10-1234-5678</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Contact Button */}
      <button
        onClick={() => setShowContactForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50"
        title="연락하기"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Contact Form Modal */}
      <ContactModal
        isOpen={showContactForm}
        onClose={() => setShowContactForm(false)}
      />
    </div>
  );
}

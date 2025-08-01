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
    <div className="min-h-screen gradient-mesh">
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Navigation */}
        <nav className="nav-glass rounded-2xl px-8 py-4 mb-12">
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

        {/* Profile Introduction Section */}
        <div className="glass-surface rounded-3xl p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white/30 shadow-lg">
              <img 
                src="@assets/KakaoTalk_20250801_205908964_1754049581015.jpg" 
                alt="oneglass 프로필" 
                className="w-full h-full object-cover object-center"
              />
            </div>
            
            {/* Profile Content */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">oneglass</h1>
              <p className="text-xl text-blue-600 mb-4">Film Director & Video Creator</p>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                창의적인 영상으로 스토리를 전달합니다. 브랜드의 본질을 담은 영상 콘텐츠를 통해 
                감동과 메시지를 전달하는 비디오 디자이너입니다.
              </p>
            </div>
          </div>
        </div>

        {/* Portfolio Section */}
        <div className="glass-surface rounded-3xl p-8 mb-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Featured Portfolio</h2>
            <p className="text-gray-600 text-lg">최신 영상 작품들을 확인해보세요</p>
          </div>
          
          {/* Video Grid - 2 per row with optimal ratio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {portfolioImages.slice(0, 6).map((video, index) => (
              <div key={video.id} className="video-card-glass rounded-2xl overflow-hidden group">
                <div className="aspect-video relative">
                  <iframe
                    src={video.vimeoUrl}
                    className="w-full h-full"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                    title={video.title}
                  ></iframe>
                </div>
                <div className="p-6">
                  <h3 className="font-semibold text-gray-800 mb-2 text-lg">
                    {video.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {video.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                      {video.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* See More Button */}
          <div className="text-center mt-10">
            <Link href="/portfolio">
              <Button 
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
              >
                전체 포트폴리오 보기 →
              </Button>
            </Link>
          </div>
        </div>

        {/* Services Section - Simplified */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-card rounded-xl p-6 text-center text-white">
            <h3 className="text-lg font-semibold mb-3">Film Direction</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              브랜드의 스토리를 시각적으로 전달하는 창의적인 영상 제작과 연출
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 text-center text-white">
            <h3 className="text-lg font-semibold mb-3">Video Production</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              기업 홍보영상부터 소셜미디어 콘텐츠까지 다양한 영상 제작
            </p>
          </div>

          <div className="glass-card rounded-xl p-6 text-center text-white">
            <h3 className="text-lg font-semibold mb-3">Brand Storytelling</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              브랜드만의 고유한 스토리와 가치를 영상을 통해 효과적으로 전달
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div className="glass-surface rounded-3xl p-8 mb-8">
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

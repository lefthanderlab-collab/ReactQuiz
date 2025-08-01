import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Video } from "@shared/schema";
import { ChevronLeft, ChevronRight, Zap, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import ContactModal from "../components/contact-modal";

export default function Home() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const portfolioImages = videos.slice(0, 4); // Show first 4 videos as portfolio preview

  const nextSlide = () => {
    setCurrentSlideIndex((prev) => (prev + 1) % Math.max(1, portfolioImages.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlideIndex((prev) => (prev - 1 + Math.max(1, portfolioImages.length - 2)) % Math.max(1, portfolioImages.length - 2));
  };

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

        {/* Profile Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-purple-400 overflow-hidden mx-auto shadow-xl">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616b612b1a5?w=150&h=150&fit=crop&crop=face" 
                alt="oneglass profile" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <h1 className="text-4xl font-light text-white mb-4">
            Hello, I'm <span className="font-bold text-white">oneglass</span>.
          </h1>
          
          <h2 className="text-2xl font-semibold text-white mb-4">
            창의적인 영상으로 스토리를 전달합니다
          </h2>
          
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            브랜드의 본질을 담은 영상 콘텐츠를 통해 감동과 메시지를 전달하는 비디오 디자이너입니다
          </p>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Film Direction</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              브랜드의 스토리를 시각적으로 전달하는 창의적인 영상 제작과 연출을 통해 감동을 만들어냅니다.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Video Production</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              기업 홍보영상, 브랜드 캠페인, 소셜미디어 콘텐츠까지 다양한 영상 제작 서비스를 제공합니다.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Brand Storytelling</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              브랜드만의 고유한 스토리와 가치를 영상을 통해 효과적으로 전달하는 전문 서비스입니다.
            </p>
          </div>
        </div>

        {/* Portfolio Preview Section */}
        <div className="relative mb-8">
          <div className="flex justify-center space-x-6 overflow-hidden">
            {portfolioImages.slice(currentSlideIndex, currentSlideIndex + 3).map((video, index) => (
              <div 
                key={video.id} 
                className="w-[520px] h-80 bg-white/10 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg"
              >
                <iframe
                  src={video.vimeoUrl}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {portfolioImages.length > 3 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link href="/portfolio">
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              전체보기 →
            </Button>
          </Link>
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

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
              Contact
            </button>
            <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              About
            </button>
            <button className="text-blue-600 font-medium">
              Home
            </button>
            <Link href="/portfolio">
              <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                Portfolio
              </button>
            </Link>
            <button className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
              Services
            </button>
          </div>
        </nav>

        {/* Profile Section */}
        <div className="text-center mb-16">
          <div className="relative inline-block mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-purple-400 overflow-hidden mx-auto shadow-xl">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                MG
              </div>
            </div>
          </div>
          
          <h1 className="text-4xl font-light text-white mb-4">
            Hello, I'm a <span className="font-bold text-white">Motion Graphics</span> Designer.
          </h1>
          
          <p className="text-white/80 text-lg max-w-2xl mx-auto leading-relaxed">
            I bring brands to life through creative motion graphics and visual storytelling. 
            Each project features unique style and messaging to create unforgettable experiences.
          </p>
        </div>

        {/* Services Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Motion Graphics</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Professional motion graphics designs that visually tell your brand's story with creativity and impact.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Video Editing</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Professional video editing for corporate videos, promotional films, and social media content.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center text-white">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-semibold mb-3">Brand Identity</h3>
            <p className="text-white/80 text-sm leading-relaxed">
              Creative animation and graphic design solutions that strengthen your brand's visual identity.
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
              View All →
            </Button>
          </Link>
        </div>
      </div>

      {/* Floating Contact Button */}
      <button
        onClick={() => setShowContactForm(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 z-50"
        title="Contact"
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

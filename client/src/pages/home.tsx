import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Video } from "@shared/schema";
import { MessageCircle, Send, Instagram, Youtube, Mail, Phone, Settings, Edit } from "lucide-react";
import { FaFacebookF, FaTwitter, FaLinkedinIn } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ContactModal from "../components/contact-modal";

export default function Home() {
  const [showContactForm, setShowContactForm] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: ""
  });
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Animation refs
  const profileRef = useRef<HTMLDivElement>(null);
  const videoGridRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const contactRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in-up');
          entry.target.classList.remove('opacity-0', 'translate-y-8');
        }
      });
    }, observerOptions);

    const elements = [profileRef.current, videoGridRef.current, buttonRef.current, contactRef.current];
    elements.forEach((el) => {
      if (el) {
        el.classList.add('opacity-0', 'translate-y-8', 'transition-all', 'duration-700');
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, []);
  
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const contactMutation = useMutation({
    mutationFn: async (formData: { name: string; email: string; message: string }) => {
      const response = await fetch("/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      if (!response.ok) {
        throw new Error("Failed to send message");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "메시지 전송 완료",
        description: "메시지가 성공적으로 전송되었습니다. 빠른 시일 내에 답변드리겠습니다.",
      });
      setContactForm({ name: "", email: "", message: "" });
      queryClient.invalidateQueries({ queryKey: ["/api/contacts"] });
    },
    onError: () => {
      toast({
        title: "전송 실패",
        description: "메시지 전송에 실패했습니다. 다시 시도해주세요.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      toast({
        title: "입력 오류",
        description: "모든 필드를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }
    contactMutation.mutate(contactForm);
  };

  // Function to convert YouTube URL to embed format
  const getEmbedUrl = (url: string) => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://player.vimeo.com/video/${videoId}`;
    }
    return url; // Return original URL if already in embed format
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
      <div className="fixed top-6 right-6 z-50">
        <Link href="/admin">
          <Button
            size="sm"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            title="영상 관리"
          >
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Profile Introduction Section */}
        <div ref={profileRef} className="glass-surface rounded-3xl p-8 mb-8">
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

        {/* Video Gallery - Clean & Minimal */}
        <div ref={videoGridRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {portfolioImages.slice(0, 6).map((video, index) => (
            <div key={video.id} className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 relative group">
              <div className="aspect-video relative">
                <iframe
                  src={getEmbedUrl(video.vimeoUrl)}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                ></iframe>
                
                {/* Edit Button */}
                <Link href={`/admin?edit=${video.id}`}>
                  <button
                    className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100"
                    title="영상 편집"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Videos Button */}
        <div ref={buttonRef} className="text-center mb-12">
          <Link href="/portfolio">
            <Button 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              영상 전체보기 →
            </Button>
          </Link>
        </div>



        {/* Contact Section */}
        <div ref={contactRef} className="glass-surface rounded-3xl p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">연락하기</h2>
            <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
              프로젝트 문의나 협업 제안이 있으시면 언제든지 연락주세요.<br/>
              창의적인 영상 제작을 통해 브랜드의 스토리를 함께 만들어가겠습니다.
            </p>
          </div>
          
          {/* Contact Form */}
          <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 *
                </label>
                <Input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  placeholder="이름을 입력해주세요"
                  className="w-full"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일 *
                </label>
                <Input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  placeholder="이메일을 입력해주세요"
                  className="w-full"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                메시지 *
              </label>
              <Textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                placeholder="프로젝트에 대한 내용이나 문의사항을 자세히 적어주세요"
                className="w-full h-32 resize-none"
                required
              />
            </div>
            
            <div className="text-center">
              <Button
                type="submit"
                disabled={contactMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-10 py-4 rounded-full text-lg font-medium shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {contactMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    전송 중...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    메시지 보내기
                  </>
                )}
              </Button>
            </div>
          </form>
          
          {/* Contact Info */}
          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <div className="flex items-center justify-center gap-2">
              <Mail className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-gray-600">oneglass@example.com</span>
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

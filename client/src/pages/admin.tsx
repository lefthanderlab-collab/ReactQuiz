import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Video, InsertVideo } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVideoSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Trash2, Plus, Eye, ArrowLeft, Edit } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function AdminPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);

  // Fetch all videos
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  // Create video mutation
  const createVideoMutation = useMutation({
    mutationFn: (videoData: InsertVideo) => apiRequest("/api/videos", "POST", videoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setShowForm(false);
      form.reset();
      toast({
        title: "성공",
        description: "영상이 성공적으로 추가되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "영상 추가에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Update video mutation
  const updateVideoMutation = useMutation({
    mutationFn: ({ id, ...videoData }: { id: string } & InsertVideo) => 
      apiRequest(`/api/videos/${id}`, "PUT", videoData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setEditingVideo(null);
      form.reset();
      toast({
        title: "성공",
        description: "영상이 성공적으로 수정되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "영상 수정에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Delete video mutation
  const deleteVideoMutation = useMutation({
    mutationFn: (videoId: string) => apiRequest(`/api/videos/${videoId}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "성공",
        description: "영상이 성공적으로 삭제되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "영상 삭제에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Form setup
  const form = useForm<InsertVideo>({
    resolver: zodResolver(insertVideoSchema),
    defaultValues: {
      title: "",
      description: "",
      vimeoUrl: "",
      category: "",
    },
  });

  const onSubmit = (data: InsertVideo) => {
    if (editingVideo) {
      updateVideoMutation.mutate({ id: editingVideo.id, ...data });
    } else {
      createVideoMutation.mutate(data);
    }
  };

  const handleEditVideo = (video: Video) => {
    setEditingVideo(video);
    setShowForm(true);
    form.reset({
      title: video.title,
      description: video.description,
      vimeoUrl: video.vimeoUrl,
      category: video.category,
    });
  };

  const handleCancelEdit = () => {
    setEditingVideo(null);
    setShowForm(false);
    form.reset();
  };

  // Function to get video thumbnail URL
  const getVideoThumbnail = (url: string, title: string = "Video Thumbnail") => {
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1].split('&')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    } else if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1].split('?')[0];
      return `https://vumbnail.com/${videoId}.jpg`;
    } else if (url.includes('player.vimeo.com/video/')) {
      const videoId = url.split('video/')[1].split('?')[0];
      return `https://vumbnail.com/${videoId}.jpg`;
    }
    // Default placeholder for unsupported formats
    return `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
        <rect width="320" height="180" fill="#1e293b"/>
        <text x="160" y="90" text-anchor="middle" fill="#64748b" font-family="Arial" font-size="14">
          ${title}
        </text>
        <circle cx="160" cy="110" r="20" fill="#64748b"/>
        <polygon points="155,105 155,115 165,110" fill="#1e293b"/>
      </svg>
    `)}`;
  };

  const handleDeleteVideo = (videoId: string, title: string) => {
    if (window.confirm(`"${title}" 영상을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      deleteVideoMutation.mutate(videoId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Back to Home Button */}
      <div className="fixed top-6 left-6 z-50">
        <Link href="/">
          <Button
            size="sm"
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110"
            title="홈으로 돌아가기"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">영상 관리</h1>
          <p className="text-xl text-blue-200">포트폴리오 영상을 추가하거나 삭제할 수 있습니다</p>
        </div>

        {/* Add Video Button */}
        <div className="flex justify-center mb-8">
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            새 영상 추가
          </Button>
        </div>

        {/* Add/Edit Video Form */}
        {showForm && (
          <Card className="mb-8 bg-white/10 backdrop-blur-sm border-white/20">
            <CardHeader>
              <CardTitle className="text-white">
                {editingVideo ? "영상 수정" : "새 영상 추가"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">제목</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="영상 제목을 입력하세요"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">설명</FormLabel>
                        <FormControl>
                          <Textarea
                            {...field}
                            placeholder="영상에 대한 설명을 입력하세요"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                            rows={3}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="vimeoUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">YouTube/Vimeo URL</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="YouTube: https://youtu.be/... 또는 Vimeo: https://vimeo.com/..."
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white">카테고리</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="예: Motion Graphics, Commercial, Music Video"
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4">
                    <Button
                      type="submit"
                      disabled={createVideoMutation.isPending || updateVideoMutation.isPending}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      {editingVideo ? (
                        updateVideoMutation.isPending ? "수정 중..." : "영상 수정"
                      ) : (
                        createVideoMutation.isPending ? "추가 중..." : "영상 추가"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      className="border-white/20 text-white hover:bg-white/10"
                    >
                      취소
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        )}

        {/* Video List */}
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-blue-200">영상 목록을 불러오는 중...</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <Card key={video.id} className="bg-white/10 backdrop-blur-sm border-white/20">
                <CardHeader>
                  <CardTitle className="text-white text-lg line-clamp-2">
                    {video.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Video Preview */}
                    <div 
                      className="aspect-video rounded-lg overflow-hidden bg-gray-800 relative group cursor-pointer"
                      onClick={() => window.open(video.vimeoUrl, '_blank')}
                    >
                      <img
                        src={getVideoThumbnail(video.vimeoUrl, video.title)}
                        alt={video.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          // Fallback to a default placeholder if thumbnail fails to load
                          e.currentTarget.src = `data:image/svg+xml;base64,${btoa(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180">
                              <rect width="320" height="180" fill="#374151"/>
                              <text x="160" y="80" text-anchor="middle" fill="#9CA3AF" font-family="Arial" font-size="12">
                                ${video.title}
                              </text>
                              <circle cx="160" cy="110" r="20" fill="#6B7280"/>
                              <polygon points="155,105 155,115 165,110" fill="#374151"/>
                            </svg>
                          `)}`;
                        }}
                      />
                      {/* Edit button - top right corner */}
                      <div className="absolute top-2 right-2 z-10">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditVideo(video);
                          }}
                          className="w-8 h-8 p-0 bg-green-500/90 hover:bg-green-600 border-green-400 text-white rounded-full shadow-lg backdrop-blur-sm"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-black border-y-[6px] border-y-transparent ml-1"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-blue-200 text-sm line-clamp-3">
                        {video.description}
                      </p>
                      <p className="text-blue-300 text-xs">
                        카테고리: {video.category}
                      </p>
                      {video.createdAt && (
                        <p className="text-blue-300 text-xs">
                          생성일: {new Date(video.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(video.vimeoUrl, '_blank')}
                        className="border-white/20 text-white hover:bg-white/10 flex-1"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        미리보기
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteVideo(video.id, video.title)}
                        disabled={deleteVideoMutation.isPending}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {videos.length === 0 && !isLoading && (
          <div className="text-center py-16">
            <p className="text-blue-200 text-lg mb-4">등록된 영상이 없습니다.</p>
            <p className="text-blue-300">위의 "새 영상 추가" 버튼을 클릭하여 첫 번째 영상을 추가해보세요.</p>
          </div>
        )}
      </div>
    </div>
  );
}
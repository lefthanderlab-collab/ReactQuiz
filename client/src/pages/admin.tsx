import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Video, InsertVideo, SiteSettings, InsertSiteSettings } from "@shared/schema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVideoSchema, insertSiteSettingsSchema } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Eye, ArrowLeft, Edit, Settings, Upload, X, Users, Key } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function AdminPage() {
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  const [showSiteSettings, setShowSiteSettings] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Password change states
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Fetch all videos
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  // Fetch site settings
  const { data: siteSettings, isLoading: settingsLoading } = useQuery<SiteSettings>({
    queryKey: ["/api/site-settings"],
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

  // Update site settings mutation
  const updateSiteSettingsMutation = useMutation({
    mutationFn: (settingsData: InsertSiteSettings) => 
      apiRequest("/api/site-settings", "PUT", settingsData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/site-settings"] });
      setShowSiteSettings(false);
      settingsForm.reset();
      toast({
        title: "성공",
        description: "사이트 설정이 성공적으로 업데이트되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "사이트 설정 업데이트에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Toggle featured status mutation
  const toggleFeaturedMutation = useMutation({
    mutationFn: ({ id, isFeatured }: { id: string; isFeatured: boolean }) => 
      apiRequest(`/api/videos/${id}/featured`, "PATCH", { isFeatured }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      toast({
        title: "성공",
        description: "홈페이지 노출 설정이 변경되었습니다.",
      });
    },
    onError: () => {
      toast({
        title: "오류",
        description: "설정 변경에 실패했습니다.",
        variant: "destructive",
      });
    },
  });

  // Password change mutation
  const changePasswordMutation = useMutation({
    mutationFn: (passwordData: { newPassword: string }) => 
      apiRequest("/api/admin/change-password", "POST", passwordData),
    onSuccess: () => {
      setNewPassword("");
      setConfirmPassword("");
      toast({
        title: "성공",
        description: "비밀번호가 변경되었습니다. 새 비밀번호로 다시 로그인해주세요.",
      });
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    },
    onError: (error: any) => {
      toast({
        title: "오류",
        description: error.message || "비밀번호 변경에 실패했습니다.",
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

  // Site settings form setup
  const settingsForm = useForm<InsertSiteSettings>({
    resolver: zodResolver(insertSiteSettingsSchema),
    defaultValues: {
      profileName: "",
      profileTitle: "",
      profileDescription: "",
      contactTitle: "",
      contactDescription: "",
      contactEmail: "",
    },
  });

  const onSubmit = async (data: InsertVideo) => {
    let thumbnailUrl = editingVideo?.thumbnailUrl || null;
    
    // If there's a new thumbnail preview, upload it
    if (thumbnailPreview && fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0];
      const formData = new FormData();
      formData.append('thumbnail', file);
      
      try {
        const response = await fetch('/api/upload-thumbnail', {
          method: 'POST',
          body: formData,
        });
        
        if (response.ok) {
          const result = await response.json();
          thumbnailUrl = result.thumbnailUrl;
        }
      } catch (error) {
        console.error('Thumbnail upload failed:', error);
        toast({
          title: "경고",
          description: "썸네일 업로드에 실패했지만 영상은 저장됩니다.",
          variant: "destructive",
        });
      }
    }

    const videoData = {
      ...data,
      thumbnailUrl,
    };

    if (editingVideo) {
      updateVideoMutation.mutate({ id: editingVideo.id, ...videoData });
    } else {
      createVideoMutation.mutate(videoData);
    }
  };

  const onSettingsSubmit = (data: InsertSiteSettings) => {
    updateSiteSettingsMutation.mutate(data);
  };

  // Load site settings into form when data is available
  useEffect(() => {
    if (siteSettings) {
      // Force form reset with current values
      setTimeout(() => {
        settingsForm.reset({
          profileName: siteSettings.profileName || "",
          profileTitle: siteSettings.profileTitle || "",
          profileDescription: siteSettings.profileDescription || "",
          contactTitle: siteSettings.contactTitle || "",
          contactDescription: siteSettings.contactDescription || "",
          contactEmail: siteSettings.contactEmail || "",
        });
      }, 100);
    }
  }, [siteSettings]);



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
    setThumbnailPreview(null);
    form.reset();
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setThumbnailPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove thumbnail preview
  const removeThumbnailPreview = () => {
    setThumbnailPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Function to get video thumbnail URL
  const getVideoThumbnail = (video: Video) => {
    // Use custom thumbnail if available
    if (video.thumbnailUrl) {
      return video.thumbnailUrl;
    }
    
    // Fall back to auto-generated thumbnails
    const url = video.vimeoUrl;
    const title = video.title;
    
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

  // Handle password change
  const handlePasswordChange = () => {
    if (!newPassword) {
      toast({
        title: "오류",
        description: "새 비밀번호를 입력해주세요.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "오류", 
        description: "새 비밀번호가 일치하지 않습니다.",
        variant: "destructive",
      });
      return;
    }

    if (newPassword.length < 4) {
      toast({
        title: "오류",
        description: "비밀번호는 최소 4자 이상이어야 합니다.",
        variant: "destructive",
      });
      return;
    }

    changePasswordMutation.mutate({ newPassword });
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
          <h1 className="text-4xl font-bold mb-4">관리자 패널</h1>
          <p className="text-xl text-blue-200">영상과 사이트 설정을 관리할 수 있습니다</p>
        </div>

        <Tabs defaultValue="videos" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 border-white/20">
            <TabsTrigger value="videos" className="text-white data-[state=active]:bg-white/20">
              영상 관리
            </TabsTrigger>
            <TabsTrigger value="settings" className="text-white data-[state=active]:bg-white/20">
              사이트 설정
            </TabsTrigger>
            <TabsTrigger value="channel" className="text-white data-[state=active]:bg-white/20">
              <Users className="w-4 h-4 mr-2" />
              채널 관리
            </TabsTrigger>
          </TabsList>

          <TabsContent value="videos" className="mt-8">
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

                  {/* Thumbnail Upload Section */}
                  <div className="space-y-3">
                    <label className="text-white font-medium">썸네일 이미지</label>
                    
                    {/* Current thumbnail or preview */}
                    {(thumbnailPreview || (editingVideo?.thumbnailUrl)) && (
                      <div className="relative inline-block">
                        <img
                          src={thumbnailPreview || editingVideo?.thumbnailUrl || ''}
                          alt="썸네일 미리보기"
                          className="w-32 h-20 object-cover rounded-lg border border-white/20"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          onClick={removeThumbnailPreview}
                          className="absolute -top-2 -right-2 w-6 h-6 p-0 rounded-full"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                    
                    {/* Upload button */}
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-white/20 text-white hover:bg-white/10 bg-[#2563eb]"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        썸네일 업로드
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </div>
                    <p className="text-xs text-blue-200">
                      썸네일을 업로드하지 않으면 YouTube/Vimeo에서 자동으로 생성됩니다.
                    </p>
                  </div>

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
                      className="border-white/20 text-white hover:bg-white/10 bg-[#2563eb]"
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
                        src={getVideoThumbnail(video)}
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
                      {/* Category and Edit button - top right corner */}
                      <div className="absolute top-2 right-2 z-10 flex flex-col gap-1 items-end">
                        {/* Category badge */}
                        <div className="bg-blue-500/90 backdrop-blur-sm border border-blue-400 text-white text-xs px-2 py-1 rounded-full shadow-lg">
                          {video.category}
                        </div>
                        {/* Edit button */}
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
                      {video.createdAt && (
                        <p className="text-blue-300 text-xs">
                          생성일: {new Date(video.createdAt).toLocaleDateString('ko-KR')}
                        </p>
                      )}
                    </div>

                    {/* Featured Status */}
                    <div className="flex items-center justify-between bg-white/5 rounded-lg p-2">
                      <span className="text-sm text-blue-200">홈페이지 노출:</span>
                      <Button
                        size="sm"
                        onClick={() => toggleFeaturedMutation.mutate({ 
                          id: video.id, 
                          isFeatured: video.isFeatured !== "true" 
                        })}
                        className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                          video.isFeatured === "true"
                            ? 'bg-green-500/80 hover:bg-green-600 text-white'
                            : 'bg-gray-500/80 hover:bg-gray-600 text-white'
                        }`}
                        disabled={toggleFeaturedMutation.isPending}
                      >
                        {video.isFeatured === "true" ? "노출됨" : "미노출"}
                      </Button>
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
          </TabsContent>

          <TabsContent value="settings" className="mt-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white">사이트 설정</CardTitle>
              </CardHeader>
              <CardContent>
                {settingsLoading ? (
                  <div className="text-center py-8">
                    <p className="text-blue-200">설정을 불러오는 중...</p>
                  </div>
                ) : (
                  <Form {...settingsForm}>
                    <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">프로필 설정</h3>
                        
                        <FormField
                          control={settingsForm.control}
                          name="profileName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">이름</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={siteSettings?.profileName || field.value || ""}
                                  placeholder="프로필 이름을 입력하세요"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingsForm.control}
                          name="profileTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">직책/타이틀</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={siteSettings?.profileTitle || field.value || ""}
                                  placeholder="예: 영화 감독, 비디오 디자이너"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingsForm.control}
                          name="profileDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">프로필 설명</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={siteSettings?.profileDescription || field.value || ""}
                                  placeholder="자신을 소개하는 내용을 입력하세요"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[100px]"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">연락처 설정</h3>
                        
                        <FormField
                          control={settingsForm.control}
                          name="contactTitle"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">연락처 섹션 제목</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={siteSettings?.contactTitle || field.value || ""}
                                  placeholder="예: 문의하기, Contact"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingsForm.control}
                          name="contactDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">연락처 설명</FormLabel>
                              <FormControl>
                                <Textarea
                                  {...field}
                                  value={siteSettings?.contactDescription || field.value || ""}
                                  placeholder="연락처 섹션에 표시될 설명을 입력하세요"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={settingsForm.control}
                          name="contactEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-white">이메일</FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  value={siteSettings?.contactEmail || field.value || ""}
                                  type="email"
                                  placeholder="contact@example.com"
                                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="flex gap-4">
                        <Button
                          type="submit"
                          disabled={updateSiteSettingsMutation.isPending}
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          {updateSiteSettingsMutation.isPending ? "저장 중..." : "설정 저장"}
                        </Button>
                      </div>
                    </form>
                  </Form>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="channel" className="mt-8">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  비밀번호 변경
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <p className="text-blue-200">
                    관리자 패널 접근을 위한 비밀번호를 변경할 수 있습니다.
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-white font-medium mb-2">
                        새 비밀번호
                      </label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="새 비밀번호를 입력하세요"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-white font-medium mb-2">
                        새 비밀번호 확인
                      </label>
                      <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="새 비밀번호를 다시 입력하세요"
                        className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                      />
                    </div>
                    
                    <div className="flex gap-4">
                      <Button
                        onClick={handlePasswordChange}
                        disabled={changePasswordMutation.isPending || !newPassword || !confirmPassword}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        {changePasswordMutation.isPending ? "변경 중..." : "비밀번호 변경"}
                      </Button>
                      
                      <Button
                        variant="outline"
                        onClick={() => {
                          setNewPassword("");
                          setConfirmPassword("");
                        }}
                        className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      >
                        취소
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
                    <p className="text-yellow-200 text-sm">
                      <strong>주의:</strong> 비밀번호를 변경하면 기존 세션이 무효화되어 다시 로그인해야 합니다.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
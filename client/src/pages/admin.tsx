import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Plus, Edit, Trash2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Video, InsertVideo } from "@shared/schema";

export default function AdminPage() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<Video | null>(null);
  
  const { data: videos = [], isLoading } = useQuery<Video[]>({
    queryKey: ["/api/videos"],
  });

  const createVideoMutation = useMutation({
    mutationFn: async (data: InsertVideo) => {
      return await apiRequest("/api/videos", "POST", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setIsDialogOpen(false);
      resetForm();
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

  const updateVideoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<InsertVideo> }) => {
      return await apiRequest(`/api/videos/${id}`, "PUT", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/videos"] });
      setIsDialogOpen(false);
      setEditingVideo(null);
      resetForm();
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

  const deleteVideoMutation = useMutation({
    mutationFn: async (id: string) => {
      return await apiRequest(`/api/videos/${id}`, "DELETE");
    },
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

  const [formData, setFormData] = useState<InsertVideo>({
    title: "",
    description: "",
    vimeoUrl: "",
    category: "",
    featured: false,
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      vimeoUrl: "",
      category: "",
      featured: false,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingVideo) {
      updateVideoMutation.mutate({ id: editingVideo.id, data: formData });
    } else {
      createVideoMutation.mutate(formData);
    }
  };

  const handleEdit = (video: Video) => {
    setEditingVideo(video);
    setFormData({
      title: video.title,
      description: video.description,
      vimeoUrl: video.vimeoUrl,
      category: video.category,
      featured: video.featured || false,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("정말로 이 영상을 삭제하시겠습니까?")) {
      deleteVideoMutation.mutate(id);
    }
  };

  const extractVimeoId = (url: string) => {
    const match = url.match(/vimeo\.com\/(\d+)/);
    return match ? match[1] : null;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white">로딩중...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-white">관리자 패널</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={() => {
                  setEditingVideo(null);
                  resetForm();
                }}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-lg border border-white/20"
              >
                <Plus className="w-4 h-4 mr-2" />
                영상 추가
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingVideo ? "영상 수정" : "새 영상 추가"}</DialogTitle>
                <DialogDescription className="text-white/70">
                  {editingVideo ? "기존 영상 정보를 수정합니다." : "새로운 영상을 포트폴리오에 추가합니다."}
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-white">제목</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="영상 제목을 입력하세요"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description" className="text-white">설명</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="영상에 대한 설명을 입력하세요"
                    rows={3}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="vimeoUrl" className="text-white">Vimeo URL</Label>
                  <Input
                    id="vimeoUrl"
                    value={formData.vimeoUrl}
                    onChange={(e) => setFormData({ ...formData, vimeoUrl: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    placeholder="https://player.vimeo.com/video/..."
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="category" className="text-white">카테고리</Label>
                  <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="카테고리를 선택하세요" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Motion Graphics">모션 그래픽</SelectItem>
                      <SelectItem value="Commercial">상업영상</SelectItem>
                      <SelectItem value="UI/UX">UI/UX</SelectItem>
                      <SelectItem value="Corporate">기업영상</SelectItem>
                      <SelectItem value="Social Media">소셜미디어</SelectItem>
                      <SelectItem value="Music Video">뮤직비디오</SelectItem>
                      <SelectItem value="Event">이벤트</SelectItem>
                      <SelectItem value="Mobile App">모바일 앱</SelectItem>
                      <SelectItem value="Documentary">다큐멘터리</SelectItem>
                      <SelectItem value="Web Design">웹 디자인</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured || false}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                  />
                  <Label htmlFor="featured" className="text-white">메인 페이지에 노출</Label>
                </div>
                <div className="flex justify-end space-x-2 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsDialogOpen(false);
                      setEditingVideo(null);
                      resetForm();
                    }}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    취소
                  </Button>
                  <Button 
                    type="submit" 
                    disabled={createVideoMutation.isPending || updateVideoMutation.isPending}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    {createVideoMutation.isPending || updateVideoMutation.isPending 
                      ? "저장중..." 
                      : editingVideo ? "수정" : "추가"
                    }
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => {
            const vimeoId = extractVimeoId(video.vimeoUrl);
            return (
              <Card key={video.id} className="bg-white/10 backdrop-blur-lg border border-white/20">
                <CardHeader className="pb-2">
                  <div className="aspect-video bg-black/20 rounded-lg overflow-hidden mb-3">
                    {vimeoId ? (
                      <iframe
                        src={`https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&player_id=0&app_id=58479`}
                        width="100%"
                        height="100%"
                        frameBorder="0"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/50">
                        <Eye className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-white text-sm line-clamp-2">{video.title}</CardTitle>
                      <CardDescription className="text-white/70 text-xs mt-1">
                        {video.category}
                      </CardDescription>
                    </div>
                    {video.featured && (
                      <Badge variant="secondary" className="ml-2 bg-blue-500/20 text-blue-300 border-blue-400/30">
                        메인
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-white/80 text-xs line-clamp-2 mb-4">{video.description}</p>
                  <div className="flex justify-end space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(video)}
                      className="border-white/20 text-white hover:bg-white/10 h-8 px-2"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDelete(video.id)}
                      disabled={deleteVideoMutation.isPending}
                      className="border-white/20 text-red-300 hover:bg-red-500/10 h-8 px-2"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {videos.length === 0 && (
          <Card className="bg-white/10 backdrop-blur-lg border border-white/20 text-center py-12">
            <CardContent>
              <p className="text-white/70 text-lg mb-4">아직 등록된 영상이 없습니다.</p>
              <Button 
                onClick={() => {
                  setEditingVideo(null);
                  resetForm();
                  setIsDialogOpen(true);
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                <Plus className="w-4 h-4 mr-2" />
                첫 번째 영상 추가하기
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
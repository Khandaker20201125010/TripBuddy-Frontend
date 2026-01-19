/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "@/lib/axios";

export interface CreateMediaPostData {
  caption?: string;
  location?: string;
  tags?: string[];
  travelPlanId?: string;
  image: File;
}

export interface CommentData {
  content: string;
  parentId?: string;
}

export interface UpdateMediaPostData {
  caption?: string;
  location?: string;
  tags?: string[];
  image?: File;
}

class MediaService {
  private cacheBuster = Date.now();

  async createMediaPost(data: CreateMediaPostData) {
    const formData = new FormData();
    formData.append("image", data.image);

    if (data.caption) formData.append("caption", data.caption);
    if (data.location) formData.append("location", data.location);
    if (data.tags) formData.append("tags", JSON.stringify(data.tags));
    if (data.travelPlanId) formData.append("travelPlanId", data.travelPlanId);

    const response = await api.post("/media", formData);
    this.cacheBuster = Date.now();
    return response.data;
  }

  async getAllMediaPosts(filters?: {
    searchTerm?: string;
    userId?: string;
    travelPlanId?: string;
    tags?: string[];
    page?: number;
    limit?: number;
  }) {
    const params = new URLSearchParams();

    if (filters?.searchTerm) params.append("searchTerm", filters.searchTerm);
    if (filters?.userId) params.append("userId", filters.userId);
    if (filters?.travelPlanId)
      params.append("travelPlanId", filters.travelPlanId);
    if (filters?.tags?.length) params.append("tags", filters.tags.join(","));
    if (filters?.page) params.append("page", filters.page.toString());
    if (filters?.limit) params.append("limit", filters.limit.toString());

    params.append("_t", this.cacheBuster.toString());

    const response = await api.get(`/media?${params.toString()}`);
    return response.data;
  }

  async getMediaPostById(id: string) {
    const params = new URLSearchParams();
    params.append("_t", this.cacheBuster.toString());

    const response = await api.get(`/media/${id}?${params.toString()}`);
    return response.data;
  }

  async toggleLike(mediaPostId: string) {
    try {
      const response = await api.post(`/media/${mediaPostId}/like`);
      this.cacheBuster = Date.now();
      return response.data;
    } catch (error: any) {
      if (error.response?.data) {
        throw error.response.data;
      }
      throw new Error("Failed to update like. Please try again.");
    }
  }

  async addComment(mediaPostId: string, commentData: CommentData) {
    const response = await api.post(
      `/media/${mediaPostId}/comment`,
      commentData,
    );
    this.cacheBuster = Date.now();
    return response.data;
  }

 async updateComment(mediaPostId: string, commentId: string, data: { content: string }) {
  try {
    console.log(`🔍 Updating comment: postId=${mediaPostId}, commentId=${commentId}`);
    
    const response = await api.patch(
      `/media/${mediaPostId}/comment/${commentId}`, 
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    this.cacheBuster = Date.now();
    return response.data;
  } catch (error: any) {
    console.error("Update comment error:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: `/media/${mediaPostId}/comment/${commentId}`
    });
    throw error;
  }
}

  // Also add the delete method mentioned earlier
  async deleteComment(mediaPostId: string, commentId: string) {
    const response = await api.delete(
      `/media/${mediaPostId}/comment/${commentId}`,
    );
    this.cacheBuster = Date.now();
    return response.data;
  }

 async shareMediaPost(mediaPostId: string) {
  console.log("Sharing media post:", mediaPostId);
  
  try {
    const response = await api.post(`/media/${mediaPostId}/share`);
    this.cacheBuster = Date.now();
    
    console.log("Share response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error sharing post:", error);
    throw error;
  }
}
  async deleteMediaPost(mediaPostId: string) {
    const response = await api.delete(`/media/${mediaPostId}`);
    this.cacheBuster = Date.now();
    return response.data;
  }

  async getUserMediaPosts(userId: string) {
    const params = new URLSearchParams();
    params.append("_t", this.cacheBuster.toString());

    const response = await api.get(
      `/media/user/${userId}?${params.toString()}`,
    );
    return response.data;
  }

  async updateMediaPost(mediaPostId: string, data: UpdateMediaPostData) {
    const formData = new FormData();

    if (data.image) formData.append("image", data.image);
    if (data.caption !== undefined)
      formData.append("caption", data.caption || "");
    if (data.location !== undefined)
      formData.append("location", data.location || "");
    if (data.tags !== undefined)
      formData.append("tags", JSON.stringify(data.tags));

    const response = await api.patch(`/media/${mediaPostId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    this.cacheBuster = Date.now();
    return response.data;
  }
}

export const mediaService = new MediaService();

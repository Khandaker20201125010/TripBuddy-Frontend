import React, { useState } from 'react'
import {
    X,
    Heart,
    MapPin,
    Calendar,
    User,
    Send,
    Trash2,
    Share2,
    Clock,
    Edit2,
    Check,
} from 'lucide-react'

import Image from 'next/image'
import { Photo, PhotoComment } from '@/types/commnunity'
import { ShareModal } from './ShareModal'
interface PhotoDetailModalProps {
    photo: Photo | null
    isOpen: boolean
    onClose: () => void
    onUpdatePhoto: (photoId: string, updates: Partial<Photo>) => void
}
export function PhotoDetailModal({
    photo,
    isOpen,
    onClose,
    onUpdatePhoto,
}: PhotoDetailModalProps) {
    const [isLiked, setIsLiked] = useState(photo?.isLiked || false)
    const [likes, setLikes] = useState(photo?.likes || 0)
    const [comments, setComments] = useState<PhotoComment[]>(photo?.comments || [])
    const [newComment, setNewComment] = useState('')
    const [isShareModalOpen, setIsShareModalOpen] = useState(false)
    const [isEditingCaption, setIsEditingCaption] = useState(false)
    const [editedCaption, setEditedCaption] = useState(photo?.caption || '')
    if (!isOpen || !photo) return null
    const handleLike = () => {
        const newIsLiked = !isLiked
        const newLikes = newIsLiked ? likes + 1 : likes - 1
        setIsLiked(newIsLiked)
        setLikes(newLikes)
        onUpdatePhoto(photo.id, {
            isLiked: newIsLiked,
            likes: newLikes,
        })
    }
    const handleAddComment = (e: React.FormEvent) => {
        e.preventDefault()
        if (!newComment.trim()) return
        const comment: PhotoComment = {
            id: Date.now().toString(),
            photoId: photo.id,
            author: 'You',
            authorAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
            content: newComment,
            timestamp: 'Just now',
            likes: 0,
        }
        const updatedComments = [...comments, comment]
        setComments(updatedComments)
        onUpdatePhoto(photo.id, {
            comments: updatedComments,
        })
        setNewComment('')
    }
    const handleDeleteComment = (commentId: string) => {
        const updatedComments = comments.filter((c) => c.id !== commentId)
        setComments(updatedComments)
        onUpdatePhoto(photo.id, {
            comments: updatedComments,
        })
    }
    const handleShare = () => {
        const newShares = (photo.shares || 0) + 1
        onUpdatePhoto(photo.id, {
            shares: newShares,
        })
        setIsShareModalOpen(true)
    }
    const handleSaveCaption = () => {
        onUpdatePhoto(photo.id, {
            caption: editedCaption,
        })
        setIsEditingCaption(false)
    }
    const isOwnPhoto =
        photo.photographer === 'You' || photo.photographer === 'Sarah J.' // Mock check
    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-in zoom-in duration-200">
                    {/* Image Section */}
                    <div className="md:w-3/5 bg-stone-900 flex items-center justify-center relative">
                        <Image
                            width={800}
                            height={600}
                            src={photo.url}
                            alt={photo.tripName}
                            className="max-h-[90vh] w-full object-contain"
                        />
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 backdrop-blur-sm rounded-full text-white transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Details Section */}
                    <div className="md:w-2/5 flex flex-col max-h-[90vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-stone-200">
                            <div className="flex items-center gap-3 mb-4">
                                <Image
                                    width={12}
                                    height={12}
                                    src={photo.photographerAvatar}
                                    alt={photo.photographer}
                                    className="w-12 h-12 rounded-full border-2 border-stone-200"
                                />
                                <div className="flex-1">
                                    <p className="font-bold text-stone-900">
                                        {photo.photographer}
                                    </p>
                                    <div className="flex items-center text-xs text-stone-500 gap-1">
                                        <Clock className="w-3 h-3" />
                                        <span>{photo.timestamp}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <h2 className="text-xl font-bold text-stone-900 mb-2">
                                    {photo.tripName}
                                </h2>
                                <div className="flex items-center text-stone-600 text-sm gap-4 mb-3">
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span>{photo.location}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        <span>{photo.date}</span>
                                    </div>
                                </div>

                                {/* Caption Section */}
                                <div className="bg-stone-50 rounded-xl p-3">
                                    {isEditingCaption ? (
                                        <div className="space-y-2">
                                            <textarea
                                                value={editedCaption}
                                                onChange={(e) => setEditedCaption(e.target.value)}
                                                className="w-full px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                                                rows={3}
                                                placeholder="What's on your mind about this trip?"
                                            />
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveCaption}
                                                    className="flex items-center gap-1 px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm hover:bg-orange-600 transition-colors"
                                                >
                                                    <Check className="w-3 h-3" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setIsEditingCaption(false)
                                                        setEditedCaption(photo.caption)
                                                    }}
                                                    className="px-3 py-1.5 text-stone-600 hover:bg-stone-200 rounded-lg text-sm transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-stone-700 text-sm flex-1">
                                                {photo.caption || (
                                                    <span className="text-stone-400 italic">
                                                        No caption added
                                                    </span>
                                                )}
                                            </p>
                                            {isOwnPhoto && (
                                                <button
                                                    onClick={() => setIsEditingCaption(true)}
                                                    className="p-1 hover:bg-stone-200 rounded transition-colors flex-shrink-0"
                                                >
                                                    <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleLike}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all ${isLiked ? 'bg-pink-50 text-pink-600 hover:bg-pink-100' : 'bg-stone-100 text-stone-700 hover:bg-stone-200'}`}
                                >
                                    <Heart
                                        className={`w-5 h-5 ${isLiked ? 'fill-pink-600' : ''}`}
                                    />
                                    <span>{likes}</span>
                                </button>
                                <button
                                    onClick={handleShare}
                                    className="flex items-center gap-2 px-4 py-2 rounded-full bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium transition-all"
                                >
                                    <Share2 className="w-5 h-5" />
                                    <span>{photo.shares || 0}</span>
                                </button>
                            </div>
                        </div>

                        {/* Comments Section */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            <h3 className="font-bold text-stone-900 mb-4">
                                Comments ({comments.length})
                            </h3>

                            {comments.length === 0 ? (
                                <div className="text-center py-8 text-stone-500">
                                    <p>No comments yet. Be the first to share your thoughts!</p>
                                </div>
                            ) : (
                                comments.map((comment) => (
                                    <div key={comment.id} className="flex gap-3 group">
                                        <Image
                                            src={comment.authorAvatar}
                                            alt={comment.author}
                                            width={32}
                                            height={32}
                                            className="w-8 h-8 rounded-full shrink-0"
                                        />
                                        <div className="flex-1">
                                            <div className="bg-stone-50 rounded-2xl px-4 py-3">
                                                <div className="flex items-center justify-between mb-1">
                                                    <p className="font-semibold text-sm text-stone-900">
                                                        {comment.author}
                                                    </p>
                                                    {comment.author === 'You' && (
                                                        <button
                                                            onClick={() => handleDeleteComment(comment.id)}
                                                            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-stone-200 rounded transition-all"
                                                        >
                                                            <Trash2 className="w-3 h-3 text-stone-600" />
                                                        </button>
                                                    )}
                                                </div>
                                                <p className="text-stone-700 text-sm">
                                                    {comment.content}
                                                </p>
                                            </div>
                                            <p className="text-xs text-stone-500 mt-1 ml-4">
                                                {comment.timestamp}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Comment Input */}
                        <form
                            onSubmit={handleAddComment}
                            className="p-6 border-t border-stone-200"
                        >
                            <div className="flex gap-3">
                                <Image
                                    width={10}
                                    height={10}
                                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=You"
                                    alt="You"
                                    className="w-10 h-10 rounded-full shrink-0"
                                />
                                <div className="flex-1 flex gap-2">
                                    <input
                                        type="text"
                                        value={newComment}
                                        onChange={(e) => setNewComment(e.target.value)}
                                        placeholder="Add a comment..."
                                        className="flex-1 px-4 py-2 border border-stone-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!newComment.trim()}
                                        className="p-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                    >
                                        <Send className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                photoTitle={photo.tripName}
                photoUrl={photo.url}
            />
        </>
    )
}

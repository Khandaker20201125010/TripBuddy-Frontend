/* eslint-disable react/no-unescaped-entities */
import React, { useState, useRef, memo } from 'react'
import { Upload, Image as ImageIcon, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

export function PhotoUpload() {
  const [isDragging, setIsDragging] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files && files[0]) {
      handleFile(files[0])
    }
  }
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }
  const handleFile = (file: File) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }
  const clearPreview = () => {
    setPreview(null)
    setCaption('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const handleShare = () => {
    alert(`Photo shared with caption: "${caption || 'No caption'}"`)
    clearPreview()
  }
  return (
    <div className="w-full max-w-2xl mx-auto mb-12">
      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`
            relative group cursor-pointer
            border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300
            ${isDragging ? 'border-orange-500 bg-orange-50 scale-[1.02]' : 'border-stone-300 hover:border-orange-400 hover:bg-stone-50 bg-white'}
          `}
        >
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
          />

          <div className="flex flex-col items-center justify-center space-y-4">
            <div
              className={`
              p-4 rounded-full transition-colors duration-300
              ${isDragging ? 'bg-orange-100 text-orange-600' : 'bg-stone-100 text-stone-500 group-hover:bg-orange-50 group-hover:text-orange-500'}
            `}
            >
              <Upload className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-semibold text-stone-800">
                Drop your travel memories here
              </h3>
              <p className="text-stone-500 text-sm">
                or click to browse from your device
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-400 mt-2">
              <ImageIcon className="w-3 h-3" />
              <span>Supports JPG, PNG, WEBP</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative rounded-3xl overflow-hidden shadow-lg bg-white p-4 animate-in fade-in zoom-in duration-300">
          <div className="relative rounded-2xl overflow-hidden mb-4">
            <Image
             width={500}
              height={300} 
              src={preview}
              alt="Preview"
              className="w-full h-64 object-cover"
            />
            <button
              onClick={(e) => {
                e.stopPropagation()
                clearPreview()
              }}
              className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm hover:bg-white text-stone-700 rounded-full shadow-sm transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-2">
                What's on your mind?
              </label>
              <textarea
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Share your thoughts about this moment..."
                className="w-full px-4 py-3 border border-stone-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                rows={3}
              />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm text-stone-500">
                {caption.length > 0
                  ? `${caption.length} characters`
                  : 'Add a caption to share your story'}
              </span>
              <div className="flex gap-3">
                <Button variant="ghost" size="sm" onClick={clearPreview}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleShare}>
                  Share Photo
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

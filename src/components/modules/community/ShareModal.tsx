
import { Button } from '@/components/ui/button'

import { X, Facebook, Twitter, Link2, Mail, MessageCircle } from 'lucide-react'

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  photoTitle: string
  photoUrl: string
}
export function ShareModal({
  isOpen,
  onClose,
  photoTitle,
  photoUrl,
}: ShareModalProps) {
  if (!isOpen) return null
  const shareUrl = window.location.href
  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl)
    alert('Link copied to clipboard!')
  }
  const shareOptions = [
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () =>
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
          '_blank',
        ),
    },
    {
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-sky-500 hover:bg-sky-600',
      action: () =>
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(photoTitle)}`,
          '_blank',
        ),
    },
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-green-600 hover:bg-green-700',
      action: () =>
        window.open(
          `https://wa.me/?text=${encodeURIComponent(photoTitle + ' ' + shareUrl)}`,
          '_blank',
        ),
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-stone-600 hover:bg-stone-700',
      action: () =>
        (window.location.href = `mailto:?subject=${encodeURIComponent(photoTitle)}&body=${encodeURIComponent(shareUrl)}`),
    },
  ]
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-stone-900">Share this photo</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-stone-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-stone-600" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          {shareOptions.map((option) => (
            <button
              key={option.name}
              onClick={option.action}
              className={`flex items-center justify-center gap-3 p-4 rounded-xl text-white transition-all ${option.color} hover:scale-105 active:scale-95`}
            >
              {option.icon}
              <span className="font-medium">{option.name}</span>
            </button>
          ))}
        </div>

        <div className="pt-4 border-t border-stone-200">
          <label className="block text-sm font-medium text-stone-700 mb-2">
            Or copy link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-4 py-2 border border-stone-300 rounded-lg bg-stone-50 text-stone-600 text-sm"
            />
            <Button onClick={handleCopyLink} variant="secondary" size="md">
              <Link2 className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

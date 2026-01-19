/* eslint-disable @typescript-eslint/no-explicit-any */
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Facebook, 
  Twitter, 
  Link2, 
  Mail, 
  MessageCircle, 
  Copy, 
  Check, 
  Share2,
  Linkedin,
  Send,
  Heart,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  photoTitle: string;
  photoId: string;
  photoImageUrl?: string;
}

export function ShareModal({
  isOpen,
  onClose,
  photoTitle,
  photoId,
  photoImageUrl,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);
  
  // Generate share URL with hash/anchor - handle undefined photoId
  const getShareUrl = () => {
    if (typeof window !== 'undefined' && photoId && photoId.trim() !== '') {
      // Share the community page with photo ID in hash
      return `${window.location.origin}/community#photo-${photoId}`;
    }
    return '';
  };
  
  const shareUrl = getShareUrl();
  
  const handleCopyLink = () => {
    if (!shareUrl) {
      toast.error("Cannot generate share link - missing photo information");
      return;
    }
    
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success("✨ Link copied to clipboard!");
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  
  const shareOptions = [
    {
      id: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      gradient: 'from-blue-600 to-blue-800',
      hoverGradient: 'from-blue-700 to-blue-900',
      action: () => {
        const shareText = `Check out this travel photo: ${photoTitle || 'Travel Photo'}`;
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(shareText)}`,
          '_blank'
        );
        toast.success("Opening Facebook...");
      }
    },
    {
      id: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      gradient: 'from-sky-500 to-blue-600',
      hoverGradient: 'from-sky-600 to-blue-700',
      action: () => {
        const tweetText = `Check out this amazing travel photo: ${photoTitle || 'Travel Photo'}\n\n${shareUrl}`;
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`,
          '_blank'
        );
        toast.success("🐦 Sharing on Twitter...");
      }
    },
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      gradient: 'from-green-600 to-emerald-700',
      hoverGradient: 'from-green-700 to-emerald-800',
      action: () => {
        const message = `Check out this travel photo: ${photoTitle || 'Travel Photo'}\n\n${shareUrl}`;
        window.open(
          `https://wa.me/?text=${encodeURIComponent(message)}`,
          '_blank'
        );
        toast.success("💚 Sharing on WhatsApp...");
      }
    },
    {
      id: 'telegram',
      name: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      gradient: 'from-blue-500 to-sky-600',
      hoverGradient: 'from-blue-600 to-sky-700',
      action: () => {
        const message = `Check out this travel photo: ${photoTitle || 'Travel Photo'}\n\n${shareUrl}`;
        window.open(
          `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(photoTitle || 'Travel Photo')}`,
          '_blank'
        );
        toast.success("📱 Sharing on Telegram...");
      }
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      gradient: 'from-blue-700 to-blue-900',
      hoverGradient: 'from-blue-800 to-blue-950',
      action: () => {
        const linkedinText = `Check out this travel photo: ${photoTitle || 'Travel Photo'}`;
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}&summary=${encodeURIComponent(linkedinText)}`,
          '_blank'
        );
        toast.success("💼 Sharing on LinkedIn...");
      }
    },
    {
      id: 'email',
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      gradient: 'from-orange-500 to-red-600',
      hoverGradient: 'from-orange-600 to-red-700',
      action: () => {
        const subject = `Check out this travel photo: ${photoTitle || 'Travel Photo'}`;
        const body = `I found this amazing travel photo and thought you'd like it:\n\n${photoTitle || 'Travel Photo'}\n\nView it here: ${shareUrl}`;
        window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        toast.success("📧 Opening email client...");
      }
    },
  ];
  
  const handleEmbedCode = () => {
    const embedCode = `<a href="${shareUrl}" target="_blank" rel="noopener noreferrer">${photoTitle || 'Travel Photo'}</a>`;
    navigator.clipboard.writeText(embedCode);
    toast.success("Embed code copied!");
  };
  
  // Fix the issue by checking if photoId exists and is not empty
  const displayPhotoId = photoId && photoId.trim() !== '' 
    ? `photo-${photoId.slice(0, 8)}...` 
    : 'No photo ID';
  
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-md"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-[61] -translate-x-1/2 -translate-y-1/2 w-full max-w-md p-4"
          >
            <div className="bg-white rounded-3xl shadow-2xl shadow-black/20 overflow-hidden border border-stone-200">
              {/* Header */}
              <div className="relative p-8 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent" />
                
                <div className="relative z-10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">Share this Photo</h3>
                      <p className="text-white/90 text-sm mt-1">
                        Share with friends and fellow travelers
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ rotate: 90, scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 opacity-20">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute bottom-4 left-4 opacity-20">
                  <Heart className="w-6 h-6 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                {/* Photo Info */}
                <div className="mb-8 p-4 bg-gradient-to-r from-orange-50 to-pink-50 rounded-2xl border border-orange-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-stone-600 mb-1">Sharing Photo</p>
                      <p className="font-bold text-stone-900 line-clamp-2">
                        {photoTitle || "Travel Photo"}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-stone-600 mb-1">Share Link</p>
                      <p className="text-xs text-stone-500 font-medium truncate max-w-[120px]">
                        {displayPhotoId}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Share Options - Only show if we have a share URL */}
                {shareUrl ? (
                  <>
                    <div className="mb-8">
                      <h4 className="text-sm font-semibold text-stone-700 mb-4 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-orange-500" />
                        Share via
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {shareOptions.map((option) => (
                          <motion.button
                            key={option.id}
                            whileHover={{ scale: 1.05, y: -2 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={option.action}
                            className={`
                              relative group flex flex-col items-center justify-center gap-3 p-4 
                              rounded-2xl text-white transition-all duration-300
                              bg-gradient-to-br ${option.gradient}
                              hover:bg-gradient-to-br ${option.hoverGradient}
                              shadow-lg hover:shadow-xl
                            `}
                          >
                            <div className="p-2 rounded-lg bg-white/20 backdrop-blur-sm">
                              {option.icon}
                            </div>
                            <span className="font-medium text-sm">{option.name}</span>
                            
                            {/* Hover effect */}
                            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 rounded-2xl transition-colors" />
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    {/* Copy Link Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
                          <Link2 className="w-4 h-4 text-orange-500" />
                          Share Link
                        </h4>
                        <button
                          onClick={handleEmbedCode}
                          className="text-xs font-medium text-orange-600 hover:text-orange-800 transition-colors"
                        >
                          Get embed code
                        </button>
                      </div>
                      
                      <div className="flex gap-3">
                        <div className="flex-1 relative group">
                          <input
                            type="text"
                            readOnly
                            value={shareUrl}
                            className="w-full px-4 py-3 border border-stone-200 rounded-xl bg-stone-50 text-stone-600 text-sm pr-12 hover:bg-stone-100 transition-colors"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Link2 className="w-4 h-4 text-stone-400" />
                          </div>
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCopyLink}
                          className={`
                            px-6 py-3 rounded-xl font-medium flex items-center gap-2 min-w-[100px] justify-center
                            ${copied 
                              ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' 
                              : 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-lg'
                            }
                          `}
                        >
                          {copied ? (
                            <>
                              <Check className="w-5 h-5" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-5 h-5" />
                              Copy
                            </>
                          )}
                        </motion.button>
                      </div>
                      
                      {/* Note about how sharing works */}
                      <div className="pt-4 border-t border-stone-100">
                        <p className="text-xs text-stone-500 text-center">
                          📍 Shares link to the Community page with this photo highlighted
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  // Show error message if no photoId
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-orange-100 to-pink-100 flex items-center justify-center">
                      <X className="w-8 h-8 text-orange-500" />
                    </div>
                    <h4 className="text-lg font-bold text-stone-900 mb-2">
                      Unable to Generate Share Link
                    </h4>
                    <p className="text-stone-600 mb-4">
                      {photoId ? 
                        "The photo information is incomplete. Please try refreshing the page." :
                        "No photo selected. Please select a photo to share."
                      }
                    </p>
                    <p className="text-sm text-stone-500 mb-4">
                      Photo ID: {photoId || "Not available"}
                    </p>
                    <button
                      onClick={onClose}
                      className="px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-full font-medium hover:shadow-lg"
                    >
                      Close
                    </button>
                  </div>
                )}
              </div>
              
              {/* Footer - Only show if we have share URL */}
              {shareUrl && (
                <div className="p-6 border-t border-stone-100 bg-gradient-to-r from-stone-50 to-white">
                  <div className="text-center">
                    <p className="text-sm text-stone-600">
                      Every share inspires a new adventure 🚀
                    </p>
                    <p className="text-xs text-stone-500 mt-1">
                      Help this travel story reach more explorers
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
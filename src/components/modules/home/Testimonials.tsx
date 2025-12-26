/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { useRef, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { StarIcon, QuoteIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

// Swiper Imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

// Swiper Styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

export function Testimonials() {
    const [reviews, setReviews] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const fetchTestimonials = async () => {
            try {
                // Removed the limit=3 to let the slider show all reviews
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/review?sortBy=createdAt&sortOrder=desc`)
                const result = await response.json()
                if (result.success) {
                    setReviews(result.data)
                }
            } catch (error) {
                console.error("Error loading testimonials:", error)
            } finally {
                setIsLoading(false)
            }
        }
        fetchTestimonials()
    }, [])
    if (!mounted) return null

    return (
        <section className="py-24 bg-slate-50 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Adventures Made Together</h2>
                    <p className="text-gray-500 text-lg">Real stories from our global travel community</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center h-64 items-center">
                        <Loader2 className="animate-spin text-orange-500 w-10 h-10" />
                    </div>
                ) : reviews.length > 0 ? (
                    <div className="relative group">
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={30}
                            slidesPerView={1}
                            autoplay={{ delay: 5000, disableOnInteraction: false }}
                            pagination={{ clickable: true, dynamicBullets: true }}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            breakpoints={{
                                640: { slidesPerView: 1 },
                                768: { slidesPerView: 2 },
                                1024: { slidesPerView: 3 },
                            }}
                            className="pb-16 px-2"
                        >
                            {reviews.map((item) => (
                                <SwiperSlide key={item.id} className="h-full">
                                    <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 relative flex flex-col h-80 transition-all duration-300 hover:shadow-md">
                                        <QuoteIcon className="absolute top-6 right-8 text-orange-50 w-12 h-12 z-0" />

                                        <div className="flex items-center gap-4 mb-6 relative z-10">
                                            <div className="relative w-14 h-14 shrink-0">
                                                <Image
                                                    fill
                                                    src={item.reviewer?.profileImage || `https://ui-avatars.com/api/?name=${item.reviewer?.name || 'User'}&background=random`}
                                                    alt="avatar"
                                                    className="rounded-full object-cover ring-4 ring-slate-50"
                                                />
                                            </div>
                                            {/* Explicitly column-based layout */}
                                            <div className="flex flex-col">
                                                <h4 className="font-bold text-gray-900 text-base leading-none">
                                                    {item.reviewer?.name || "Verified Traveler"}
                                                </h4>
                                                <div className="flex mt-1.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <StarIcon
                                                            key={i}
                                                            size={12}
                                                            className={i < item.rating ? "fill-orange-400 text-orange-400" : "text-gray-200"}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-gray-600 leading-relaxed italic mb-6 grow line-clamp-4 relative z-10">
                                            "{item.content}"
                                        </p>

                                        {item.travelPlan?.destination && (
                                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                                <span className="text-[10px] font-bold text-teal-600 bg-teal-50 px-2 py-1 rounded-md uppercase tracking-wider">
                                                    Trip to {item.travelPlan.destination}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium italic">
                                                    {new Date(item.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <button className="swiper-button-prev-custom absolute -left-5 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-gray-400 hover:text-orange-500 transition-colors hidden xl:block">
                            <ChevronLeft size={24} />
                        </button>
                        <button className="swiper-button-next-custom absolute -right-5 top-1/2 -translate-y-1/2 z-10 bg-white p-3 rounded-full shadow-lg text-gray-400 hover:text-orange-500 transition-colors hidden xl:block">
                            <ChevronRight size={24} />
                        </button>
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                        <p className="text-gray-400 text-lg italic">Be the first to share your travel story!</p>
                    </div>
                )}
            </div>

            {/* Global Swiper Pagination Overrides */}
            <style jsx global>{`
                .swiper-pagination-bullet-active {
                    background: #f97316 !important;
                    width: 24px !important;
                    border-radius: 5px !important;
                }
                .swiper-pagination {
                    bottom: 0 !important;
                }
            `}</style>
        </section>
    )
}
"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import "swiper/css"
import "swiper/css/navigation"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

const Review = () => {
  const [currentSlide, setCurrentSlide] = useState(1)
  const [totalSlides, setTotalSlides] = useState(8)
  const swiperRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  const [data, setData] = useState(null)

  const defaultReviews = [
    {
      id: 1,
      authorName: "Sarah Amin",
      authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786",
      position: "Marketing Manager",
      description: "Working with Shahriar was a great experience. The designs were clean, professional, and on-brand.",
      company: "GreenTech Solutions",
      companyLogo: "GREENTECH",
      rating: 5,
    },
    {
      id: 2,
      authorName: "James Patel",
      authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e",
      position: "Founder & CEO",
      description: "The branding and UI Shahriar delivered helped us increase customer trust.",
      company: "StartupNest",
      companyLogo: "Sotheby's",
      rating: 5,
    }
  ]

  useEffect(() => {
    // Fetch Review Data
    fetch("/api/content/reviews")
      .then(res => res.json())
      .then(json => {
        if (json.data && Object.keys(json.data).length > 0) {
          setData(json.data)
          if (json.data.reviewsList) {
             setTotalSlides(json.data.reviewsList.length)
          }
        }
      })
      .catch(err => console.error(err))

    const title = titleRef.current

    // Title entrance animation
    gsap.fromTo(
      title,
      { opacity: 0, y: 100 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: title,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      },
    )

    // Cards stagger animation
    gsap.fromTo(
      cardsRef.current,
      { opacity: 0, y: 80, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".reviews-container",
          start: "top 70%",
          toggleActions: "play none none reverse",
        },
      },
    )

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const handleSlideChange = (swiper) => {
    setCurrentSlide(swiper.activeIndex + 1)
    // Animate active card
    const activeCard = cardsRef.current[swiper.activeIndex]
    if (activeCard) {
      gsap.fromTo(
        activeCard,
        { scale: 0.95, opacity: 0.8 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "power2.out" },
      )
    }
  }

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <svg
        key={index}
        className={`w-3 h-3 sm:w-4 sm:h-4 ${index < rating ? "text-pink-400" : "text-gray-300"}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ))
  }

  return (
    <section className="relative bg-gradient-to-br from-[#FFE2F4] via-[#FFE6DC] to-[#FFE2F4] py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 rounded-4xl">
      <div className="pl-3 sm:pl-4 md:pl-6 lg:pl-8 xl:pl-10 pr-0">
        {/* Section Title */}
        <div className="container mx-auto mb-6 sm:mb-8 md:mb-12 lg:mb-16 xl:mb-20">
          <h2
            ref={titleRef}
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-[84px] font-bold text-[#0B1838] leading-tight max-w-5xl px-2 sm:px-0"
          >
            {data?.title || <>Trusted By Top<br />Companies Nationwide</>}
          </h2>
          {data?.subtitle && <p className="text-gray-600 mt-4 text-lg">{data.subtitle}</p>}
        </div>

        {/* Reviews Slider */}
        <div className="reviews-container relative">
          <div className="pl-1 sm:pl-2 md:pl-4 lg:pl-8 xl:pl-14 2xl:pl-40">
            <Swiper
              ref={swiperRef}
              modules={[Navigation, Autoplay]}
              spaceBetween={12}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              onSlideChange={handleSlideChange}
              breakpoints={{
                320: {
                  slidesPerView: 1,
                  spaceBetween: 12,
                },
                480: {
                  slidesPerView: 1.2,
                  spaceBetween: 15,
                },
                640: {
                  slidesPerView: 1.5,
                  spaceBetween: 18,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 20,
                },
                1024: {
                  slidesPerView: 2.5,
                  spaceBetween: 25,
                },
                1280: {
                  slidesPerView: 3.5,
                  spaceBetween: 28,
                },
                1536: {
                  slidesPerView: 4,
                  spaceBetween: 30,
                },
                1920: {
                  slidesPerView: 4.5,
                  spaceBetween: 32,
                },
              }}
              className="reviews-swiper pb-6 sm:pb-8 md:pb-12 lg:pb-16"
              navigation={{
                nextEl: ".review-next",
                prevEl: ".review-prev",
              }}
            >
              {(data?.reviewsList || defaultReviews).map((review, index) => (
                <SwiperSlide key={index}>
                  <div
                    ref={(el) => (cardsRef.current[index] = el)}
                    className="bg-white rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-lg hover:shadow-xl transition-all duration-300 h-[260px] sm:h-[280px] md:h-[300px] lg:h-[320px] xl:h-[340px] flex flex-col"
                  >
                    {/* Author Info */}
                    <div className="flex items-center mb-3 sm:mb-4">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-full overflow-hidden mr-3 sm:mr-4 flex-shrink-0 bg-gray-100 flex items-center justify-center">
                        {review.imageUrl || review.authorImage ? (
                          <Image
                            src={review.imageUrl || review.authorImage}
                            alt={review.name || review.authorName || "User"}
                            fill
                            className="object-cover"
                            sizes="(max-width: 640px) 40px, (max-width: 768px) 48px, 56px"
                          />
                        ) : (
                           <span className="text-xs text-gray-400">User</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-sm md:text-base truncate">
                          {review.name || review.authorName}
                        </h4>
                        <p className="text-gray-600 text-xs sm:text-sm truncate">{review.role || review.position}</p>
                      </div>
                    </div>

                    {/* Review Text */}
                    <div className="mb-4 sm:mb-6 flex-grow">
                      <p className="text-gray-700 text-xs sm:text-sm md:text-base leading-relaxed line-clamp-3 sm:line-clamp-4 md:line-clamp-5">
                        {review.comment || review.description}
                      </p>
                    </div>

                    {/* Company Logo with Stars */}
                    <div className="border-t pt-3 sm:pt-4 mt-auto">
                      <div className="flex items-center justify-between">
                        <div className="text-xs sm:text-sm font-bold text-gray-800 uppercase tracking-wider truncate flex-1 mr-2">
                          {review.companyLogo || (review.role && review.role.split(" ").slice(-1)[0]) || "CLIENT"}
                        </div>
                        <div className="flex space-x-1 flex-shrink-0">{renderStars(review.rating || 5)}</div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* Navigation Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 md:mt-8 lg:mt-10 container mx-auto gap-3 sm:gap-4 px-3 sm:px-4">
            {/* Progress Indicator */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 order-2 sm:order-1 w-full sm:w-auto">
              <div className="text-sm sm:text-base md:text-lg font-semibold text-[#1a365d] flex-shrink-0">
                {String(currentSlide).padStart(2, "0")}/{String(totalSlides).padStart(2, "0")}
              </div>
              <div className="flex-1 sm:w-20 md:w-32 lg:w-48 xl:w-64 2xl:w-[70rem] h-1 bg-gray-300 rounded-full overflow-hidden">
                <div
                  className="h-full bg-pink-400 transition-all duration-300 ease-out"
                  style={{ width: `${(currentSlide / totalSlides) * 100}%` }}
                />
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4 order-1 sm:order-2 flex-shrink-0">
              <button className="review-prev w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 hover:text-pink-500 transition-all duration-300">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button className="review-next w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 bg-white rounded-full shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 hover:text-pink-500 transition-all duration-300">
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <button className="bg-white py-1.5 px-3 sm:py-2 sm:px-4 md:px-6 rounded-full text-[#E436A2] font-medium text-xs sm:text-sm hover:text-pink-600 transition-colors duration-300">
                View All
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Review

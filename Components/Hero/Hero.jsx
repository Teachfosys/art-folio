"use client"
import { gsap } from "gsap"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import "swiper/css"
import "swiper/css/autoplay"
import "swiper/css/pagination"
import { Autoplay, Pagination } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"
import MarqueeSlide from "../Marquee/Marquee"

export default function Hero() {
  const [heroData, setHeroData] = useState(null)
  
  const h1Ref = useRef(null)
  const h2Ref = useRef(null)
  const pRef = useRef(null)
  const sliderRef = useRef(null)

  const defaultImages = [
    { id: 1, url: "https://images.unsplash.com/photo-1506744038136-46273834b3fb" },
    { id: 2, url: "https://images.unsplash.com/photo-1593642634367-d91a135587b5" },
    { id: 3, url: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f" },
  ]

  const displayImages = heroData?.imageUrl 
    ? [{ id: 0, url: heroData.imageUrl }, ...defaultImages] 
    : defaultImages;

  useEffect(() => {
    // Fetch dynamic content
    fetch("/api/content/hero")
      .then(res => res.json())
      .then(json => {
        if (json.data && Object.keys(json.data).length > 0) {
          setHeroData(json.data)
        }
      })
      .catch(err => console.error("Failed to fetch hero data:", err))

    const h1 = h1Ref.current
    const h2 = h2Ref.current
    const p = pRef.current
    const slider = sliderRef.current

    if (!h1 || !h2 || !p || !slider) return

    // Set initial states - hidden
    gsap.set([h1, h2, p, slider], {
      opacity: 0,
      y: 100,
      scale: 0.8,
    })

    // Create entrance timeline
    const tl = gsap.timeline({ delay: 0.5 })

    // Animate H1 first
    tl.to(h1, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 1.2,
      ease: "power3.out",
    })

    // Animate H2
    tl.to(
      h2,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.8", // Start 0.8s before previous animation ends
    )

    // Animate paragraph
    tl.to(
      p,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        ease: "power3.out",
      },
      "-=0.6",
    )

    // Animate slider
    tl.to(
      slider,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
      },
      "-=0.4",
    )

    // Add floating animation for slider after entrance
    tl.to(slider, {
      y: -10,
      duration: 3,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })

    return () => {
      tl.kill()
    }
  }, [])

  return (
    <main className="relative">
      <section
        id="home"
        className="bg-cover bg-center mx-0 mt-0 md:mx-5 md:mt-5 rounded-t-2xl overflow-hidden"
        style={{ backgroundImage: `url('/home_bg.svg')` }}
      >
        {/* Heading Section */}
        <div className="flex flex-col justify-center items-center pt-40 text-center px-4">
          <h1 ref={h1Ref} className="text-4xl sm:text-5xl md:text-[88px] text-black font-medium leading-tight">
            {heroData?.title || <>It's <span className="text-[#E436A2] bg-white px-7 py-5 rounded-full inline-block">Humaira</span></>}
          </h1>

          <h2 ref={h2Ref} className="text-3xl sm:text-4xl md:text-[88px] text-black font-normal leading-tight mt-5">
            {heroData?.subtitle || "Your Vision, My Design"}
          </h2>

          <div className="flex justify-center">
            <p
              ref={pRef}
              className="text-base sm:text-[17px] md:text-[18px] text-[#343434] mt-6 w-full md:w-[90%] lg:w-[75%] xl:w-[51%] max-w-full text-center"
            >
              {heroData?.description || "With 4 years of experience, I design impactful brand identities that combine creativity and strategy. I craft logos, visuals, and systems that help businesses stand out with clarity, purpose, and style."}
            </p>
          </div>
        </div>

        {/* Image Slider - Mobile Responsive */}
        <div className="flex justify-center mt-8 md:mt-12 px-2 md:px-4">
          <div
            ref={sliderRef}
            className="bg-white rounded-2xl md:rounded-3xl p-2 md:p-4 shadow-lg w-full max-w-7xl h-[250px] sm:h-[300px] md:h-[400px] lg:h-[500px] xl:h-[70vh]"
          >
            <Swiper
              pagination={{
                clickable: true,
                bulletClass: "swiper-pagination-bullet",
                bulletActiveClass: "swiper-pagination-bullet-active",
              }}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              loop={true}
              modules={[Pagination, Autoplay]}
              className="mySwiper rounded-xl md:rounded-2xl h-full w-full"
              style={{
                "--swiper-pagination-color": "#E436A2",
                "--swiper-pagination-bullet-inactive-color": "#999999",
                "--swiper-pagination-bullet-inactive-opacity": "1",
                "--swiper-pagination-bullet-size": "6px",
                "--swiper-pagination-bullet-horizontal-gap": "4px",
              }}
            >
              {displayImages.map((image) => (
                <SwiperSlide key={image.id}>
                  <div className="relative w-full h-full">
                    <Image
                      src={image.url || "/placeholder.svg"}
                      alt={`Portfolio image ${image.id}`}
                      fill
                      
                      className="object-cover rounded-xl md:rounded-2xl"
                      sizes="(max-width: 640px) 95vw, (max-width: 768px) 90vw, (max-width: 1200px) 80vw, 70vw"
                      priority={image.id === 1}
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      {/* Marquee Overlapping Bottom of Slider - Mobile Responsive */}
      <div className="absolute -bottom-8 sm:-bottom-12 md:-bottom-16 lg:-bottom-10 xl:-bottom-10 left-0 right-0 rotate-[-1deg] sm:rotate-[-1.5deg] md:rotate-[-2deg] z-20 overflow-hidden">
        <div className="w-[110%] -ml-[5%]">
          <MarqueeSlide />
        </div>
      </div>
    </main>
  )
}

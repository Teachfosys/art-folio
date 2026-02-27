"use client"
import { gsap } from "gsap"
import Image from "next/image"
import { useEffect, useRef, useState } from "react"
import "swiper/css"
import "swiper/css/navigation"
import { Autoplay, Navigation } from "swiper/modules"
import { Swiper, SwiperSlide } from "swiper/react"

const CaseStudies = () => {
    const [data, setData] = useState(null)
    const buttonRef = useRef(null)
    const titleRef = useRef(null)
    const subtitleRef = useRef(null)

    // Fallback static data
    const Case = [
        {
            id: 1,
            title: "Logo & Branding for LuxeHair",
            category: "Beauty & Wellness",
            description: "Developed a luxurious and modern logo along with complete brand identity for LuxeHair.",
            image: "https://images.unsplash.com/photo-1609921212029-bb5a28e60960",
            bgColor: "bg-[#B8E6B8]", // Light green
        },
        {
            id: 2,
            title: "Social Campaign for EcoWorld",
            category: "Environmental NGO",
            description: "Designed visually compelling graphics for a 3-month awareness campaign on social media.",
            image: "https://images.unsplash.com/photo-1626785774625-ddcddc3445e9",
            bgColor: "bg-[#F4C2C2]", // Light pink
        }
    ]


    useEffect(() => {
        // Fetch specific data
        fetch("/api/content/casestudies")
            .then(res => res.json())
            .then(json => {
                if (json.data && Object.keys(json.data).length > 0) {
                    setData(json.data)
                }
            })
            .catch(err => console.error(err))

        const button = buttonRef.current
        const title = titleRef.current
        const subtitle = subtitleRef.current

        // Initial animations
        gsap.fromTo(title, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.2 })

        gsap.fromTo(subtitle, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out", delay: 0.4 })

        gsap.fromTo(
            button,
            { opacity: 0, scale: 0.8 },
            { opacity: 1, scale: 1, duration: 0.8, ease: "back.out(1.7)", delay: 0.6 },
        )

        // Button hover animations
        const handleMouseEnter = () => {
            gsap.to(button, {
                scale: 1.05,
                backgroundColor: "#E436A2",
                color: "#ffffff",
                duration: 0.3,
                ease: "power2.out",
            })
        }

        const handleMouseLeave = () => {
            gsap.to(button, {
                scale: 1,
                backgroundColor: "#FFD4EF",
                color: "#E436A2",
                duration: 0.3,
                ease: "power2.out",
            })
        }

        button.addEventListener("mouseenter", handleMouseEnter)
        button.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            button.removeEventListener("mouseenter", handleMouseEnter)
            button.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [])

    return (
        <section id="portfolio" className="relative min-h-screen">
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[70%] bg-gradient-to-b from-[#FBF6FA] to-[#FEFDFE] pointer-events-none z-0" />

            {/* Main Content */}
            <div className="relative z-10 container mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center py-12 md:py-20 px-4 md:px-5 gap-8 lg:gap-0">
                    {/* Section Title */}
                        <div>
                            <h2 ref={titleRef} className="text-4xl md:text-6xl lg:text-[84px] font-normal leading-tight text-gray-900">
                                {data?.title || <>Real Case<br /><span className="text-[#E436A2]">Studies</span></>}
                            </h2>
                        </div>
                    
                    {/* Right Content */}
                    <div className="max-w-lg">
                        <h3 ref={subtitleRef} className="text-xl md:text-2xl font-normal text-black leading-relaxed mb-6">
                            {data?.subtitle || <>We've helped thousands of students launch <br className="hidden md:block" /> and scale their online stores</>}
                        </h3>
                        <button
                            ref={buttonRef}
                            className="bg-[#FFD4EF] py-4 px-8 text-[#E436A2] font-medium text-[18px] rounded-full transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                            Schedule a meeting
                        </button>
                    </div>
                </div>
            </div>

            {/* Case Studies Slider */}
            <div className="relative z-10 px-4 lg:px-0 pb-20">
                <Swiper
                    modules={[Navigation, Autoplay]}
                    spaceBetween={20}
                    slidesPerView={1}
                    navigation={{
                        nextEl: ".case-study-next",
                        prevEl: ".case-study-prev",
                    }}
                    autoplay={{
                        delay: 4000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                    }}
                    loop={true}
                    breakpoints={{
                        640: {
                            slidesPerView: 1.5,
                            spaceBetween: 20,
                        },
                        768: {
                            slidesPerView: 2,
                            spaceBetween: 25,
                        },
                        1024: {
                            slidesPerView: 2,
                            spaceBetween: 30,
                        },
                        1280: {
                            slidesPerView: 4.5,
                            spaceBetween: 30,
                        },
                    }}
                    className="case-studies-swiper"
                >
                    {(data?.projects || Case).map((caseStudy, index) => {
                        const bgColors = ["bg-[#B8E6B8]", "bg-[#F4C2C2]", "bg-[#A8D8EA]", "bg-[#FFE135]", "bg-[#D4A5D4]"];
                        const blockBg = bgColors[index % bgColors.length];
                        
                        return (
                        <SwiperSlide key={index} className="py-8">
                            <div
                                className={`group ${blockBg} rounded-[40px] p-6 h-[500px] md:h-[600px] relative overflow-hidden transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-pointer `}
                            >
                                {/* Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <h3 className="text-black text-xl md:text-2xl font-semibold leading-tight max-w-[70%]">
                                        {(caseStudy.name || caseStudy.title).split(" ").slice(0, 3).join(" ")}
                                        <br />
                                        {caseStudy.category || "Case Study"}
                                    </h3>
                                    <button className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-300">
                                        View Full
                                    </button>
                                </div>

                                {/* Image Container */}
                                <div className="relative h-[350px] md:h-[420px] rounded-[30px] overflow-hidden">
                                    <Image
                                        src={caseStudy.imageUrl || caseStudy.image || "/placeholder.svg"}
                                        alt={caseStudy.name || caseStudy.title}
                                        fill
                                        
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 25vw"
                                    />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full">
                                            <span className="text-black font-semibold">View Project</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                                    <div className="absolute top-4 right-4 w-8 h-8 bg-white/30 rounded-full blur-sm group-hover:scale-150 transition-transform duration-500" />
                                    <div className="absolute bottom-8 left-6 w-6 h-6 bg-white/20 rounded-full blur-sm group-hover:scale-125 transition-transform duration-500" />
                                </div>
                            </div>
                        </SwiperSlide>
                    )})}
                </Swiper>
            </div>
        </section>
    )
}

export default CaseStudies

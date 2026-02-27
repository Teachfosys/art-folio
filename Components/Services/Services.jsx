"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

const Services = () => {
  const [data, setData] = useState(null)
  const titleRef = useRef(null)

  // Default fallback data if API is empty
  const defaultServices = [
    { name: "Logo Design", desc: "Crafting unique and memorable logos that represent your brand.", icon: "🖋️" },
    { name: "Brand Identity", desc: "Complete branding solutions including color palette and typography.", icon: "🎨" },
    { name: "Social Media Design", desc: "Eye-catching social media graphics for Instagram, Facebook.", icon: "📱" },
    { name: "Business Card Design", desc: "Professional and elegant business card layouts.", icon: "💼" },
    { name: "Poster & Flyer Design", desc: "Attractive posters and flyers for events and campaigns.", icon: "📄" },
    { name: "UI/UX Design", desc: "User-friendly and modern UI designs for web and apps.", icon: "🧩" },
  ]

  useEffect(() => {
    // Fetch Dynamic Data
    fetch("/api/content/services")
      .then(res => res.json())
      .then(json => {
        if (json.data && Object.keys(json.data).length > 0) {
          setData(json.data)
        }
      })
      .catch(err => console.error(err))

    const title = titleRef.current

    // Set initial state for title
    gsap.set(title, { y: 100, opacity: 0 })

    // Animate title
    gsap.to(title, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
      scrollTrigger: {
        trigger: title,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
    })

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  return (
    <section id="services" className="relative min-h-screen">
      {/* Gradient Overlay */}
      <div className="absolute top-0 left-0 w-full h-[70%] bg-gradient-to-b from-[#FBF6FA] to-[#FEFDFE] pointer-events-none z-0" />

      {/* Actual Content */}
      <div className="relative z-10 container mx-auto">
        <div className="py-12 md:py-20 px-4 md:px-5">
          {/* Section Title */}
          <div className="mb-16">
            <h2 ref={titleRef} className="text-4xl md:text-6xl lg:text-[84px] font-normal leading-tight text-gray-900">
              {data?.title || <>Our World Class<br /><span className="text-[#E436A2]">Services</span></>}
            </h2>
            {data?.subtitle && <p className="text-gray-600 mt-4 text-lg">{data.subtitle}</p>}
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {(data?.servicesList || defaultServices).map((service, index) => (
              <div
                key={index}
                className={`group relative bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 ${
                  index % 2 === 0 ? "hover:rotate-1" : "hover:-rotate-1"
                }`}
                style={{
                  background:
                    index % 3 === 0
                      ? "linear-gradient(135deg, #ffffff 0%, #f8f9ff 100%)"
                      : index % 3 === 1
                        ? "linear-gradient(135deg, #ffffff 0%, #fff8f8 100%)"
                        : "linear-gradient(135deg, #ffffff 0%, #f8fff8 100%)",
                }}
              >
                {/* Card Number */}
                <div className="absolute top-4 right-6 text-6xl font-bold text-gray-100 group-hover:text-[#E436A2] transition-colors duration-300">
                  {String(index + 1).padStart(2, "0")}
                </div>

                {/* Icon */}
                <div className="mb-6">
                  <div
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl shadow-lg group-hover:scale-110 transition-transform duration-300"
                    style={{
                      backgroundColor:
                        index % 6 === 0
                          ? "#f3dff3"
                          : index % 6 === 1
                            ? "#ceeaf7"
                            : index % 6 === 2
                              ? "#c3f399"
                              : index % 6 === 3
                                ? "#ffd6cc"
                                : index % 6 === 4
                                  ? "#fff2cc"
                                  : "#e6ccff",
                    }}
                  >
                    {service.icon || "✨"}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-4 relative z-10">
                  <h3 className="text-2xl font-bold text-gray-900 group-hover:text-[#E436A2] transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {service.desc}
                  </p>
                </div>

                {/* Hover Arrow */}
                <div className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                  <div className="w-10 h-10 bg-[#E436A2] rounded-full flex items-center justify-center text-white">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-3xl">
                  <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-[#E436A2]/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-500"></div>
                  <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-tr from-[#E436A2]/5 to-transparent rounded-full blur-lg group-hover:scale-125 transition-transform duration-500"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Services;

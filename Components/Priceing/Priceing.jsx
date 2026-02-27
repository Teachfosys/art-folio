"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

const Pricing = () => {
  const [data, setData] = useState(null)
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const cardsRef = useRef([])

  const defaultPlans = [
    {
      packageName: "Starter",
      title: "Quick Launch",
      description: "For businesses that need high-impact, fast launch.",
      idealFor: "Perfect for single landing pages, brand updates, or key one-off projects.",
      cta: "Schedule an intro call",
      included: [
        "Compliance Frameworks (1–2)",
        "Industry-Leading GRC Platform",
        "Maturity Gap Assessment",
        "Fractional CISO Support",
      ],
    },
    {
      packageName: "Pro",
      title: "Growth Mode",
      description: "Designed for scaling teams and growing compliance needs.",
      idealFor: "Ideal for small to mid-sized businesses expanding operations.",
      cta: "Book your strategy session",
      included: [
        "Compliance Frameworks (3–4)",
        "GRC Platform Premium",
        "Full Maturity Assessment",
        "Dedicated Fractional CISO",
      ],
    },
  ]

  useEffect(() => {
    // Fetch Dynamic Data
    fetch("/api/content/pricing")
      .then(res => res.json())
      .then(json => {
        if (json.data && Object.keys(json.data).length > 0) {
          setData(json.data)
        }
      })
      .catch(err => console.error(err))

    const section = sectionRef.current
    const title = titleRef.current
    const cards = cardsRef.current

    // Set initial states
    gsap.set(title, { y: 100, opacity: 0 })
    gsap.set(cards, { y: 80, opacity: 0, scale: 0.9 })

    // Create main timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 70%",
        end: "bottom 20%",
        toggleActions: "play none none reverse",
      },
    })

    // Animate title
    tl.to(title, {
      y: 0,
      opacity: 1,
      duration: 1.2,
      ease: "power3.out",
    })

    // Animate cards with stagger
    tl.to(
      cards,
      {
        y: 0,
        opacity: 1,
        scale: 1,
        duration: 0.8,
        stagger: {
          amount: 0.4,
          from: "start",
        },
        ease: "back.out(1.7)",
      },
      "-=0.6",
    )

    // Cleanup
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const addToRefs = (el) => {
    if (el && !cardsRef.current.includes(el)) {
      cardsRef.current.push(el)
    }
  }

  const getCardStyles = (index) => {
    if (index === 0) {
      // First card - Gradient background
      return {
        background: "bg-gradient-to-br from-[#FE6CBE] via-[#FE7D5F] to-[#FE6CBE]",
        border: "border-transparent",
        accent: "bg-white",
        accentHover: "hover:bg-gray-100",
        accentText: "text-[#FE6CBE]",
        icon: "bg-white/20 text-white",
        textColor: "text-white",
        descriptionColor: "text-white/90",
        idealForBg: "bg-white/20",
        idealForText: "text-white",
        featureText: "text-white/95",
        headingText: "text-white",
      }
    } else {
      // Second card - White background with pink border
      return {
        background: "bg-white",
        border: "border-[#FE6CBE]",
        accent: "bg-[#FE6CBE]",
        accentHover: "hover:bg-[#FE5CAE]",
        accentText: "text-white",
        icon: "bg-[#FE6CBE]/10 text-[#FE6CBE]",
        textColor: "text-gray-900",
        descriptionColor: "text-gray-600",
        idealForBg: "bg-gray-50",
        idealForText: "text-gray-700",
        featureText: "text-gray-700",
        headingText: "text-gray-900",
      }
    }
  }

  return (
    <section ref={sectionRef} className="py-16 md:py-24 px-4 md:px-6 bg-white">
      <div className="container mx-auto max-w-6xl">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-[84px] font-normal leading-tight text-gray-900 mb-6"
          >
            {data?.title ? (
               <span className="text-[#E436A2]">{data.title}</span>
            ) : (
               <span className="text-[#E436A2]">Perfect Plan</span>
            )}
          </h2>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {(data?.plans || defaultPlans).map((plan, index) => {
            const cardStyle = getCardStyles(index)
            const isPopular = index === 1

            return (
              <div
                key={plan.packageName}
                ref={addToRefs}
                className={`relative ${cardStyle.background} ${cardStyle.border} border-2 rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 ${
                  isPopular ? "ring-4 ring-[#E436A2] ring-opacity-20 md:scale-105" : ""
                }`}
              >
                {/* Popular Badge */}
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-[#E436A2] text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Header */}
                <div className="mb-8">
                  <div
                    className={`inline-block ${cardStyle.accent} ${cardStyle.accentText} px-4 py-2 rounded-full text-sm font-semibold mb-4`}
                  >
                    {plan.packageName}
                  </div>
                  <h3 className={`text-2xl font-bold ${cardStyle.headingText} mb-3`}>{plan.title}</h3>
                  <p className={`${cardStyle.descriptionColor} text-sm leading-relaxed`}>{plan.description}</p>
                </div>

                {/* Ideal For */}
                <div className={`mb-6 p-4 ${cardStyle.idealForBg} rounded-2xl`}>
                  <h4 className={`text-xs font-semibold ${cardStyle.textColor} uppercase tracking-wider mb-2`}>
                    Ideal For
                  </h4>
                  <p className={`${cardStyle.idealForText} text-sm leading-relaxed`}>{plan.idealFor}</p>
                </div>

                {/* Features Grid */}
                <div className="mb-8">
                  <h4 className={`text-xs font-semibold ${cardStyle.textColor} uppercase tracking-wider mb-4`}>
                    What's Included
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {plan.included.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center">
                        <div
                          className={`w-6 h-6 ${cardStyle.icon} rounded-full flex items-center justify-center mr-3 flex-shrink-0`}
                        >
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path
                              fillRule="evenodd"
                              d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <span className={`${cardStyle.featureText} text-sm font-medium`}>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <button
                  className={`w-full ${cardStyle.accent} ${cardStyle.accentHover} ${cardStyle.accentText} py-4 px-6 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95`}
                >
                  {plan.cta}
                </button>

                {/* Decorative Corner */}
                <div className="absolute top-6 right-6 w-12 h-12 opacity-10">
                  <div
                    className={`w-full h-full ${index === 0 ? "bg-white" : "bg-[#FE6CBE]"} rounded-full blur-sm`}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Pricing;

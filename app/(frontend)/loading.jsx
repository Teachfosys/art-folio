"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"

const Loader = ({ onComplete }) => {
  const loaderRef = useRef(null)
  const logoRef = useRef(null)
  const progressRef = useRef(null)
  const progressBarRef = useRef(null)
  const dotsRef = useRef([])
  const textRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const loader = loaderRef.current
    const logo = logoRef.current
    const progress = progressRef.current
    const progressBar = progressBarRef.current
    const dots = dotsRef.current
    const text = textRef.current
    const overlay = overlayRef.current

    // Set initial states
    gsap.set(logo, { scale: 0, rotation: -180, opacity: 0 })
    gsap.set(progress, { width: 0 })
    gsap.set(progressBar, { scaleX: 0, transformOrigin: "left center" })
    gsap.set(dots, { scale: 0, opacity: 0 })
    gsap.set(text, { y: 30, opacity: 0 })

    // Create main timeline
    const tl = gsap.timeline({
      onComplete: () => {
        // Exit animation
        gsap.to(overlay, {
          y: "-100%",
          duration: 1,
          ease: "power3.inOut",
          onComplete: () => {
            if (onComplete) onComplete()
          },
        })
      },
    })

    // Logo entrance
    tl.to(logo, {
      scale: 1,
      rotation: 0,
      opacity: 1,
      duration: 1,
      ease: "back.out(1.7)",
    })

    // Text entrance
    tl.to(
      text,
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
      },
      "-=0.5",
    )

    // Dots animation
    tl.to(
      dots,
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        stagger: 0.1,
        ease: "back.out(1.7)",
      },
      "-=0.3",
    )

    // Progress bar animation
    tl.to(
      progressBar,
      {
        scaleX: 1,
        duration: 2,
        ease: "power2.inOut",
      },
      "-=0.2",
    )

    // Progress counter
    tl.to(
      progress,
      {
        width: "100%",
        duration: 2,
        ease: "power2.inOut",
      },
      "<",
    )

    // Animate progress text
    const progressValue = { value: 0 }
    tl.to(
      progressValue,
      {
        value: 100,
        duration: 2,
        ease: "power2.inOut",
        onUpdate: () => {
          if (progress) {
            progress.textContent = `${Math.round(progressValue.value)}%`
          }
        },
      },
      "<",
    )

    // Floating animation for dots
    gsap.to(dots, {
      y: -10,
      duration: 1,
      repeat: -1,
      yoyo: true,
      stagger: 0.2,
      ease: "power2.inOut",
      delay: 1,
    })

    // Logo floating animation
    gsap.to(logo, {
      y: -5,
      duration: 2,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
      delay: 1.5,
    })

    // Cleanup
    return () => {
      tl.kill()
    }
  }, [onComplete])

  const addToDotsRefs = (el) => {
    if (el && !dotsRef.current.includes(el)) {
      dotsRef.current.push(el)
    }
  }

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0">
        {/* Gradient Orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-br from-pink-500/20 to-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/15 to-cyan-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full blur-2xl animate-pulse delay-500"></div>

        {/* Floating Particles */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-pink-400 rounded-full animate-ping"></div>
        <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-ping delay-700"></div>
        <div className="absolute bottom-1/4 left-3/4 w-2 h-2 bg-purple-400 rounded-full animate-ping delay-1000"></div>

        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=40 height=40 viewBox=0 0 40 40 xmlns=http://www.w3.org/2000/svg%3E%3Cg fill=%23ffffff fillOpacity=0.02%3E%3Cpath d=M20 20h20v20H20V20zm-20 0h20v20H0V20z/%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      </div>

       

        {/* Animated Dots */}
        <div className="flex justify-center space-x-3 mb-12">
          {[0, 1, 2, 3, 4].map((index) => (
            <div
              key={index}
              ref={addToDotsRefs}
              className="w-3 h-3 rounded-full"
              style={{
                background:
                  index % 5 === 0
                    ? "linear-gradient(135deg, #ec4899, #8b5cf6)"
                    : index % 5 === 1
                      ? "linear-gradient(135deg, #3b82f6, #06b6d4)"
                      : index % 5 === 2
                        ? "linear-gradient(135deg, #10b981, #34d399)"
                        : index % 5 === 3
                          ? "linear-gradient(135deg, #f59e0b, #f97316)"
                          : "linear-gradient(135deg, #ef4444, #f97316)",
              }}
            />
          ))}
        </div>
      </div>
  )
}

export default Loader

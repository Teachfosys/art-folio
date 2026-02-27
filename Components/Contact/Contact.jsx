"use client"

import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { useEffect, useRef, useState } from "react"

gsap.registerPlugin(ScrollTrigger)

const Contact = () => {
  const [data, setData] = useState(null)
  const sectionRef = useRef(null)
  const titleRef = useRef(null)
  const formRef = useRef(null)
  const infoRef = useRef(null)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    budget: "",
    aboutProject: "",
  })

  useEffect(() => {
    // Fetch Dynamic Data
    fetch("/api/content/contact")
      .then(res => res.json())
      .then(json => {
        if (json.data && Object.keys(json.data).length > 0) {
          setData(json.data)
        }
      })
      .catch(err => console.error(err))

    const section = sectionRef.current
    const title = titleRef.current
    const form = formRef.current
    const info = infoRef.current

    // Set initial states
    gsap.set(title, { y: 100, opacity: 0 })

    // Responsive animation based on screen size
    const mm = gsap.matchMedia()

    mm.add("(min-width: 1024px)", () => {
      // Desktop animations - info from left, form from bottom
      gsap.set(form, { y: 80, opacity: 0 }) // Changed from x: 100 to y: 80
      gsap.set(info, { x: -100, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })

      tl.to(title, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      })

      tl.to(
        info,
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6",
      )

      tl.to(
        form,
        {
          y: 0, // Changed from x: 0 to y: 0
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6",
      )
    })

    mm.add("(max-width: 1023px)", () => {
      // Mobile/Tablet animations - slide from bottom
      gsap.set(form, { y: 80, opacity: 0 })
      gsap.set(info, { y: 80, opacity: 0 })

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          end: "bottom 20%",
          toggleActions: "play none none reverse",
        },
      })

      tl.to(title, {
        y: 0,
        opacity: 1,
        duration: 1.2,
        ease: "power3.out",
      })

      tl.to(
        info,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.6",
      )

      tl.to(
        form,
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power2.out",
        },
        "-=0.4",
      )
    })

    // Cleanup
    return () => {
      mm.revert()
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
    }
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Handle form submission here
  }

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="py-16 md:py-24 px-4 md:px-6 bg-gradient-to-br from-gray-50 to-white"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2
            ref={titleRef}
            className="text-4xl md:text-6xl lg:text-[84px] font-normal leading-tight text-gray-900 mb-6"
          >
            {data?.title || <>Got Ideas?<br /><span className="text-[#E436A2]">Let's hop on a call</span></>}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            {data?.subtitle || "Tell us more about yourself and what you've got in mind"}
          </p>
        </div>

        {/* Contact Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div ref={infoRef} className="space-y-8 order-2 lg:order-1">
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Get In Touch</h3>
              <p className="text-gray-600 leading-relaxed mb-8">
                Have a project in mind? Whether you need a complete brand overhaul, a stunning website, or ongoing
                design support, I'm here to help bring your vision to life.
              </p>
            </div>

            {/* Contact Methods */}
            <div className="space-y-6">
              <div className="flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-[#E436A2] to-[#ff6b9d] rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Email</h4>
                  <p className="text-gray-600">{data?.email || "hello@shahriar.design"}</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Phone</h4>
                  <p className="text-gray-600">{data?.phone || "+880 1234 567890"}</p>
                </div>
              </div>

              <div className="flex items-center group">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Location</h4>
                  <p className="text-gray-600">{data?.location || "Dhaka, Bangladesh"}</p>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Follow Me</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#E436A2] hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#E436A2] hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 hover:bg-[#E436A2] hover:text-white transition-all duration-300 hover:scale-110"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24.009 12.017 24c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div ref={formRef} className="bg-gradient-to-br from-[#F2E6FE] via-[#F9DBE6] to-[#F2E6FE] rounded-3xl p-6 md:p-8 shadow-lg order-1 lg:order-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name*
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#E436A2] focus:border-transparent transition-all duration-300"
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email*
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#E436A2] focus:border-transparent transition-all duration-300"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#E436A2] focus:border-transparent transition-all duration-300"
                    placeholder="+880 1234 567890"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="budget" className="block text-sm font-semibold text-gray-700 mb-2">
                    What is your budget*
                  </label>
                  <select
                    id="budget"
                    name="budget"
                    value={formData.budget}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#E436A2] focus:border-transparent transition-all duration-300"
                    required
                  >
                    <option value="">Select your budget range</option>
                    <option value="under-1k">Under $1,000</option>
                    <option value="1k-5k">$1,000 - $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-25k">$10,000 - $25,000</option>
                    <option value="25k-50k">$25,000 - $50,000</option>
                    <option value="50k-plus">$50,000+</option>
                    <option value="discuss">Let's discuss</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="aboutProject" className="block text-sm font-semibold text-gray-700 mb-2">
                  About Project*
                </label>
                <textarea
                  id="aboutProject"
                  name="aboutProject"
                  value={formData.aboutProject}
                  onChange={handleInputChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-[#E436A2] focus:border-transparent transition-all duration-300 resize-none"
                  placeholder="Tell us about your project, goals, timeline, and any specific requirements..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#E436A2] text-white py-4 px-6 rounded-2xl font-semibold hover:bg-[#d63384] transition-all duration-300 hover:shadow-lg hover:scale-105 active:scale-95"
              >
                Send a message
              </button>
            </form>
          </div>
        </div>

        {/* Map Section */}
        <div className="w-full mt-16 p-4 rounded-3xl overflow-hidden">
          <iframe
            className="w-full h-[300px] md:h-[400px] rounded-3xl border-0"
            src={data?.mapUrl || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.453895552485!2d90.41817497589164!3d23.803566486510575!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c769db015e6f%3A0x5e6aabe0df4a79f7!2sKachari%20Para%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1681234567890!5m2!1sen!2sbd"}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  )
}

export default Contact

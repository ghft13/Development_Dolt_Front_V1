"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import FloatingNavbar from "@/components/floating-navbar"
import Footer from "@/components/footer"
import Link from "next/link"
import ServiceMap from "@/components/service-map"
import ServiceSuggestions from "@/components/service-suggestions"
import ProductCatalog from "@/components/product-catalog"

// ✅ Lucide icons for services
import { Wrench, Plug, Hammer, Paintbrush, Bug, Leaf, Home, Fan, Shield, Shirt, Truck, Heart, Car, House, Calendar, Laptop } from "lucide-react"

// Map service IDs to icons
const iconMap: Record<string, React.ElementType> = {
  plumbing: Wrench,
  electrical: Plug,
  carpentry: Hammer,
  painting: Paintbrush,
  "pest-control": Bug,
  gardening: Leaf,
  renovation: Home,
  hvac: Fan,
  security: Shield,
  laundry: Shirt,
  moving: Truck,
  wellness: Heart,
  vehicle: Car,
  "smart-home": House,
  "event-support": Calendar,
  handyman: Wrench,
  "it-support": Laptop,
}

const Backend_URL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_DEPLOYED_BACKEND_URL
      : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL;

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

 useEffect(() => {
  async function fetchServices() {
    try {
      const { data } = await axios.get(`${Backend_URL}/api/services`)
      const servicesArray = Array.isArray(data) ? data : Array.isArray(data.default) ? data.default : []
      setServices(servicesArray)
    } catch (err: any) {
      console.error("Error fetching services:", err)
      setError("Failed to load services. Please try again later.")
    } finally {
      setLoading(false)
    }
  }

  fetchServices()
}, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading services...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <p className="text-red-600">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <FloatingNavbar />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
              Our <span className="text-[#FF6B35]">Services</span>
            </h1>
            <p className="text-lg text-neutral-600 max-w-3xl mx-auto">
              Professional maintenance solutions powered by IoT technology and expert technicians across Latin America.
            </p>
          </div>

          {/* Service Map */}
          <div className="mb-12">
            <ServiceMap />
          </div>

          {/* Suggestions */}
          <div className="mb-12">
            <ServiceSuggestions />
          </div>

          {/* Services Grid */}
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-8">Available Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
              
                const Icon = iconMap[service.id] || Wrench
                return (
                  <div
                    key={index}
                    className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300"
                  >
                    {/* Icon */}
                    <div className="w-14 h-14 rounded-2xl bg-[#FF6B35]/10 flex items-center justify-center mb-6">
                      <Icon className="text-[#FF6B35] w-7 h-7" />
                    </div>

                    {/* Title & Description */}
                    <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                    <p className="text-neutral-600 mb-4 leading-relaxed">{service.description}</p>

                    {/* Price */}
                    <div className="text-3xl font-bold text-[#FF6B35] mb-4">{service.price}</div>

                    {/* Features */}
                    <ul className="space-y-2 mb-6">
                      {service.features?.map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-center gap-2 text-sm text-neutral-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B35]" />
                          {feature}
                        </li>
                      ))}
                    </ul>

                    {/* Book Button */}
                    <Link
                      href={`/services/${service.id}/book`}
                      className="block w-full text-center px-6 py-3 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105"
                    >
                      Book Now
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Product Catalog */}
          <div className="mb-12">
            <ProductCatalog />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

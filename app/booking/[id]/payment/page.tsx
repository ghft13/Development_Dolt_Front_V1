"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Header from "@/components/header"
import { useAuth } from "@/contexts/auth-context"
import { useBookings } from "@/contexts/booking-context"
import { CreditCard, Building2, Loader2, Smartphone, Wallet, Bitcoin } from "lucide-react"
import PayPalCheckout from "@/components/PayPalCheckout" // <-- import PayPal component

type PaymentGateway = "stripe" | "razorpay" | "gpay" | "paypal" | "crypto"

export default function PaymentPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated } = useAuth()
  const { getBookingById, updateBooking } = useBookings()
  const [booking, setBooking] = useState<ReturnType<typeof getBookingById>>()
  const [selectedGateway, setSelectedGateway] = useState<PaymentGateway>("stripe")
  const [selectedCrypto, setSelectedCrypto] = useState<"bitcoin" | "ethereum">("bitcoin")
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login")
      return
    }

    const bookingData = getBookingById(params.id as string)
    if (!bookingData) {
      router.push("/dashboard/user/bookings")
      return
    }
    setBooking(bookingData)
  }, [isAuthenticated, params.id, router, getBookingById])

  const handleOtherPayments = async () => {
    if (!booking) return
    setIsProcessing(true)
    setError("")

    try {
      // Simulate Stripe, Razorpay, GPay, Crypto
      await new Promise((resolve) => setTimeout(resolve, 2500))
      updateBooking(booking.id, {
        status: "confirmed",
        payment_method: selectedGateway,
        payment_status: "paid",
      })
      router.push(`/booking/${params.id}/success`)
    } catch (err: any) {
      console.error(err)
      setError("Payment failed. Please try again.")
      setIsProcessing(false)
    }
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <Header />

      <main className="pt-24 pb-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">
              Complete <span className="text-[#FF6B35]">Payment</span>
            </h1>
            <p className="text-neutral-600">Choose your preferred payment method</p>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm mb-6">
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">{error}</div>
            )}

            <h2 className="text-xl font-bold mb-6">Select Payment Gateway</h2>

            <div className="space-y-4 mb-8">
              {/* Stripe */}
              <button onClick={() => setSelectedGateway("stripe")} disabled={isProcessing} className={`w-full p-6 rounded-xl border-2 transition-all ${selectedGateway === "stripe" ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-neutral-300 hover:border-neutral-400"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                <div className="flex items-center gap-4">
                  <CreditCard className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Stripe</div>
                    <div className="text-sm text-neutral-600">Credit/Debit Card, Apple Pay, Google Pay</div>
                  </div>
                </div>
              </button>

              {/* Razorpay */}
              <button onClick={() => setSelectedGateway("razorpay")} disabled={isProcessing} className={`w-full p-6 rounded-xl border-2 transition-all ${selectedGateway === "razorpay" ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-neutral-300 hover:border-neutral-400"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                <div className="flex items-center gap-4">
                  <Building2 className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Razorpay</div>
                    <div className="text-sm text-neutral-600">UPI, Cards, Net Banking, Wallets</div>
                  </div>
                </div>
              </button>

              {/* Google Pay */}
              <button onClick={() => setSelectedGateway("gpay")} disabled={isProcessing} className={`w-full p-6 rounded-xl border-2 transition-all ${selectedGateway === "gpay" ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-neutral-300 hover:border-neutral-400"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                <div className="flex items-center gap-4">
                  <Smartphone className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Google Pay</div>
                    <div className="text-sm text-neutral-600">Fast & secure mobile payments</div>
                  </div>
                </div>
              </button>

              {/* PayPal */}
              <button onClick={() => setSelectedGateway("paypal")} disabled={isProcessing} className={`w-full p-6 rounded-xl border-2 transition-all ${selectedGateway === "paypal" ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-neutral-300 hover:border-neutral-400"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                <div className="flex items-center gap-4">
                  <Wallet className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">PayPal</div>
                    <div className="text-sm text-neutral-600">Pay with your PayPal account</div>
                  </div>
                </div>
              </button>

              {/* Cryptocurrency */}
              <button onClick={() => setSelectedGateway("crypto")} disabled={isProcessing} className={`w-full p-6 rounded-xl border-2 transition-all ${selectedGateway === "crypto" ? "border-[#FF6B35] bg-[#FF6B35]/5" : "border-neutral-300 hover:border-neutral-400"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                <div className="flex items-center gap-4">
                  <Bitcoin className="w-8 h-8 text-[#FF6B35]" />
                  <div className="text-left">
                    <div className="font-bold text-lg">Cryptocurrency</div>
                    <div className="text-sm text-neutral-600">Bitcoin, Ethereum, and more</div>
                  </div>
                </div>
              </button>
            </div>
            {/* amount={booking.total_amount + 5} */}

            {/* Pay Button / PayPal */}
            {selectedGateway === "paypal" ? (
              <PayPalCheckout uid={booking.user_id} amount={booking.total_amount}
              bookingId={booking.id}  />
            ) : (
              <button onClick={handleOtherPayments} disabled={isProcessing} className="w-full px-8 py-4 bg-[#FF6B35] text-white font-medium rounded-full transition-all duration-300 hover:bg-[#ff5722] hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                {isProcessing ? "Processing..." : `Pay with ${selectedGateway}`}
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

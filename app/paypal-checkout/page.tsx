"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import PayPalCheckout from "@/components/PayPalCheckout"
import { Loader2 } from "lucide-react"

function PayPalCheckoutContent() {
  const searchParams = useSearchParams()
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [amount, setAmount] = useState<number>(0)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    const id = searchParams.get('bookingId')
    const amt = searchParams.get('amount')
    const uid = searchParams.get('userId')
    
    if (id && amt && uid) {
      setBookingId(id)
      setAmount(parseFloat(amt))
      setUserId(uid)
    } else {
      console.error("Missing required parameters")
      // Send error message to parent window
      if (typeof window !== 'undefined' && window.opener) {
        window.opener.postMessage({
          type: 'PAYPAL_ERROR',
          message: 'Invalid payment parameters'
        }, window.location.origin)
        
        setTimeout(() => {
          window.close()
        }, 2000)
      }
    }
  }, [searchParams])

  if (!bookingId || !userId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF6B35] mx-auto mb-4" />
          <p className="text-neutral-600">Loading PayPal checkout...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-md mx-auto">
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl font-bold mb-2">
            <span className="text-[#FF6B35]">PayPal</span> Checkout
          </h1>
          <p className="text-neutral-600">Complete your payment securely</p>
        </div>

        <div className="bg-white rounded-2xl p-8 shadow-lg">
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex justify-between items-center mb-2">
              <span className="text-neutral-600">Amount:</span>
              <span className="text-xl font-bold text-[#FF6B35]">${amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600 text-sm">Booking ID:</span>
              <span className="text-sm font-mono text-neutral-800">{bookingId}</span>
            </div>
          </div>

          <PayPalCheckout 
            uid={userId} 
            amount={amount}
            bookingId={bookingId}
          />
        </div>

        <div className="text-center mt-6">
          <button 
            onClick={() => window.close()} 
            className="text-neutral-600 hover:text-neutral-800 text-sm underline"
          >
            Cancel and close window
          </button>
        </div>
      </div>
    </div>
  )
}

export default function PayPalCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[#FF6B35] mx-auto mb-4" />
          <p className="text-neutral-600">Loading...</p>
        </div>
      </div>
    }>
      <PayPalCheckoutContent />
    </Suspense>
  )
}
"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

function PayPalCheckout({ uid, amount, bookingId }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

  console.log("🔧 PayPal Config:", {
    uid,
    amount,
    bookingId,
    API_BASE_URL,
    clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 10) + "..."
  });

  return (
    <div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
          <strong>Error:</strong> {error}
        </div>
      )}

      {isProcessing && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Processing payment...</span>
        </div>
      )}
      
      <PayPalScriptProvider 
        options={{ 
          clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
          currency: "USD",
          intent: "capture",
          // Enable debug mode
          "enable-funding": "venmo,paylater",
          "disable-funding": "",
          debug: true
        }}
      >
        <PayPalButtons
          style={{ 
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 55
          }}
          createOrder={async () => {
            console.log("🚀 Step 1: Creating PayPal order...");
            setError("");
            setIsProcessing(true);
            
            try {
              const amountStr = typeof amount === 'number' 
                ? amount.toFixed(2) 
                : parseFloat(amount).toFixed(2);

              console.log("💰 Amount:", amountStr);

              const res = await axios.post(
                `${API_BASE_URL}/paypal/create-order`,
                { amount: amountStr },
                {
                  headers: { 'Content-Type': 'application/json' },
                  timeout: 10000
                }
              );

              if (!res.data?.id) {
                throw new Error("No order ID received from server");
              }

              console.log("✅ Step 1 Complete - Order ID:", res.data.id);
              setIsProcessing(false);
              return res.data.id;
              
            } catch (err) {
              console.error("❌ Step 1 Failed:", err);
              setIsProcessing(false);
              const errorMsg = err.response?.data?.message || err.message || "Failed to create order";
              setError(errorMsg);
              throw err;
            }
          }}
          onApprove={async (data, actions) => {
            console.log("🎉 Step 2: Payment approved! Order ID:", data.orderID);
            console.log("📦 Approval data:", data);
            
            setError("");
            setIsProcessing(true);

            try {
              console.log("📡 Capturing payment...");

              const res = await axios.post(
                `${API_BASE_URL}/paypal/capture-order`,
                { 
                  orderId: data.orderID,
                  uid 
                },
                {
                  headers: { 'Content-Type': 'application/json' },
                  timeout: 10000
                }
              );

              console.log("✅ Step 2 Complete - Payment captured:", res.data);
              setIsProcessing(false);
              
              // Show success message
              alert("✅ Payment successful! Transaction ID: " + data.orderID);
              
              // Redirect if bookingId exists
              if (bookingId) {
                console.log("🔄 Redirecting to success page...");
                router.push(`/booking/${bookingId}/success`);
              }
              
            } catch (err) {
              console.error("❌ Step 2 Failed:", err);
              console.error("Error details:", err.response?.data);
              setIsProcessing(false);
              const errorMsg = err.response?.data?.message || err.message || "Failed to capture payment";
              setError(errorMsg);
              alert("❌ Payment capture failed: " + errorMsg);
            }
          }}
          onError={(err) => {
            console.error("❌ PayPal SDK Error:", err);
            setIsProcessing(false);
            setError("PayPal error occurred. Please try again.");
          }}
          onCancel={(data) => {
            console.log("⚠️ Payment cancelled by user. Order ID:", data?.orderID);
            setIsProcessing(false);
            setError("Payment was cancelled. Please try again when ready.");
          }}
          onClick={(data, actions) => {
            console.log("👆 PayPal button clicked");
            setError("");
            return actions.resolve();
          }}
        />
      </PayPalScriptProvider>

      <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
        <strong>💡 Testing Tips:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Use a PayPal Sandbox test account (not your real account)</li>
          <li>Create test accounts at: developer.paypal.com/dashboard/accounts</li>
          <li>Check the browser console for detailed logs</li>
          <li>Make sure popup blockers are disabled</li>
        </ul>
      </div>
    </div>
  );
}

export default PayPalCheckout;
"use client";

import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

function PayPalCheckout({ uid, amount, bookingId }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const Backend_URL =
    process.env.NODE_ENV === "production"
      ? process.env.NEXT_PUBLIC_DEVELOPMENT_DEPLOYED_BACKEND_URL
      : process.env.NEXT_PUBLIC_DEVELOPMENT_BACKEND_URL;

  // Check if window is popup
  const isPopup =
    typeof window !== "undefined" && window.opener && window.opener !== window;

  console.log("🧠 [PayPalCheckout] Initialized with:", {
    uid,
    amount,
    bookingId,
    Backend_URL,
    isPopup,
    NODE_ENV: process.env.NODE_ENV,
    paypalClientId:
      process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID?.substring(0, 10) + "...",
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
          "enable-funding": "venmo,paylater",
          debug: true,
        }}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color: "gold",
            shape: "rect",
            label: "paypal",
            height: 55,
          }}
          createOrder={async () => {
            console.log("🚀 [createOrder] Starting order creation...");
            setError("");
            setIsProcessing(true);

            try {
              const amountStr =
                typeof amount === "number"
                  ? amount.toFixed(2)
                  : parseFloat(amount).toFixed(2);

              console.log("💰 [createOrder] Final amount:", amountStr);

              const res = await axios.post(
                `${Backend_URL}/paypal/create-order`,
                { amount: amountStr },
                {
                  headers: { "Content-Type": "application/json" },
                  timeout: 15000,
                }
              );

              console.log("✅ [createOrder] Server Response:", res.data);

              if (!res.data?.id) {
                console.error("❌ [createOrder] No order ID received");
                throw new Error("No order ID received from server");
              }

              setIsProcessing(false);
              return res.data.id;
            } catch (err) {
              console.error("🔥 [createOrder] Error details:", {
                message: err.message,
                response: err.response?.data,
                stack: err.stack,
              });

              setIsProcessing(false);
              const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "Failed to create order";
              setError(errorMsg);

              if (isPopup && window.opener) {
                console.log("📨 [createOrder] Sending PAYPAL_ERROR to parent window");
                window.opener.postMessage(
                  { type: "PAYPAL_ERROR", message: errorMsg },
                  window.location.origin
                );
              }
              throw err;
            }
          }}

          onApprove={async (data, actions) => {
            console.log("📦 [onApprove] Received PayPal data:", data);
            setError("");
            setIsProcessing(true);

            try {
              console.log("📡 [onApprove] Capturing payment with backend...");
              const res = await axios.post(
                `${Backend_URL}/paypal/capture-order`,
                { orderId: data.orderID, uid },
                {
                  headers: { "Content-Type": "application/json" },
                  timeout: 15000,
                }
              );

              console.log("✅ [onApprove] Capture Response:", res.data);

              const bookingData = localStorage.getItem("bookingData");
              console.log("🗂️ [onApprove] Local bookingData:", bookingData);

              if (!bookingData) throw new Error("No booking data found");

              const parsedBooking = JSON.parse(bookingData);
              console.log("📤 [onApprove] Sending booking to backend:", parsedBooking);

              const bookingRes = await axios.post(
                `${Backend_URL}/api/bookings/createBooking`,
                parsedBooking,
                { headers: { "Content-Type": "application/json" } }
              );

              console.log("✅ [onApprove] Booking stored successfully:", bookingRes.data);

              localStorage.removeItem("bookingData");
              setIsProcessing(false);

              if (isPopup && window.opener) {
                console.log("📨 [onApprove] Sending PAYPAL_SUCCESS to parent window");
                window.opener.postMessage(
                  {
                    type: "PAYPAL_SUCCESS",
                    bookingId,
                    transactionId: data.orderID,
                  },
                  window.location.origin
                );
                alert("✅ Payment successful! This window will close automatically.");
                setTimeout(() => window.close(), 1500);
              } else {
                alert("✅ Payment successful! Transaction ID: " + data.orderID);
                if (bookingId) {
                  console.log("🔄 [onApprove] Redirecting to:", `/booking/${bookingId}/success`);
                  router.push(`/booking/${bookingId}/success`);
                }
              }
            } catch (err) {
              console.error("🔥 [onApprove] Error details:", {
                message: err.message,
                response: err.response?.data,
                stack: err.stack,
              });

              setIsProcessing(false);
              const errorMsg =
                err.response?.data?.message ||
                err.message ||
                "Failed to process payment or booking";

              setError(errorMsg);

              if (isPopup && window.opener) {
                console.log("📨 [onApprove] Sending PAYPAL_ERROR to parent window");
                window.opener.postMessage(
                  { type: "PAYPAL_ERROR", message: errorMsg },
                  window.location.origin
                );
              }

              alert("❌ Something went wrong: " + errorMsg);
            }
          }}

          onError={(err) => {
            console.error("⚠️ [PayPalButtons] SDK Error:", err);
            setIsProcessing(false);
            const errorMsg = "PayPal error occurred. Please try again.";
            setError(errorMsg);

            if (isPopup && window.opener) {
              console.log("📨 [onError] Sending PAYPAL_ERROR to parent window");
              window.opener.postMessage(
                { type: "PAYPAL_ERROR", message: errorMsg },
                window.location.origin
              );
            }
          }}

          onCancel={(data) => {
            console.log("🚫 [onCancel] Payment cancelled:", data);
            setIsProcessing(false);
            const cancelMsg = "Payment was cancelled by user.";
            setError(cancelMsg);

            if (isPopup && window.opener) {
              console.log("📨 [onCancel] Sending PAYPAL_CANCELLED to parent window");
              window.opener.postMessage(
                { type: "PAYPAL_CANCELLED", message: cancelMsg },
                window.location.origin
              );
            }
          }}

          onClick={(data, actions) => {
            console.log("👆 [onClick] PayPal button clicked:", data);
            setError("");
            return actions.resolve();
          }}
        />
      </PayPalScriptProvider>

      {!isPopup && (
        <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-600">
          <strong>💡 Testing Tips:</strong>
          <ul className="mt-2 space-y-1 list-disc list-inside">
            <li>Use a PayPal Sandbox test account</li>
            <li>Check browser console for detailed logs (look for [PayPalCheckout])</li>
            <li>Ensure backend server is reachable at {Backend_URL}</li>
          </ul>
        </div>
      )}
    </div>
  );
}

export default PayPalCheckout;

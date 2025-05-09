"use client";

import Footer from "@/components/Footer";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";

export default function CartPage() {
  const [cartItems, setCartItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingPayment, setLoadingPayment] = useState(true);
  const router = useRouter();
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const handleAddToCart = async (activityId) => {
    if (!token) return;

    try {
      await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/add-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
          body: JSON.stringify({ activityId }),
        }
      );
      await fetchCart();
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleDecreaseQuantity = async (cartItemId, currentQty) => {
    if (!token || currentQty <= 1) return;

    try {
      await fetch(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-cart/${cartItemId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
          body: JSON.stringify({ quantity: currentQty - 1 }),
        }
      );
      await fetchCart();
    } catch (err) {
      console.error("Failed to update quantity:", err);
    }
  };

  const handleRemoveFromCart = async (cartItemId, currentQty) => {
    if (!token) return;

    try {
      await fetch(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-cart/${cartItemId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      await fetchCart();
    } catch (err) {
      console.error("Failed to remove item:", err);
    }
  };

  const fetchCart = async () => {
    if (!token) return;
    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/carts",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
        }
      );
      const result = await res.json();
      const rawCart = result.data;

      const cartWithActivity = rawCart.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        activity: {
          id: item.activity.id,
          title: item.activity.title,
          city: item.activity.city,
          imageUrl: item.activity.imageUrls[0],
          price: item.activity.price,
        },
      }));

      setCartItems(cartWithActivity);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/payment-methods",
          {
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            },
          }
        );
        const result = await res.json();
        setPaymentMethods(result.data);
      } catch (err) {
        console.error("Error fetching payment methods:", err);
      } finally {
        setLoadingPayment(false);
      }
    };

    fetchPaymentMethods();
  }, []);

  const subtotal = cartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((total, item) => total + item.activity.price * item.quantity, 0);

  const handleProceedToPayment = async () => {
    if (!token || selectedItems.length === 0 || !selectedPayment) return;

    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-transaction",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
          body: JSON.stringify({
            cartIds: selectedItems,
            paymentMethodId: selectedPayment,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        console.error("Error status:", res.status);
        console.error("Error response:", data);
        throw new Error(data.message || "Failed to create transaction");
      }

      router.push("/cartorders");
    } catch (error) {
      console.error("Error proceeding to payment:", error);
      alert("Failed to proceed to payment. Please try again.");
    }
  };

  if (loading || loadingPayment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-medium">Loading...</p>
      </div>
    );
  }

  return (
    <div className="px-4 md:px-8 mt-28">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-36">
          {/* CART ITEMS */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm p-4 flex gap-4 items-center"
                >
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item.id)}
                    onChange={() => {
                      setSelectedItems((prev) =>
                        prev.includes(item.id)
                          ? prev.filter((id) => id !== item.id)
                          : [...prev, item.id]
                      );
                    }}
                    className="accent-fuchsia-800"
                  />

                  <img
                    src={item.activity.imageUrl}
                    alt={item.activity.title}
                    className="w-24 h-24 object-cover rounded-xl"
                    width={96}
                    height={96}
                    onError={(e) => {
                      const target = e.currentTarget;
                      target.onerror = null; // prevent infinite loop
                      target.src = "/catbg.jpg"; // Ganti dengan path placeholder kamu
                    }}
                  />

                  <div className="flex-1 space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold">
                        {item.activity.title}
                      </h3>
                      <p className="text-fuchsia-700 font-bold">
                        Rp.
                        {(item.activity.price * item.quantity).toLocaleString(
                          "id-ID"
                        )}
                      </p>
                    </div>
                    <p className="text-sm text-gray-500">
                      {item.activity.city}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        className="w-7 h-7 rounded-full bg-gray-200 text-lg font-bold"
                        onClick={() =>
                          handleDecreaseQuantity(item.id, item.quantity)
                        }
                      >
                        -
                      </button>
                      <span className="font-medium">{item.quantity}</span>
                      <button
                        className="w-7 h-7 rounded-full bg-gray-200 text-lg font-bold"
                        onClick={() => handleAddToCart(item.activity.id)}
                      >
                        +
                      </button>
                      <button
                        className="text-sm text-gray-500 hover:underline ml-4"
                        onClick={() =>
                          handleRemoveFromCart(item.id, item.quantity)
                        }
                      >
                        <FaTrashAlt />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* PAYMENT SUMMARY */}
          <div className="order-1 lg:order-none lg:col-span-1 bg-white rounded-2xl shadow p-6 space-y-6 sticky top-4">
            <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>

            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="border rounded-lg px-3 py-2 flex-1"
                  />
                  <button className="bg-fuchsia-700 text-white px-4 rounded-lg hover:bg-fuchsia-800">
                    Apply
                  </button>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Select Payment Method</p>
                <div className="flex overflow-x-auto gap-3">
                  {paymentMethods.map((method) => (
                    <label
                      key={method.id}
                      className={`flex-shrink-0 flex items-center gap-2 border rounded-lg p-3 cursor-pointer min-w-[160px] ${
                        selectedPayment === method.id
                          ? "border-fuchsia-500 bg-fuchsia-50"
                          : "border-gray-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment"
                        value={method.id}
                        checked={selectedPayment === method.id}
                        onChange={() => setSelectedPayment(method.id)}
                        className="accent-orange-500"
                      />
                      <img
                        src={method.imageUrl}
                        alt={method.name}
                        className="h-6"
                      />
                      <span className="text-sm">{method.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <p className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>Rp{subtotal.toLocaleString("id-ID")}</span>
                </p>
                <p className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>- Rp0</span>
                </p>
                <p className="flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rp{subtotal.toLocaleString("id-ID")}</span>
                </p>
              </div>

              <button
                disabled={selectedItems.length === 0 || !selectedPayment}
                onClick={handleProceedToPayment}
                className={`w-full py-3 rounded-xl text-center font-semibold transition-all duration-200 ${
                  selectedItems.length > 0 && selectedPayment
                    ? "bg-fuchsia-700 text-white hover:bg-fuchsia-800"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                }`}
              >
                {selectedItems.length === 0
                  ? "Select Items First"
                  : !selectedPayment
                  ? "Select Payment Method"
                  : "Proceed to Payment"}
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

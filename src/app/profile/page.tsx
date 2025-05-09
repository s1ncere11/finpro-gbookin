"use client";

import React, { useEffect, useState } from "react";
import { Pencil } from "lucide-react";

export default function ProfileForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/user",
        {
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setName(data.data.name);
      setEmail(data.data.email);
      setPhoneNumber(data.data.phoneNumber);
      setProfilePictureUrl(data.data.profilePictureUrl);
    };

    fetchUser();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const image = e.target.files[0];

      const formData = new FormData();
      formData.append("image", image);

      setIsUploading(true);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
          {
            method: "POST",
            headers: {
              apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
              Authorization: `Bearer ${token}`,
            },
            body: formData,
          }
        );

        const data = await res.json();
        setProfilePictureUrl(data.url);
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Image upload failed");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-profile",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name,
            email,
            phoneNumber,
            profilePictureUrl, // <- include updated image
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update profile");
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Update failed:", error);
      alert("Update profile failed!");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-8 bg-white rounded-2xl shadow-xl mt-20">
      <div className="flex items-center gap-6">
        <div className="relative w-28 h-28">
          <img
            src={profilePictureUrl || "/default-avatar.png"}
            alt="Profile"
            className="w-full h-full object-cover rounded-full border-4 border-fuchsia-800 shadow-md"
          />
          <label htmlFor="fileInput">
            <div className="absolute bottom-1 right-1 bg-fuchsia-800 p-2 rounded-full text-white cursor-pointer hover:bg-fuchsia-700 transition">
              <Pencil size={16} />
            </div>
            <input
              type="file"
              id="fileInput"
              accept="image/png, image/jpeg"
              className="hidden"
              onChange={handleImageChange}
            />
          </label>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-700">
            Upload new photo
          </p>
          <p className="text-xs text-gray-500">JPG/PNG. Max size 2MB.</p>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold text-fuchsia-800 mb-4">
          Personal Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
            />
          </div>
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700">
              Phone Number
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-fuchsia-800"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 0812xxxx"
            />
          </div>
        </div>
      </div>

      <div className="mt-8 flex justify-end gap-4">
        <button className="px-5 py-2 rounded-xl border border-gray-300 text-gray-600 hover:bg-gray-100 transition">
          Cancel
        </button>
        <button
          disabled={isUploading}
          className={`px-6 py-2 rounded-xl text-white transition ${
            isUploading
              ? "bg-fuchsia-400 cursor-not-allowed"
              : "bg-fuchsia-800 hover:bg-fuchsia-700"
          }`}
          onClick={handleSubmit}
        >
          {isUploading ? "Uploading..." : "Edit Profile"}
        </button>
      </div>
    </div>
  );
}

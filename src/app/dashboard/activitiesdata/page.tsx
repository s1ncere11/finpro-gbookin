"use client";

import { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Image from "next/image";

interface Activity {
  id: string;
  categoryId?: string;
  title: string;
  description: string;
  imageUrls: string[];
  price?: number;
  price_discount?: number;
  rating?: number;
  total_reviews?: number;
  facilities?: string;
  address?: string;
  province?: string;
  city?: string;
  location_maps?: string;
}

export default function ActivitiesData() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    []
  );
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    categoryId: "",
    title: "",
    description: "",
    imageUrls: [""],
    price: "",
    price_discount: "",
    rating: "",
    total_reviews: "",
    facilities: "",
    address: "",
    province: "",
    city: "",
    location_maps: "",
  });

  const handleSubmit = async () => {
    const isValidUrl = (url: string) => {
      try {
        new URL(url);
        return true;
      } catch (_) {
        return false;
      }
    };

    const payload = {
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
      price_discount: formData.price_discount
        ? Number(formData.price_discount)
        : undefined,
      rating: formData.rating ? Number(formData.rating) : undefined,
      total_reviews: formData.total_reviews
        ? Number(formData.total_reviews)
        : undefined,
      imageUrls: formData.imageUrls.filter((url) => isValidUrl(url)),
    };

    const url = isEditing
      ? `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-activity/${editingId}`
      : `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/create-activity`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errMsg = await res.text();
        throw new Error(errMsg);
      }

      alert(`Activity berhasil di${isEditing ? "ubah" : "tambahkan"}!`);

      setShowModal(false);
      setIsEditing(false);
      setEditingId(null);
      setFormData({
        categoryId: "d43fde10-70e3-465c-9e06-c122cf581de4",
        title: "",
        description: "",
        imageUrls: [""],
        price: "",
        price_discount: "",
        rating: "",
        total_reviews: "",
        facilities: "",
        address: "",
        province: "",
        city: "",
        location_maps: "",
      });

      fetchActivities();
    } catch (err) {
      console.error("Gagal menyimpan activity", err);
      alert("Terjadi kesalahan saat menyimpan activity");
      console.log("Is editing:", isEditing);
      console.log("Editing ID:", editingId);
      console.log("URL:", url);
      console.log("Payload:", payload);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/categories",
        {
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setCategories(data.data);
    } catch (err) {
      console.error("Gagal mengambil kategori", err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Token tidak ditemukan, silakan login ulang");
      return;
    }
    fetchActivities();
    fetchCategories();
  }, []);

  const handleImageUpload = async (file: File) => {
    const formDataUpload = new FormData();
    formDataUpload.append("image", file);

    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/upload-image",
        {
          method: "POST",
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formDataUpload,
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Upload gagal");

      // Simpan URL hasil upload ke formData.imageUrls
      setFormData((prev) => ({ ...prev, imageUrls: [data.url] }));
      alert("Upload gambar berhasil!");
    } catch (err) {
      console.error("Upload error:", err);
      alert("Gagal mengupload gambar.");
    }
  };

  const fetchActivities = async () => {
    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/activities",
        {
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setActivities(data.data);
    } catch (err) {
      console.error("Failed to fetch activities", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin ingin menghapus activity ini?")) return;
    try {
      await fetch(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/delete-activity/${id}`,
        {
          method: "DELETE",
          headers: {
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchActivities();
    } catch (err) {
      console.error("Gagal menghapus activity", err);
    }
  };

  return (
    <div className="p-8 bg-pink-50 min-h-screen">
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-xl w-full max-w-2xl relative">
            <h2 className="text-xl font-bold mb-4 text-fuchsia-700">
              Add Activity
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <select
                value={formData.categoryId}
                onChange={(e) =>
                  setFormData({ ...formData, categoryId: e.target.value })
                }
                className="border rounded px-3 py-2 col-span-2"
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="border rounded px-3 py-2 col-span-2"
              />
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleImageUpload(file);
                }}
                className="border rounded px-3 py-2 col-span-2"
              />

              <input
                type="number"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="border rounded px-3 py-2"
              />

              <input
                type="number"
                placeholder="Discount Price"
                value={formData.price_discount}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    price_discount: e.target.value,
                  })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Rating"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="number"
                placeholder="Total Reviews"
                value={formData.total_reviews}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    total_reviews: e.target.value,
                  })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Facilities (HTML)"
                value={formData.facilities}
                onChange={(e) =>
                  setFormData({ ...formData, facilities: e.target.value })
                }
                className="border rounded px-3 py-2 col-span-2"
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="border rounded px-3 py-2 col-span-2"
              />
              <input
                type="text"
                placeholder="Province"
                value={formData.province}
                onChange={(e) =>
                  setFormData({ ...formData, province: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                className="border rounded px-3 py-2"
              />
              <textarea
                placeholder="Google Maps Embed"
                value={formData.location_maps}
                onChange={(e) =>
                  setFormData({ ...formData, location_maps: e.target.value })
                }
                className="border rounded px-3 py-2 col-span-2"
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setIsEditing(false);
                  setEditingId(null);
                  setFormData({
                    categoryId: "",
                    title: "",
                    description: "",
                    imageUrls: [""],
                    price: "",
                    price_discount: "",
                    rating: "",
                    total_reviews: "",
                    facilities: "",
                    address: "",
                    province: "",
                    city: "",
                    location_maps: "",
                  });
                }}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-fuchsia-700 text-white rounded hover:bg-fuchsia-800"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-fuchsia-700">
            Activities Data
          </h1>
          <p className="text-sm text-gray-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-fuchsia-700 text-white px-4 py-2 rounded-lg text-sm hover:bg-fuchsia-800 transition flex items-center gap-2"
        >
          <FaPlus /> Add Activity
        </button>
      </div>
      <input
        type="text"
        placeholder="Cari nama aktifitas..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className=" mb-6 px-4 py-2 w-full sm:w-64 rounded-lg border border-fuchsia-300 focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
      />

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {activities
            .filter((activity) =>
              activity.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((activity) => (
              <div
                key={activity.id}
                className="rounded-3xl overflow-hidden shadow-[0_4px_20px_rgba(240,46,170,0.2)] border border-white/30 bg-white/70 backdrop-blur-md transition-transform duration-300 hover:scale-[1.02] flex flex-col"
              >
                <div className="h-48 bg-gray-100 overflow-hidden">
                  <img
                    src={activity.imageUrls?.[0] || "/catbg.jpg"}
                    alt={activity.title}
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/catbg.jpg";
                    }}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="p-5 flex flex-col justify-between h-full min-h-64">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">
                      {activity.title}
                    </h2>
                    <p className="text-sm text-gray-600 mt-2 line-clamp-3">
                      {activity.description}
                    </p>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => {
                        setIsEditing(true);
                        setEditingId(activity.id);
                        setFormData({
                          categoryId: activity.categoryId || "",
                          title: activity.title || "",
                          description: activity.description || "",
                          imageUrls: activity.imageUrls || [" "],
                          price: String(activity.price || ""),
                          price_discount: String(activity.price_discount || ""),
                          rating: String(activity.rating || ""),
                          total_reviews: String(activity.total_reviews || ""),
                          facilities: activity.facilities || "",
                          address: activity.address || "",
                          province: activity.province || "",
                          city: activity.city || "",
                          location_maps: activity.location_maps || "",
                        });
                        setShowModal(true);
                      }}
                      className="bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 w-full py-2 rounded-xl text-sm font-medium flex justify-center items-center gap-2 transition"
                    >
                      <FaEdit /> Edit
                    </button>

                    <button
                      onClick={() => handleDelete(activity.id)}
                      className="bg-red-100 hover:bg-red-200 text-red-700 w-full py-2 rounded-xl text-sm font-medium flex justify-center items-center gap-2 transition"
                    >
                      <FaTrash /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

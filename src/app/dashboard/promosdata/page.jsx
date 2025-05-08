"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil } from "lucide-react";

const API_BASE = "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1";
const API_KEY = "24405e01-fbc1-45a5-9f5a-be13afcd757c";
const TOKEN = process.env.NEXT_PUBLIC_TOKEN;

export default function PromoPage() {
  const [promos, setPromos] = useState([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);

  const initialFormState = {
    id: "",
    title: "",
    description: "",
    promo_code: "",
    image: null,
    promo_discount_price: 0,
    minimum_claim_price: 0,
    terms_condition: "",
  };
  const [form, setForm] = useState(initialFormState);

  const headers = {
    Authorization: TOKEN,
    apiKey: API_KEY,
  };

  useEffect(() => {
    fetchPromos();
  }, []);

  const uploadImage = async (imageFile) => {
    const imgForm = new FormData();
    imgForm.append("image", imageFile);

    const res = await fetch(`${API_BASE}/upload-image`, {
      method: "POST",
      headers: {
        Authorization: TOKEN,
        apiKey: API_KEY,
      },
      body: imgForm,
    });

    const result = await res.json();
    if (!res.ok) throw new Error(result.message || "Upload failed");

    return result.url; // hasilnya biasanya: https://...
  };

  const fetchPromos = async () => {
    const res = await fetch(`${API_BASE}/promos`, {
      method: "GET",
      headers,
    });

    const result = await res.json();
    setPromos(result.data);
  };

  const handleDelete = async (id) => {
    await fetch(`${API_BASE}/delete-promo/${id}`, {
      method: "DELETE",
      headers,
    });
    fetchPromos();
  };

  const handleEdit = (promo) => {
    setForm({
      id: promo.id,
      title: promo.title,
      description: promo.description,
      promo_code: promo.promo_code,
      promo_discount_price: promo.promo_discount_price,
      minimum_claim_price: promo.minimum_claim_price,
      terms_condition: promo.terms_condition,
      image: null, // biarkan kosong, user bisa upload baru jika mau
    });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let imageUrl = null;

      if (form.image) {
        imageUrl = await uploadImage(form.image); // aplod gambar
      }

      const payload = {
        title: form.title,
        description: form.description,
        promo_code: form.promo_code,
        promo_discount_price: Number(form.promo_discount_price),
        minimum_claim_price: Number(form.minimum_claim_price),
        terms_condition: form.terms_condition,
      };

      if (imageUrl) payload.imageUrl = imageUrl;

      const url = form.id
        ? `${API_BASE}/update-promo/${form.id}`
        : `${API_BASE}/create-promo`;

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: TOKEN,
          apiKey: API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        console.error("Submit failed:", result);
        alert(`Gagal submit: ${result.message || "Periksa input Anda"}`);
        return;
      }

      // Reset form & refresh
      setShowForm(false);
      setForm(initialFormState);
      fetchPromos();
    } catch (err) {
      alert(`Terjadi kesalahan: ${err.message}`);
    }
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Promo Management</h1>
        <button
          onClick={() => {
            setForm({ id: "", title: "", promo_code: "", image: null });
            setShowForm(true);
          }}
          className="bg-fuchsia-700 text-white px-4 py-2 rounded flex items-center gap-2"
        >
          <Plus size={16} /> Add Promo
        </button>
      </div>

      <input
        type="text"
        placeholder="Search..."
        className="border px-3 py-2 rounded w-64 mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {promos
          .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
          .map((promo) => (
            <div
              key={promo.id}
              className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col"
            >
              {promo.imageUrl ? (
                <img
                  src={promo.imageUrl}
                  alt={promo.title}
                  className="h-48 w-full object-cover"
                />
              ) : (
                <div className="h-48 w-full bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-lg text-gray-800">
                    {promo.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {promo.promo_code}
                  </p>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(promo)}
                    className="flex-1 px-3 py-1 bg-fuchsia-100 text-fuchsia-700 rounded-full text-sm"
                  >
                    <Pencil size={14} className="inline mr-1" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Yakin ingin menghapus promo ini?")) {
                        handleDelete(promo.id);
                      }
                    }}
                    className="flex-1 px-3 py-1 bg-red-100 text-red-600 rounded-full text-sm"
                  >
                    <Trash2 size={14} className="inline mr-1" />
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded-xl shadow-lg w-full max-w-xl space-y-4"
          >
            <h2 className="text-2xl font-semibold text-gray-800">
              {form.id ? "Edit Promo" : "Add Promo"}
            </h2>

            {/* Title */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              />
            </div>

            {/* Upload Image */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Upload Image
              </label>
              <input
                type="file"
                accept="image/png, image/jpeg"
                onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              />
            </div>

            {/* Promo Code */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Promo Code
              </label>
              <input
                type="text"
                value={form.promo_code}
                onChange={(e) =>
                  setForm({ ...form, promo_code: e.target.value })
                }
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              />
            </div>

            {/* Promo Discount Price */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Promo Discount Price
              </label>
              <input
                type="number"
                value={form.promo_discount_price || ""}
                onChange={(e) =>
                  setForm({ ...form, promo_discount_price: e.target.value })
                }
              />
            </div>

            {/* Minimum Claim Price */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Minimum Claim Price
              </label>
              <input
                type="number"
                value={form.minimum_claim_price || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    minimum_claim_price: e.target.value,
                  })
                }
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              />
            </div>

            {/* Terms & Conditions */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Terms & Conditions (HTML)
              </label>
              <textarea
                value={form.terms_condition}
                onChange={(e) =>
                  setForm({ ...form, terms_condition: e.target.value })
                }
                required
                className="w-full border border-gray-300 px-3 py-2 rounded-lg"
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {form.id ? "Update" : "Create"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

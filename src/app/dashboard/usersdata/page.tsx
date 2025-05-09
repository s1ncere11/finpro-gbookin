"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { FaEdit, FaSearch } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  role: string;
  profilePictureUrl: string;
}

const ITEMS_PER_PAGE = 15;

export default function UsersData() {
  const [users, setUsers] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [newRole, setNewRole] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateRole = async () => {
    if (!selectedUser) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/update-user-role/${selectedUser.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (res.ok) {
        await fetchUsers(); // refresh data
        setShowModal(false);
      } else {
        const errorData = await res.json();
        alert(`Gagal update: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error updating role", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/all-user",
        {
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      const data = await res.json();
      setUsers(data.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handlePageChange = (dir: "next" | "prev") => {
    setCurrentPage((prev) =>
      dir === "next" ? Math.min(prev + 1, totalPages) : Math.max(prev - 1, 1)
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-100 via-white to-fuchsia-50 py-10 px-6">
      <div className=" mx-auto space-y-8">
        <h1 className="text-4xl font-bold text-fuchsia-700  tracking-tight mb-2">
          Users Data
        </h1>
        <p className="text-gray-500 text-sm">
          Kelola daftar user yang terdaftar di platform.
        </p>

        <div className="flex justify-between items-center">
          <div className="relative w-full md:w-1/3">
            <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-fuchsia-800" />
            <input
              type="text"
              placeholder="Cari user berdasarkan nama..."
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-fuchsia-300 bg-white/70 backdrop-blur-lg shadow focus:ring-2 focus:ring-fuchsia-400 transition placeholder:text-sm placeholder-gray-400"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="overflow-hidden rounded-3xl shadow-xl border border-fuchsia-200 bg-white/80 backdrop-blur-md">
          <table className="min-w-full text-sm text-left font-medium text-gray-700">
            <thead className="bg-gradient-to-r from-fuchsia-100 to-fuchsia-50 text-fuchsia-900 text-xs uppercase tracking-wider">
              <tr>
                <th className="py-4 px-6 text-left">Foto</th>
                <th className="py-4 px-6 text-left">Nama</th>
                <th className="py-4 px-6 text-left">Email</th>
                <th className="py-4 px-6 text-left">No HP</th>
                <th className="py-4 px-6 text-left">Role</th>
                <th className="py-4 px-6 text-center">Opsi</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-fuchsia-100 hover:bg-fuchsia-50/30 transition-all duration-200"
                >
                  <td className="py-4 px-6">
                    <img
                      src={user.profilePictureUrl?.trim() || "/catbg.png"}
                      onError={(e) => {
                        e.currentTarget.src = "/catbg.jpg";
                      }}
                      alt={user.name}
                      className="w-10 h-10 object-cover rounded-full border border-fuchsia-200 shadow-sm"
                    />
                  </td>
                  <td className="py-4 px-6 font-semibold text-gray-800">
                    {user.name}
                  </td>
                  <td className="py-4 px-6">{user.email}</td>
                  <td className="py-4 px-6">{user.phoneNumber}</td>
                  <td className="py-4 px-6">
                    <span className="inline-block px-3 py-1 text-xs rounded-full bg-fuchsia-100 text-fuchsia-700 font-medium capitalize shadow-sm">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setNewRole(user.role);
                        setShowModal(true);
                      }}
                      className="bg-fuchsia-100 hover:bg-fuchsia-200 text-fuchsia-700 px-4 py-2 rounded-xl text-xs shadow transition-all"
                    >
                      <FaEdit />
                    </button>
                  </td>
                </tr>
              ))}
              {paginatedUsers.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="text-center py-10 text-gray-400 italic bg-white/50"
                  >
                    Tidak ada user ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center mt-6 text-sm">
          <p className="text-gray-500">
            Menampilkan{" "}
            {Math.min(
              (currentPage - 1) * ITEMS_PER_PAGE + 1,
              filteredUsers.length
            )}{" "}
            - {Math.min(currentPage * ITEMS_PER_PAGE, filteredUsers.length)}{" "}
            dari {filteredUsers.length} user
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
              className="p-2 bg-white border border-fuchsia-300 text-fuchsia-700 rounded-full disabled:opacity-40 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="text-gray-700 font-medium">
              Halaman {currentPage} dari {totalPages}
            </span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage === totalPages}
              className="p-2 bg-white border border-fuchsia-300 text-fuchsia-700 rounded-full disabled:opacity-40 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
      {showModal && selectedUser && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-md">
            <h2 className="text-xl font-bold text-fuchsia-700 mb-4">
              Edit Role
            </h2>
            <p className="text-gray-600 mb-4">
              Ubah role untuk: <strong>{selectedUser.name}</strong>
            </p>

            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full border border-fuchsia-300 rounded-xl px-4 py-2 mb-6 text-sm shadow focus:ring-2 focus:ring-fuchsia-600"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm bg-gray-200 rounded-xl hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleUpdateRole}
                disabled={loading}
                className="px-4 py-2 text-sm bg-fuchsia-700 text-white rounded-xl hover:bg-fuchsia-800 transition disabled:opacity-50"
              >
                {loading ? "Menyimpan..." : "Simpan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

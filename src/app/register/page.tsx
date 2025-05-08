"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordRepeat, setPasswordRepeat] = useState("");
  const [role, setRole] = useState("user");
  const [profilePictureUrl, setProfilePictureUrl] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== passwordRepeat) {
      setError("Password dan konfirmasi tidak cocok");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        "https://travel-journal-api-bootcamp.do.dibimbing.id/api/v1/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            apiKey: "24405e01-fbc1-45a5-9f5a-be13afcd757c",
          },
          body: JSON.stringify({
            email,
            name,
            password,
            passwordRepeat,
            role,
            profilePictureUrl,
            phoneNumber,
          }),
        }
      );

      const result = await response.json();
      console.log(result); // buat debugging bang

      if (result.code === "200") {
        alert("Register berhasil!");
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.data));

        router.push("/");
      } else {
        setError(result.message || "Register gagal");
      }
    } catch (err) {
      setError("Terjadi kesalahan saat register");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              className="w-full p-2 border border-gray-300 rounded"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Profile Picture URL
            </label>
            <input
              type="url"
              className="w-full p-2 border border-gray-300 rounded"
              value={profilePictureUrl}
              onChange={(e) => setProfilePictureUrl(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={passwordRepeat}
              onChange={(e) => setPasswordRepeat(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-fuchsia-600 hover:bg-fuchsia-700 hover:cursor-pointer text-white rounded"
          >
            {loading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

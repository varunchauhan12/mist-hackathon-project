"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function SignupPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [focusedField, setFocusedField] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/auth/signup", formData);
      const role = res.data.user.role;

      if (role === "victim") router.push("/victim/report");
      else if (role === "rescue") router.push("/rescue/dashboard");
      else if (role === "logistics") router.push("/logistics/dashboard");
      else router.push("/dashboard");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#0b0f14] px-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl"
      >
        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-extrabold text-[#e5e7eb] mb-2">
            Create COMMANDR Account
          </h1>
          <p className="text-[#9ca3af] text-sm">
            Join the real-time disaster response network
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {[
            { name: "fullName", type: "text", placeholder: "Full Name" },
            { name: "email", type: "email", placeholder: "Email Address" },
            { name: "password", type: "password", placeholder: "Password" },
          ].map((input) => (
            <div key={input.name}>
              <input
                type={input.type}
                name={input.name}
                placeholder={input.placeholder}
                value={(formData as any)[input.name]}
                onChange={handleChange}
                onFocus={() => setFocusedField(input.name)}
                onBlur={() => setFocusedField("")}
                required
                className={`w-full px-5 py-4 rounded-2xl bg-[#0b0f14]/80
                  border transition-all text-[#e5e7eb] placeholder-[#9ca3af]
                  ${
                    focusedField === input.name
                      ? "border-[#38bdf8] ring-2 ring-[#38bdf8]/30"
                      : "border-white/10 hover:border-white/20"
                  }`}
              />
            </div>
          ))}

          {/* ROLE SELECT */}
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            className="w-full px-5 py-4 rounded-2xl bg-[#0b0f14]/80
              border border-white/10 text-[#e5e7eb]
              focus:border-[#38bdf8] transition-all"
          >
            <option value="">Select Role</option>
            <option value="victim">Victim / Citizen</option>
            <option value="rescue">Rescue Team</option>
            <option value="logistics">Logistics / Command</option>
          </select>

          {/* SUBMIT */}
          <motion.button
            whileTap={{ scale: 0.96 }}
            disabled={loading}
            className={`w-full py-4 rounded-2xl font-semibold text-lg transition-all ${
              loading
                ? "bg-white/10 text-[#9ca3af] cursor-not-allowed"
                : "bg-[#38bdf8] text-[#0b0f14] hover:bg-[#60a5fa] hover:shadow-lg"
            }`}
          >
            {loading ? "Creating account…" : "Create Account"}
          </motion.button>

          {/* ERROR */}
          {error && (
            <div className="text-sm text-[#ef4444] text-center bg-[#ef4444]/10 border border-[#ef4444]/30 p-3 rounded-xl">
              {error}
            </div>
          )}
        </form>

        {/* LOGIN LINK */}
        <div className="text-center mt-8 border-t border-white/10 pt-6">
          <p className="text-[#9ca3af] text-sm mb-2">
            Already have an account?
          </p>
          <button
            onClick={() => router.push("/auth/login")}
            className="text-[#38bdf8] font-semibold hover:underline"
          >
            Login to COMMANDR
          </button>
        </div>
      </motion.div>
    </main>
  );
}



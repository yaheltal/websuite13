import { useState } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";

export default function AdminLogin() {
  const [, navigate] = useLocation();
  const { user, isLoading, loginMutation } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  if (!isLoading && user) {
    navigate("/admin");
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate(
      { username, password },
      { onSuccess: () => navigate("/admin") }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="ltr">
      <div className="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div
          className="p-6 text-center"
          style={{
            background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))",
          }}
        >
          <h1 className="text-2xl font-bold text-white">WebSuite</h1>
          <p className="text-white/70 text-sm mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="username" className="text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Enter username"
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              placeholder="Enter password"
            />
          </div>
          {loginMutation.isError && (
            <p className="text-sm text-red-500 text-center">Invalid username or password</p>
          )}
          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full py-2.5 text-white font-semibold rounded-lg transition-opacity disabled:opacity-50 text-sm"
            style={{
              background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))",
            }}
          >
            {loginMutation.isPending ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}

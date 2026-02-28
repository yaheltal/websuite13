import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useState } from "react";

interface ContactLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  createdAt: string;
}

interface OnboardingLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  questionnaireData: Record<string, any>;
  chatHistory: any;
  generatedPrompt: string | null;
  uploadedFiles: string[] | null;
  createdAt: string;
}

const SERVICE_NAMES: Record<string, string> = {
  "landing-page": "Landing Page",
  "digital-card": "Digital Card",
  "ecommerce": "E-Commerce",
  "business-card": "Business Card",
  "other": "Other",
};

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<"contacts" | "onboardings">("contacts");

  const { data: contacts = [] } = useQuery<ContactLead[]>({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const res = await fetch("/api/admin/contacts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: onboardings = [] } = useQuery<OnboardingLead[]>({
    queryKey: ["/api/admin/onboardings"],
    queryFn: async () => {
      const res = await fetch("/api/admin/onboardings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!user,
  });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  if (!user) {
    navigate("/admin/login");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/admin/login"),
    });
  };

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm"
            style={{ background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))" }}
          >
            W
          </div>
          <h1 className="text-lg font-bold text-gray-900">WebSuite Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">Hi, {user.username}</span>
          <button
            onClick={handleLogout}
            className="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Contact Leads</p>
            <p className="text-3xl font-bold text-gray-900">{contacts.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Onboarding Leads</p>
            <p className="text-3xl font-bold text-gray-900">{onboardings.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">Total Leads</p>
            <p className="text-3xl font-bold text-gray-900">{contacts.length + onboardings.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm">
            <p className="text-sm text-gray-500 mb-1">This Week</p>
            <p className="text-3xl font-bold text-gray-900">
              {[...contacts, ...onboardings].filter((l) => {
                const d = new Date(l.createdAt);
                const now = new Date();
                const diff = now.getTime() - d.getTime();
                return diff < 7 * 24 * 60 * 60 * 1000;
              }).length}
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab("contacts")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "contacts"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Contact Submissions ({contacts.length})
            </button>
            <button
              onClick={() => setActiveTab("onboardings")}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === "onboardings"
                  ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Onboarding Submissions ({onboardings.length})
            </button>
          </div>

          <div className="overflow-x-auto">
            {activeTab === "contacts" && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Service</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Message</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-gray-400">
                        No contact submissions yet
                      </td>
                    </tr>
                  ) : (
                    [...contacts].reverse().map((c) => (
                      <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                        <td className="px-4 py-3 text-blue-600">{c.email}</td>
                        <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                            {SERVICE_NAMES[c.service] || c.service}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{c.message}</td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(c.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}

            {activeTab === "onboardings" && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 text-left">
                    <th className="px-4 py-3 font-medium text-gray-600">Name</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Email</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Phone</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Service</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Chat</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Files</th>
                    <th className="px-4 py-3 font-medium text-gray-600">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {onboardings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="px-4 py-8 text-center text-gray-400">
                        No onboarding submissions yet
                      </td>
                    </tr>
                  ) : (
                    [...onboardings].reverse().map((o) => (
                      <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium text-gray-900">{o.name}</td>
                        <td className="px-4 py-3 text-blue-600">{o.email}</td>
                        <td className="px-4 py-3 text-gray-600">{o.phone || "—"}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                            {SERVICE_NAMES[o.service] || o.service}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {o.chatHistory ? (
                            <span className="text-green-600 text-xs font-medium">Completed</span>
                          ) : (
                            <span className="text-gray-400 text-xs">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          {o.uploadedFiles && o.uploadedFiles.length > 0 ? (
                            <span className="text-blue-600 text-xs font-medium">
                              {o.uploadedFiles.length} files
                            </span>
                          ) : (
                            <span className="text-gray-400 text-xs">None</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                          {new Date(o.createdAt).toLocaleDateString("en-GB")}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

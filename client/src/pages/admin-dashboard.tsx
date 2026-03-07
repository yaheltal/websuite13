import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE } from "@/lib/queryClient";
import { useState, useMemo } from "react";

interface ContactLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  message: string;
  createdAt: string;
  created_at?: string;
}

interface OnboardingLead {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  service: string;
  questionnaireData: Record<string, any>;
  questionnaire_data?: Record<string, any>;
  chatHistory: any;
  chat_history?: any;
  generatedPrompt: string | null;
  generated_prompt?: string | null;
  uploadedFiles: string[] | null;
  uploaded_files?: string[] | null;
  createdAt: string;
  created_at?: string;
}

const SERVICE_NAMES: Record<string, string> = {
  "landing-page": "Landing Page",
  "digital-card": "Digital Card",
  "ecommerce": "E-Commerce",
  "business-card": "Business Card",
  "other": "Other",
};

const SERVICE_COLORS: Record<string, string> = {
  "landing-page": "bg-blue-500",
  "digital-card": "bg-purple-500",
  "ecommerce": "bg-green-500",
  "business-card": "bg-orange-500",
  "other": "bg-gray-500",
};

function getDate(item: { createdAt?: string; created_at?: string }) {
  return item.createdAt || item.created_at || "";
}
function getChat(item: OnboardingLead) {
  return item.chatHistory || item.chat_history;
}
function getFiles(item: OnboardingLead) {
  return item.uploadedFiles || item.uploaded_files;
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

function formatTime(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr);
  return d.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" });
}

function timeAgo(dateStr: string) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return formatDate(dateStr);
}

// Simple bar chart component (no external deps)
function ServiceChart({ data }: { data: { label: string; count: number; color: string }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="text-xs text-gray-500 w-24 sm:w-28 truncate text-right">{d.label}</span>
          <div className="flex-1 bg-gray-100 rounded-full h-5 sm:h-6 overflow-hidden">
            <div
              className={`${d.color} h-full rounded-full transition-all duration-500 flex items-center justify-end pr-2`}
              style={{ width: `${Math.max((d.count / max) * 100, 8)}%` }}
            >
              <span className="text-white text-xs font-bold">{d.count}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// Weekly activity mini chart
function WeeklyChart({ items }: { items: { createdAt?: string; created_at?: string }[] }) {
  const days = useMemo(() => {
    const result: { label: string; count: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toLocaleDateString("en-US", { weekday: "short" });
      const dateKey = d.toISOString().slice(0, 10);
      const count = items.filter((item) => {
        const dt = getDate(item);
        return dt && new Date(dt).toISOString().slice(0, 10) === dateKey;
      }).length;
      result.push({ label: dayStr, count });
    }
    return result;
  }, [items]);

  const max = Math.max(...days.map((d) => d.count), 1);

  return (
    <div className="flex items-end gap-1.5 sm:gap-2 h-20 sm:h-24">
      {days.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1">
          <div className="w-full flex justify-center">
            {d.count > 0 && <span className="text-[10px] text-gray-500 font-medium">{d.count}</span>}
          </div>
          <div
            className="w-full rounded-t-md bg-gradient-to-t from-blue-500 to-blue-400 transition-all duration-500"
            style={{ height: `${Math.max((d.count / max) * 100, 4)}%`, minHeight: d.count > 0 ? "8px" : "2px", opacity: d.count > 0 ? 1 : 0.2 }}
          />
          <span className="text-[10px] text-gray-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function ContactCard({ contact }: { contact: ContactLead }) {
  const dt = getDate(contact);
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-2.5 active:scale-[0.98] transition-transform">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{contact.name}</p>
          <a href={`mailto:${contact.email}`} className="text-xs text-blue-600 break-all">{contact.email}</a>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-semibold">
            {SERVICE_NAMES[contact.service] || contact.service}
          </span>
          <span className="text-[10px] text-gray-400">{timeAgo(dt)}</span>
        </div>
      </div>
      {contact.phone && (
        <a href={`tel:${contact.phone}`} className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          {contact.phone}
        </a>
      )}
      {contact.message && (
        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">{contact.message}</p>
      )}
    </div>
  );
}

function OnboardingCard({ onboarding }: { onboarding: OnboardingLead }) {
  const chat = getChat(onboarding);
  const files = getFiles(onboarding);
  const dt = getDate(onboarding);
  const hasChat = !!chat;
  const fileCount = files?.length || 0;

  // Progress steps
  const steps = [
    { label: "Form", done: true },
    { label: "Chat", done: hasChat },
    { label: "Files", done: fileCount > 0 },
  ];

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 space-y-3 active:scale-[0.98] transition-transform">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-semibold text-gray-900 truncate">{onboarding.name}</p>
          <a href={`mailto:${onboarding.email}`} className="text-xs text-blue-600 break-all">{onboarding.email}</a>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-[10px] font-semibold">
            {SERVICE_NAMES[onboarding.service] || onboarding.service}
          </span>
          <span className="text-[10px] text-gray-400">{timeAgo(dt)}</span>
        </div>
      </div>

      {onboarding.phone && (
        <a href={`tel:${onboarding.phone}`} className="text-xs text-gray-500 flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          {onboarding.phone}
        </a>
      )}

      {/* Progress bar */}
      <div className="flex items-center gap-1">
        {steps.map((s, i) => (
          <div key={s.label} className="flex items-center gap-1 flex-1">
            <div className={`h-1.5 flex-1 rounded-full ${s.done ? "bg-green-400" : "bg-gray-200"}`} />
            {i < steps.length - 1 && <div className="w-0.5" />}
          </div>
        ))}
      </div>
      <div className="flex justify-between text-[10px]">
        {steps.map((s) => (
          <span key={s.label} className={s.done ? "text-green-600 font-medium" : "text-gray-400"}>{s.label}</span>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [, navigate] = useLocation();
  const { user, isLoading: authLoading, logoutMutation } = useAuth();
  const [activeTab, setActiveTab] = useState<"overview" | "contacts" | "onboardings">("overview");

  const { data: contacts = [] } = useQuery<ContactLead[]>({
    queryKey: ["/api/admin/contacts"],
    queryFn: async () => {
      const res = await fetch(API_BASE + "/api/admin/contacts", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!user,
  });

  const { data: onboardings = [] } = useQuery<OnboardingLead[]>({
    queryKey: ["/api/admin/onboardings"],
    queryFn: async () => {
      const res = await fetch(API_BASE + "/api/admin/onboardings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    },
    enabled: !!user,
  });

  const stats = useMemo(() => {
    const all = [...contacts, ...onboardings];
    const now = Date.now();
    const weekMs = 7 * 24 * 60 * 60 * 1000;
    const thisWeek = all.filter((l) => now - new Date(getDate(l)).getTime() < weekMs).length;
    const today = all.filter((l) => new Date(getDate(l)).toDateString() === new Date().toDateString()).length;

    // Service breakdown
    const serviceCounts: Record<string, number> = {};
    all.forEach((l) => {
      const s = l.service || "other";
      serviceCounts[s] = (serviceCounts[s] || 0) + 1;
    });
    const serviceData = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([key, count]) => ({
        label: SERVICE_NAMES[key] || key,
        count,
        color: SERVICE_COLORS[key] || "bg-gray-500",
      }));

    // Onboarding completion rate
    const completedOnboardings = onboardings.filter((o) => getChat(o)).length;
    const completionRate = onboardings.length > 0 ? Math.round((completedOnboardings / onboardings.length) * 100) : 0;

    return { thisWeek, today, serviceData, completionRate, completedOnboardings };
  }, [contacts, onboardings]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    navigate("/admin/login");
    return null;
  }

  const handleLogout = () => {
    logoutMutation.mutate(undefined, { onSuccess: () => navigate("/admin/login") });
  };

  // Recent leads (last 5, mixed)
  const recentLeads = [...contacts.map((c) => ({ ...c, type: "contact" as const })), ...onboardings.map((o) => ({ ...o, type: "onboarding" as const }))]
    .sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gray-50" dir="ltr">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex justify-between items-center sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(220 80% 55%), hsl(260 70% 55%))" }}
          >
            W
          </div>
          <h1 className="text-base font-bold text-gray-900">Admin</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Logout
        </button>
      </header>

      {/* Bottom tabs (mobile) / Top tabs (desktop) */}
      <nav className="bg-white border-b border-gray-200 flex sm:max-w-7xl sm:mx-auto">
        {(["overview", "contacts", "onboardings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-xs sm:text-sm font-medium transition-colors capitalize ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-400"
            }`}
          >
            {tab === "overview" ? "Overview" : tab === "contacts" ? `Contacts (${contacts.length})` : `Onboarding (${onboardings.length})`}
          </button>
        ))}
      </nav>

      <main className="p-3 sm:p-6 max-w-7xl mx-auto space-y-4 sm:space-y-6 pb-20">
        {activeTab === "overview" && (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-4 text-white">
                <p className="text-blue-100 text-xs mb-1">Total Leads</p>
                <p className="text-3xl font-bold">{contacts.length + onboardings.length}</p>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-4 text-white">
                <p className="text-purple-100 text-xs mb-1">This Week</p>
                <p className="text-3xl font-bold">{stats.thisWeek}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.today}</p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <p className="text-xs text-gray-500 mb-1">Chat Completion</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
                <p className="text-[10px] text-gray-400">{stats.completedOnboardings}/{onboardings.length}</p>
              </div>
            </div>

            {/* Weekly activity chart */}
            <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <h3 className="text-sm font-semibold text-gray-700 mb-3">Weekly Activity</h3>
              <WeeklyChart items={[...contacts, ...onboardings]} />
            </div>

            {/* Service breakdown */}
            {stats.serviceData.length > 0 && (
              <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                <h3 className="text-sm font-semibold text-gray-700 mb-3">Services Breakdown</h3>
                <ServiceChart data={stats.serviceData} />
              </div>
            )}

            {/* Recent leads */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700">Recent Leads</h3>
              </div>
              {recentLeads.length === 0 ? (
                <div className="p-8 text-center text-gray-400 text-sm">No leads yet</div>
              ) : (
                <div className="divide-y divide-gray-50">
                  {recentLeads.map((lead) => (
                    <div key={`${lead.type}-${lead.id}`} className="px-4 py-3 flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${lead.type === "contact" ? "bg-blue-500" : "bg-purple-500"}`} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{lead.name}</p>
                        <p className="text-xs text-gray-400">{lead.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${lead.type === "contact" ? "bg-blue-50 text-blue-600" : "bg-purple-50 text-purple-600"}`}>
                          {lead.type === "contact" ? "Contact" : "Onboard"}
                        </span>
                        <p className="text-[10px] text-gray-400 mt-0.5">{timeAgo(getDate(lead))}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "contacts" && (
          <>
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {contacts.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
                  No contact submissions yet
                </div>
              ) : (
                [...contacts].sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime()).map((c) => <ContactCard key={c.id} contact={c} />)
              )}
            </div>
            <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
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
                      <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No contact submissions yet</td></tr>
                    ) : (
                      [...contacts].sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime()).map((c) => (
                        <tr key={c.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{c.name}</td>
                          <td className="px-4 py-3 text-blue-600">{c.email}</td>
                          <td className="px-4 py-3 text-gray-600">{c.phone || "—"}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">{SERVICE_NAMES[c.service] || c.service}</span>
                          </td>
                          <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{c.message}</td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(getDate(c))}<br/><span className="text-xs text-gray-400">{formatTime(getDate(c))}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {activeTab === "onboardings" && (
          <>
            <div className="grid grid-cols-1 gap-3 md:hidden">
              {onboardings.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-8 text-center text-gray-400 text-sm">
                  No onboarding submissions yet
                </div>
              ) : (
                [...onboardings].sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime()).map((o) => <OnboardingCard key={o.id} onboarding={o} />)
              )}
            </div>
            <div className="hidden md:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
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
                      <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-400">No onboarding submissions yet</td></tr>
                    ) : (
                      [...onboardings].sort((a, b) => new Date(getDate(b)).getTime() - new Date(getDate(a)).getTime()).map((o) => (
                        <tr key={o.id} className="border-t border-gray-100 hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-900">{o.name}</td>
                          <td className="px-4 py-3 text-blue-600">{o.email}</td>
                          <td className="px-4 py-3 text-gray-600">{o.phone || "—"}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-0.5 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">{SERVICE_NAMES[o.service] || o.service}</span>
                          </td>
                          <td className="px-4 py-3">
                            {getChat(o) ? <span className="text-green-600 text-xs font-medium">Completed</span> : <span className="text-gray-400 text-xs">None</span>}
                          </td>
                          <td className="px-4 py-3">
                            {(getFiles(o)?.length || 0) > 0 ? (
                              <span className="text-blue-600 text-xs font-medium">{getFiles(o)!.length} files</span>
                            ) : <span className="text-gray-400 text-xs">None</span>}
                          </td>
                          <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{formatDate(getDate(o))}<br/><span className="text-xs text-gray-400">{formatTime(getDate(o))}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

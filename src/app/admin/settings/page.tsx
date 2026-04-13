"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

interface SettingsData {
  company_profile: {
    companyName: string;
    registration: string;
    address: string;
    primaryEmail: string;
    secondaryEmail: string;
    phone: string;
  };
  warehouse: {
    temperatureRange: string;
    humidity: string;
    storageCapacity: string;
  };
  notifications: {
    newOrderAlerts: boolean;
    lowStockWarnings: boolean;
    deliveryConfirmations: boolean;
    monthlyReports: boolean;
  };
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/settings")
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, unknown> = {};
        data.forEach((s: { key: string; value: unknown }) => { map[s.key] = s.value; });
        setSettings(map as unknown as SettingsData);
        setLoading(false);
      });
  }, []);

  async function handleSave() {
    if (!settings) return;
    const res = await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    if (res.ok) {
      toast.success("Settings saved");
    } else {
      toast.error("Failed to save settings");
    }
  }

  if (loading || !settings) {
    return <div className="p-8"><p className="text-sip-text-muted">Loading...</p></div>;
  }

  const tabs = ["General", "Notifications", "Integrations", "Billing"];
  const cp = settings.company_profile;
  const wh = settings.warehouse;
  const notif = settings.notifications;

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-sip-text-muted text-sm mt-1">System configuration and preferences</p>
      </div>

      <div className="flex gap-6 border-b border-sip-border-subtle">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab.toLowerCase())}
            className={`pb-3 text-sm font-medium transition-colors border-b-2 ${
              activeTab === tab.toLowerCase()
                ? "border-sip-amber text-sip-amber"
                : "border-transparent text-sip-text-secondary hover:text-white"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 space-y-5">
            <h2 className="text-white font-semibold">Company Profile</h2>
            {[
              { label: "Company Name", key: "companyName", value: cp.companyName },
              { label: "Registration", key: "registration", value: cp.registration },
              { label: "Address", key: "address", value: cp.address },
              { label: "Primary Email", key: "primaryEmail", value: cp.primaryEmail },
              { label: "Secondary Email", key: "secondaryEmail", value: cp.secondaryEmail },
              { label: "Phone", key: "phone", value: cp.phone },
            ].map((field) => (
              <div key={field.key}>
                <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">{field.label}</label>
                <input
                  value={field.value}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      company_profile: { ...cp, [field.key]: e.target.value },
                    })
                  }
                  className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sip-amber"
                />
              </div>
            ))}
            <button
              onClick={handleSave}
              className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
            >
              Save Changes
            </button>
          </div>

          <div className="space-y-6">
            <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 space-y-5">
              <h2 className="text-white font-semibold">Warehouse Settings</h2>
              {[
                { label: "Temperature Range", key: "temperatureRange", value: wh.temperatureRange },
                { label: "Humidity", key: "humidity", value: wh.humidity },
                { label: "Storage Capacity", key: "storageCapacity", value: wh.storageCapacity },
              ].map((field) => (
                <div key={field.key}>
                  <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">{field.label}</label>
                  <input
                    value={field.value}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        warehouse: { ...wh, [field.key]: e.target.value },
                      })
                    }
                    className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sip-amber"
                  />
                </div>
              ))}
            </div>

            <div className="bg-sip-card border border-sip-border-card rounded-xl p-6 space-y-4">
              <h2 className="text-white font-semibold">Notification Preferences</h2>
              {[
                { label: "New order alerts", key: "newOrderAlerts" },
                { label: "Low-stock warnings", key: "lowStockWarnings" },
                { label: "Delivery confirmations", key: "deliveryConfirmations" },
                { label: "Monthly reports", key: "monthlyReports" },
              ].map((field) => (
                <div key={field.key} className="flex items-center justify-between">
                  <span className="text-sip-text-secondary text-sm">{field.label}</span>
                  <button
                    onClick={() =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...notif,
                          [field.key]: !notif[field.key as keyof typeof notif],
                        },
                      })
                    }
                    className={`w-10 h-6 rounded-full transition-colors relative ${
                      notif[field.key as keyof typeof notif] ? "bg-sip-amber" : "bg-sip-border-subtle"
                    }`}
                  >
                    <span
                      className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                        notif[field.key as keyof typeof notif] ? "left-5" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-sip-card border border-sip-border-card rounded-xl p-6">
          <p className="text-sip-text-muted">Notification channel configuration coming soon.</p>
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="bg-sip-card border border-sip-border-card rounded-xl p-6">
          <p className="text-sip-text-muted">Integration settings coming soon.</p>
        </div>
      )}

      {activeTab === "billing" && (
        <div className="bg-sip-card border border-sip-border-card rounded-xl p-6">
          <p className="text-sip-text-muted">Billing information coming soon.</p>
        </div>
      )}
    </div>
  );
}

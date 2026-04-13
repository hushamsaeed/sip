"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { FileText, Eye, Save } from "lucide-react";

interface ContentSection {
  id: string;
  slug: string;
  title: string;
  fields: Record<string, unknown>;
  status: string;
  updatedAt: string;
}

export default function ContentManagerPage() {
  const [sections, setSections] = useState<ContentSection[]>([]);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [editFields, setEditFields] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/content")
      .then((r) => r.json())
      .then((data) => {
        setSections(data);
        if (data.length > 0) {
          setActiveSlug(data[0].slug);
          flattenFields(data[0].fields);
        }
        setLoading(false);
      });
  }, []);

  function flattenFields(fields: Record<string, unknown>) {
    const flat: Record<string, string> = {};
    for (const [key, value] of Object.entries(fields)) {
      if (typeof value === "string") {
        flat[key] = value;
      }
    }
    setEditFields(flat);
  }

  const activeSection = sections.find((s) => s.slug === activeSlug);

  function selectSection(slug: string) {
    const section = sections.find((s) => s.slug === slug);
    if (section) {
      setActiveSlug(slug);
      flattenFields(section.fields);
    }
  }

  async function handleSave(publish: boolean) {
    if (!activeSection) return;
    const updatedFields = { ...activeSection.fields };
    for (const [key, value] of Object.entries(editFields)) {
      (updatedFields as Record<string, unknown>)[key] = value;
    }

    const res = await fetch(`/api/content/${activeSection.slug}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fields: updatedFields, status: publish ? "PUBLISHED" : "DRAFT" }),
    });

    if (res.ok) {
      toast.success(publish ? "Content published!" : "Draft saved");
      const updated = await res.json();
      setSections(sections.map((s) => (s.slug === updated.slug ? updated : s)));
    } else {
      toast.error("Failed to save");
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center h-full">
        <p className="text-sip-text-muted">Loading content...</p>
      </div>
    );
  }

  const sectionIcons: Record<string, string> = {
    hero: "Hero Section",
    about: "About Section",
    services: "Services",
    infrastructure: "Infrastructure",
    contact: "Contact & Footer",
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Manager</h1>
          <p className="text-sip-text-muted text-sm mt-1">Manage your website sections and page content</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave(true)}
            className="bg-sip-amber hover:bg-sip-amber/90 text-sip-bg-primary text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
          >
            Publish Changes
          </button>
          <button
            onClick={() => handleSave(false)}
            className="text-sip-text-secondary border border-sip-border-subtle rounded-lg px-4 py-2 text-sm flex items-center gap-2 hover:text-white transition-colors"
          >
            <Save className="w-4 h-4" /> Save Draft
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Section List */}
        <div className="space-y-1">
          <p className="text-sip-text-muted text-xs uppercase tracking-wide mb-3">Page Sections</p>
          {sections.map((section) => (
            <button
              key={section.slug}
              onClick={() => selectSection(section.slug)}
              className={`w-full text-left px-4 py-3 rounded-lg flex items-center gap-3 transition-colors ${
                activeSlug === section.slug
                  ? "bg-sip-card border border-sip-amber/30 text-white"
                  : "text-sip-text-secondary hover:bg-sip-card hover:text-white"
              }`}
            >
              <FileText className="w-5 h-5 text-sip-amber" />
              <div>
                <p className="text-sm font-medium">{sectionIcons[section.slug] || section.title}</p>
                <p className="text-xs text-sip-text-muted">
                  {section.status === "PUBLISHED" ? "Published" : "Draft"} &middot; Last edited{" "}
                  {new Date(section.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          ))}
        </div>

        {/* Editor */}
        <div className="col-span-2 bg-sip-card border border-sip-border-card rounded-xl p-6">
          {activeSection ? (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-white font-semibold text-lg">
                  {sectionIcons[activeSection.slug] || activeSection.title}
                </h2>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeSection.status === "PUBLISHED"
                      ? "bg-emerald-500/20 text-emerald-400"
                      : "bg-sip-amber/20 text-sip-amber"
                  }`}>
                    {activeSection.status === "PUBLISHED" ? "Published" : "Draft"}
                  </span>
                  <a href="/" target="_blank" className="text-sip-text-secondary hover:text-white text-sm flex items-center gap-1">
                    <Eye className="w-4 h-4" /> Preview
                  </a>
                </div>
              </div>
              <div className="space-y-5">
                {Object.entries(editFields).map(([key, value]) => (
                  <div key={key}>
                    <label className="text-sip-text-muted text-xs uppercase tracking-wide block mb-2">
                      {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                    </label>
                    {value.length > 100 ? (
                      <textarea
                        value={value}
                        onChange={(e) => setEditFields({ ...editFields, [key]: e.target.value })}
                        rows={3}
                        className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sip-amber resize-none"
                      />
                    ) : (
                      <input
                        value={value}
                        onChange={(e) => setEditFields({ ...editFields, [key]: e.target.value })}
                        className="w-full bg-sip-bg-secondary border border-sip-border-subtle rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sip-amber"
                      />
                    )}
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-sip-text-muted text-center py-12">Select a section to edit</p>
          )}
        </div>
      </div>
    </div>
  );
}

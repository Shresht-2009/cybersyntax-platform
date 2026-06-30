"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/mentor/announcements")
      .then((r) => r.json())
      .then(setAnnouncements)
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await fetch("/api/mentor/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, imageUrl }),
    });
    if (res.ok) {
      const data = await res.json();
      setAnnouncements((prev) => [data, ...prev]);
      setTitle("");
      setContent("");
      setImageUrl("");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold cyber-text-gradient mb-2">Announcements</h1>
        <p className="text-[#8888aa]">Create and manage announcements for your students.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="cyber-input w-full px-4 py-2.5 rounded-lg text-lg"
            placeholder="Announcement title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="cyber-input w-full px-4 py-2.5 rounded-lg min-h-[120px] resize-y"
            placeholder="Write your announcement..."
            required
          />
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="cyber-input w-full px-4 py-2.5 rounded-lg"
            placeholder="Image URL (optional)"
          />
          <button
            type="submit"
            disabled={loading}
            className="cyber-btn px-6 py-2.5 rounded-lg"
          >
            {loading ? "Publishing..." : "Publish Announcement"}
          </button>
        </form>
      </motion.div>

      <div className="space-y-4">
        {announcements.length === 0 && (
          <div className="text-center py-12 text-[#8888aa]">No announcements yet.</div>
        )}
        {announcements.map((ann, i) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-6"
          >
            {ann.imageUrl && (
              <img src={ann.imageUrl} alt="" className="w-full max-h-64 object-cover rounded-xl mb-4" />
            )}
            <h3 className="text-xl font-semibold mb-2">{ann.title}</h3>
            <p className="text-[#8888aa] whitespace-pre-wrap">{ann.content}</p>
            <p className="text-xs text-[#555] mt-3">
              {new Date(ann.createdAt).toLocaleDateString("en-US", {
                year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
              })}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

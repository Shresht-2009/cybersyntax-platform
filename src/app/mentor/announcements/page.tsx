"use client";

import { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import { useUploadThing } from "@/lib/uploadthing";

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [videoUrl, setVideoUrl] = useState("");
  const [mediaType, setMediaType] = useState<"none" | "image" | "video">("none");
  const [loading, setLoading] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const { startUpload: uploadImage, isUploading: isImageUploading } = useUploadThing("announcementImage", {
    onClientUploadComplete: (res: { url: string }[] | undefined) => { if (res?.[0]) { setImageUrl(res[0].url); setMediaType("image"); } },
  });

  const { startUpload: uploadVideo, isUploading: isVideoUploading } = useUploadThing("courseVideo", {
    onClientUploadComplete: (res: { url: string }[] | undefined) => { if (res?.[0]) { setVideoUrl(res[0].url); setMediaType("video"); } },
  });

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
      body: JSON.stringify({ title, content, imageUrl: mediaType === "image" ? imageUrl : null, videoUrl: mediaType === "video" ? videoUrl : null }),
    });
      if (res.ok) {
      const data = await res.json();
      setAnnouncements((prev) => [data, ...prev]);
      setTitle("");
      setContent("");
      setImageUrl("");
      setVideoUrl("");
      setMediaType("none");
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="page-header">
        <h1 className="text-3xl font-bold text-gradient mb-2">Announcements</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Create and manage announcements for your students.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="card p-6"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input w-full text-lg"
            placeholder="Announcement title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea w-full min-h-[120px]"
            placeholder="Write your announcement..."
            required
          />
          <div className="space-y-2">
            <div className="flex gap-2">
              <button type="button" onClick={() => imageInputRef.current?.click()}
                className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${mediaType === "image" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
                style={mediaType !== "image" ? { color: 'var(--text-secondary)' } : {}}>
                {isImageUploading ? "Uploading..." : imageUrl ? "Image Added ✓" : "Add Image"}
              </button>
              <button type="button" onClick={() => videoInputRef.current?.click()}
                className={`flex-1 py-2.5 rounded-lg text-sm transition-all ${mediaType === "video" ? "btn-primary" : "bg-[var(--bg-secondary)]"}`}
                style={mediaType !== "video" ? { color: 'var(--text-secondary)' } : {}}>
                {isVideoUploading ? "Uploading..." : videoUrl ? "Video Added ✓" : "Add Video"}
              </button>
              {mediaType !== "none" && (
                <button type="button" onClick={() => { setImageUrl(""); setVideoUrl(""); setMediaType("none"); }}
                  className="px-3 py-2.5 rounded-lg text-sm" style={{ color: 'var(--accent-red)' }}>
                  ✕
                </button>
              )}
            </div>
            <input ref={imageInputRef} type="file" accept="image/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadImage([f]); }} />
            <input ref={videoInputRef} type="file" accept="video/*" className="hidden"
              onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadVideo([f]); }} />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary px-6 py-2.5"
          >
            {loading ? "Publishing..." : "Publish Announcement"}
          </button>
        </form>
      </motion.div>

      <div className="space-y-4">
        {announcements.length === 0 && (
          <div className="empty-state">
            <div className="empty-state-icon">
              <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
              </svg>
            </div>
            <h3 className="empty-state-title">No announcements yet</h3>
            <p className="empty-state-desc">Publish your first announcement above.</p>
          </div>
        )}
        {announcements.map((ann, i) => (
          <motion.div
            key={ann.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="card p-6"
          >
            {ann.imageUrl && (
              <img src={ann.imageUrl} alt="" className="w-full max-h-64 object-cover rounded-xl mb-4" />
            )}
            {ann.videoUrl && (
              <video controls className="w-full max-h-64 rounded-xl mb-4">
                <source src={ann.videoUrl} />
              </video>
            )}
            <div className="flex items-center gap-2 mb-3">
              {ann.imageUrl && <span className="badge badge-green">Image</span>}
              {ann.videoUrl && <span className="badge badge-purple">Video</span>}
            </div>
            <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{ann.title}</h3>
            <p className="whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{ann.content}</p>
            <p className="text-xs mt-3" style={{ color: 'var(--text-muted)' }}>
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

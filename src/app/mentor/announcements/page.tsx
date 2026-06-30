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
          <div className="space-y-2">
            <div className="flex gap-2">
              <button type="button" onClick={() => imageInputRef.current?.click()}
                className={`flex-1 py-2.5 rounded-lg text-sm border transition-all ${mediaType === "image" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-white/10 text-[#8888aa] hover:border-white/20"}`}>
                {isImageUploading ? "Uploading..." : imageUrl ? "Image Added ✓" : "Add Image"}
              </button>
              <button type="button" onClick={() => videoInputRef.current?.click()}
                className={`flex-1 py-2.5 rounded-lg text-sm border transition-all ${mediaType === "video" ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-400" : "border-white/10 text-[#8888aa] hover:border-white/20"}`}>
                {isVideoUploading ? "Uploading..." : videoUrl ? "Video Added ✓" : "Add Video"}
              </button>
              {mediaType !== "none" && (
                <button type="button" onClick={() => { setImageUrl(""); setVideoUrl(""); setMediaType("none"); }}
                  className="px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-red-500/10 transition-all">
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
            {ann.videoUrl && (
              <video controls className="w-full max-h-64 rounded-xl mb-4">
                <source src={ann.videoUrl} />
              </video>
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

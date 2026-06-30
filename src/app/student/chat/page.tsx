"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Pusher from "pusher-js";

export default function StudentChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const pusherRef = useRef<Pusher | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [search, setSearch] = useState("");

  const userId = (session?.user as any)?.id;

  useEffect(() => {
    fetch("/api/chat/conversations?role=STUDENT")
      .then((r) => r.json())
      .then(setConversations)
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeConv) return;
    fetch(`/api/chat/messages?conversationId=${activeConv.id}`)
      .then((r) => r.json())
      .then(setMessages)
      .catch(() => {});
  }, [activeConv]);

  useEffect(() => {
    if (!session?.user) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! });
    pusherRef.current = pusher;

    const channelName = activeConv ? `chat-${activeConv.id}` : null;
    let channel: any = null;
    if (channelName) {
      channel = pusher.subscribe(channelName);
      channel.bind("message", (msg: any) => {
        setMessages((prev) => [...prev, msg]);
      });
    }

    return () => {
      if (channel) pusher.unsubscribe(channelName!);
      pusher.disconnect();
    };
  }, [session, activeConv?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !activeConv || !session?.user) return;
    await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ conversationId: activeConv.id, content: text }),
    });
    setText("");
  };

  const getOther = (conv: any) =>
    conv.userOne?.id === userId ? conv.userTwo : conv.userOne;

  const filtered = conversations.filter((c) => {
    const other = getOther(c);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-80 card overflow-hidden flex flex-col shrink-0 rounded-2xl">
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="font-semibold mb-2">Chats</h2>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input text-sm"
            placeholder="Search..."
          />
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <AnimatePresence>
            {filtered.map((conv) => {
              const other = getOther(conv);
              return (
                <motion.button
                  key={conv.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  onClick={() => setActiveConv(conv)}
                  className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                    activeConv?.id === conv.id ? "nav-link active" : "hover:bg-white/[0.02]"
                  }`}
                  style={activeConv?.id !== conv.id ? { color: 'var(--text-secondary)' } : {}}
                >
                  <p className="font-medium truncate">{other?.name || "Unknown"}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{other?.email}</p>
                  {other?.role && (
                    <span className={`badge text-[10px] mt-1 ${other.role === 'MENTOR' ? 'badge-gold' : 'badge-emerald'}`}>
                      {other.role}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <p className="text-xs text-center p-4" style={{ color: 'var(--text-muted)' }}>
              No conversations yet. Your mentor will reach out.
            </p>
          )}
        </div>
      </div>

      <div className="flex-1 card rounded-2xl flex flex-col overflow-hidden">
        {activeConv ? (
          <>
            <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold">{getOther(activeConv)?.name}</h3>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{getOther(activeConv)?.email}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.senderId === userId ? "glass" : ""
                    }`}
                    style={{
                      background: msg.senderId !== userId ? 'rgba(255,255,255,0.02)' : undefined,
                      color: 'var(--text-primary)',
                    }}
                  >
                    <p>{msg.content}</p>
                    <p className="text-[10px] opacity-50 mt-1" style={{ color: 'var(--text-muted)' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="input flex-1"
                  placeholder="Type a message..."
                />
                <button onClick={sendMessage} className="btn-primary px-4 py-2.5">Send</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-3" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Select a conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

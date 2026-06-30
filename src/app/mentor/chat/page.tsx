"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { io, Socket } from "socket.io-client";

export default function MentorChatPage() {
  const { data: session } = useSession();
  const [conversations, setConversations] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const socketRef = useRef<Socket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat/conversations?role=MENTOR")
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
    const socket = io({ path: "/api/socket" });
    socketRef.current = socket;
    socket.emit("join", (session.user as any).id);
    socket.on("message", (msg: any) => {
      if (msg.conversationId === activeConv?.id) {
        setMessages((prev) => [...prev, msg]);
      }
    });
    return () => { socket.disconnect(); };
  }, [session, activeConv?.id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!text.trim() || !activeConv || !session?.user) return;
    const msg = { conversationId: activeConv.id, senderId: (session.user as any).id, content: text };
    socketRef.current?.emit("message", msg);
    await fetch("/api/chat/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(msg),
    });
    setText("");
  };

  const userId = (session?.user as any)?.id;

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-80 glass rounded-2xl overflow-hidden flex flex-col shrink-0">
        <div className="p-4 border-b border-[var(--cyber-border)]">
          <h2 className="font-semibold">Conversations</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {conversations.map((conv) => (
            <button key={conv.id} onClick={() => setActiveConv(conv)}
              className={`w-full p-3 rounded-xl text-left text-sm transition-all ${
                activeConv?.id === conv.id ? "bg-cyan-500/10 border border-cyan-500/20" : "hover:bg-white/5"
              }`}>
              <p className="font-medium truncate">{conv.student?.name || "Student"}</p>
              <p className="text-xs text-[#8888aa] truncate">{conv.student?.email}</p>
            </button>
          ))}
          {conversations.length === 0 && <p className="text-xs text-[#8888aa] text-center p-4">No conversations yet</p>}
        </div>
      </div>

      <div className="flex-1 glass rounded-2xl flex flex-col overflow-hidden">
        {activeConv ? (
          <>
            <div className="p-4 border-b border-[var(--cyber-border)]">
              <h3 className="font-semibold">{activeConv.student?.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                    msg.senderId === userId ? "bg-cyan-500/20 text-cyan-100" : "bg-white/10"
                  }`}>
                    <p>{msg.content}</p>
                    <p className="text-[10px] opacity-50 mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-[var(--cyber-border)]">
              <div className="flex gap-2">
                <input type="text" value={text} onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                  className="cyber-input flex-1 px-4 py-2.5 rounded-lg" placeholder="Type a message..." />
                <button onClick={sendMessage} className="cyber-btn px-4 py-2.5 rounded-lg">Send</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-[#8888aa]">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

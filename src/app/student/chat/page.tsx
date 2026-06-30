"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import Pusher from "pusher-js";

export default function StudentChatPage() {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id;

  const [tab, setTab] = useState<"private" | "groups">("private");
  const [users, setUsers] = useState<any[]>([]);
  const [conversations, setConversations] = useState<any[]>([]);
  const [groups, setGroups] = useState<any[]>([]);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [activeGroup, setActiveGroup] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");
  const [search, setSearch] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pusherRef = useRef<Pusher | null>(null);
  const [activeContact, setActiveContact] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/chat/conversations?role=STUDENT").then((r) => r.json()).then(setConversations).catch(() => {});
    fetch("/api/chat/users").then((r) => r.json()).then(setUsers).catch(() => {});
    fetch("/api/chat/groups").then((r) => r.json()).then(setGroups).catch(() => {});
  }, []);

  useEffect(() => {
    if (!activeConv || tab !== "private") return;
    fetch(`/api/chat/messages?conversationId=${activeConv.id}`).then((r) => r.json()).then(setMessages).catch(() => {});
  }, [activeConv, tab]);

  useEffect(() => {
    if (!activeGroup || tab !== "groups") return;
    fetch(`/api/chat/groups/${activeGroup.id}/messages`).then((r) => r.json()).then(setMessages).catch(() => {});
  }, [activeGroup, tab]);

  useEffect(() => {
    if (!session?.user) return;
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, { cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER! });
    pusherRef.current = pusher;
    let channel: any = null;
    const channelName = tab === "private" && activeConv ? `chat-${activeConv.id}` : tab === "groups" && activeGroup ? `group-${activeGroup.id}` : null;
    if (channelName) {
      channel = pusher.subscribe(channelName);
      channel.bind("message", (msg: any) => setMessages((prev) => [...prev, msg]));
    }
    return () => {
      if (channel) pusher.unsubscribe(channelName!);
      pusher.disconnect();
    };
  }, [session, tab, activeConv?.id, activeGroup?.id]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const sendMessage = async () => {
    if (!text.trim()) return;
    if (tab === "private" && activeConv) {
      await fetch("/api/chat/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conversationId: activeConv.id, content: text }),
      });
    } else if (tab === "groups" && activeGroup) {
      await fetch(`/api/chat/groups/${activeGroup.id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text }),
      });
    }
    setText("");
  };

  const startConversation = async (participantId: string) => {
    const res = await fetch("/api/chat/conversations", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ participantId }),
    });
    const conv = await res.json();
    setConversations((prev) => {
      const exists = prev.find((c) => c.id === conv.id);
      return exists ? prev : [conv, ...prev];
    });
    setActiveConv(conv);
    setActiveContact(participantId);
    setActiveGroup(null);
    setTab("private");
  };

  const getOther = (conv: any) => conv.userOne?.id === userId ? conv.userTwo : conv.userOne;

  const filteredUsers = users.filter((u) => u.name?.toLowerCase().includes(search.toLowerCase()));
  const filteredConversations = conversations.filter((c) => {
    const other = getOther(c);
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  const contactsDisplay = search
    ? filteredUsers
    : users.filter((u) => !conversations.some((c) => getOther(c)?.id === u.id));

  return (
    <div className="flex h-[calc(100vh-8rem)] gap-4">
      <div className="w-80 card overflow-hidden flex flex-col shrink-0 rounded-2xl">
        <div className="p-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-3">
            <button
              onClick={() => { setTab("private"); setActiveGroup(null); }}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${tab === "private" ? "btn-primary text-xs py-1.5" : "btn-ghost text-xs py-1.5"}`}
              style={tab === "private" ? {} : { color: 'var(--text-secondary)' }}
            >
              Private
            </button>
            <button
              onClick={() => { setTab("groups"); setActiveConv(null); }}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-all ${tab === "groups" ? "btn-primary text-xs py-1.5" : "btn-ghost text-xs py-1.5"}`}
              style={tab === "groups" ? {} : { color: 'var(--text-secondary)' }}
            >
              Groups
            </button>
          </div>
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} className="input text-sm" placeholder="Search..." />
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {tab === "private" && (
            <>
              {contactsDisplay.length > 0 && (
                <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Mentors</div>
              )}
              {contactsDisplay.map((u) => (
                <button key={u.id} onClick={() => startConversation(u.id)}
                  className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center gap-3 ${activeContact === u.id ? "nav-link active" : "hover:bg-white/[0.02]"}`}
                  style={activeContact !== u.id ? { color: 'var(--text-secondary)' } : {}}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(245,158,11,0.08)' }}>
                    {u.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate text-sm">{u.name}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{u.email}</p>
                  </div>
                  <span className={`badge text-[9px] ${u.role === "MENTOR" ? "badge-gold" : "badge-emerald"}`}>{u.role}</span>
                </button>
              ))}
              <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Conversations</div>
              {filteredConversations.map((conv) => {
                const other = getOther(conv);
                return (
                  <button key={conv.id} onClick={() => { setActiveConv(conv); setActiveContact(other?.id); }}
                    className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center gap-3 ${activeConv?.id === conv.id ? "nav-link active" : "hover:bg-white/[0.02]"}`}
                    style={activeConv?.id !== conv.id ? { color: 'var(--text-secondary)' } : {}}
                  >
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0" style={{ background: other?.role === "MENTOR" ? 'rgba(245,158,11,0.08)' : 'rgba(16,185,129,0.08)' }}>
                      {other?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate text-sm">{other?.name}</p>
                      <p className="text-xs truncate" style={{ color: 'var(--text-muted)' }}>{conv.messages?.[0]?.content || "No messages"}</p>
                    </div>
                    {other?.role && (
                      <span className={`badge text-[9px] ${other.role === "MENTOR" ? "badge-gold" : "badge-emerald"}`}>{other.role}</span>
                    )}
                  </button>
                );
              })}
              {filteredConversations.length === 0 && !search && (
                <p className="text-xs text-center p-4" style={{ color: 'var(--text-muted)' }}>No conversations yet. Click a mentor above to start.</p>
              )}
            </>
          )}

          {tab === "groups" && (
            <>
              {groups.length === 0 && (
                <p className="text-xs text-center p-4" style={{ color: 'var(--text-muted)' }}>No group chats yet. A mentor will invite you.</p>
              )}
              {groups.map((g) => (
                <button key={g.id} onClick={() => { setActiveGroup(g); setActiveConv(null); }}
                  className={`w-full p-3 rounded-xl text-left text-sm transition-all flex items-center gap-3 ${activeGroup?.id === g.id ? "nav-link active" : "hover:bg-white/[0.02]"}`}
                  style={activeGroup?.id !== g.id ? { color: 'var(--text-secondary)' } : {}}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.08)' }}>
                    <svg className="w-4 h-4" style={{ color: 'var(--accent-gold)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate text-sm">{g.name}</p>
                    <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{g.members?.length || 0} members</p>
                  </div>
                </button>
              ))}
            </>
          )}
        </div>
      </div>

      <div className="flex-1 card rounded-2xl flex flex-col overflow-hidden">
        {tab === "private" && activeConv ? (
          <>
            <div className="p-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold">{getOther(activeConv)?.name}</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.senderId === userId ? "glass" : ""}`}
                    style={{ background: msg.senderId !== userId ? 'rgba(255,255,255,0.02)' : undefined, color: 'var(--text-primary)' }}>
                    <p>{msg.content}</p>
                    <p className="text-[10px] opacity-50 mt-1" style={{ color: 'var(--text-muted)' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex gap-2">
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="input flex-1" placeholder="Type a message..." />
                <button onClick={sendMessage} className="btn-primary px-4 py-2.5">Send</button>
              </div>
            </div>
          </>
        ) : tab === "groups" && activeGroup ? (
          <>
            <div className="p-4 border-b shrink-0" style={{ borderColor: 'var(--border)' }}>
              <h3 className="font-semibold">{activeGroup.name}</h3>
              <div className="flex flex-wrap gap-1 mt-1">
                {activeGroup.members?.map((m: any) => (
                  <span key={m.id} className={`badge text-[9px] ${m.role === "MENTOR" ? "badge-gold" : "badge-emerald"}`}>{m.user?.name}</span>
                ))}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg: any) => (
                <div key={msg.id} className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[70%] p-3 rounded-2xl text-sm ${msg.senderId === userId ? "glass" : ""}`}
                    style={{ background: msg.senderId !== userId ? 'rgba(255,255,255,0.02)' : undefined, color: 'var(--text-primary)' }}>
                    {msg.senderId !== userId && (
                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--accent-gold)' }}>{msg.sender?.name}</p>
                    )}
                    <p>{msg.content}</p>
                    <p className="text-[10px] opacity-50 mt-1" style={{ color: 'var(--text-muted)' }}>
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="p-4 shrink-0" style={{ borderTop: '1px solid var(--border)' }}>
              <div className="flex gap-2">
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && sendMessage()} className="input flex-1" placeholder="Type a message..." />
                <button onClick={sendMessage} className="btn-primary px-4 py-2.5">Send</button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center flex-col gap-3" style={{ color: 'var(--text-muted)' }}>
            <svg className="w-12 h-12 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-sm">Select a conversation or mentor to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}

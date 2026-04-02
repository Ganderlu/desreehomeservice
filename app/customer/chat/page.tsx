"use client";
import { useEffect, useRef, useState } from "react";
import { db } from "../../../lib/firebase/client";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { useUserStore } from "../../../store/store";

type Msg = { id?: string; text: string; createdAt?: any; sender: string };

export default function ChatPage() {
  const { uid } = useUserStore();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [text, setText] = useState("");
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const q = query(
      collection(db, "chats", "global", "messages"),
      orderBy("createdAt", "asc"),
    );
    const unsub = onSnapshot(q, (snap: any) => {
      setMessages(
        snap.docs.map((d: any) => ({ id: d.id, ...(d.data() as any) })),
      );
      setTimeout(
        () => listRef.current?.scrollTo({ top: 999999, behavior: "smooth" }),
        50,
      );
    });
    return () => unsub();
  }, []);

  async function send() {
    if (!uid || !text) return;
    await addDoc(collection(db, "chats", "global", "messages"), {
      text,
      sender: uid,
      createdAt: serverTimestamp(),
    });
    setText("");
  }

  return (
    <div className="container-padded py-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-secondary">Chat</h1>
      <div
        ref={listRef}
        className="mt-4 h-[60vh] overflow-y-auto rounded-xl border bg-white p-4"
      >
        {messages.map((m) => (
          <div
            key={m.id}
            className={`mb-2 flex ${m.sender === uid ? "justify-end" : ""}`}
          >
            <div
              className={`max-w-[70%] rounded-xl px-3 py-2 ${m.sender === uid ? "bg-primary text-white" : "bg-gray-100 text-secondary"}`}
            >
              {m.text}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex gap-2">
        <Input
          placeholder="Type message"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={send}>Send</Button>
      </div>
    </div>
  );
}

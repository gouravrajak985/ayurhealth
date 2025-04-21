"use client";

import { useEffect, useRef } from "react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { BotAvatar } from "@/components/chat/bot-avatar";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store";

interface ChatMessagesProps {
  chatId: string;
  isPending?: boolean;
  className?: string;
}

export function ChatMessages({ 
  chatId,
  isPending = false,
  className
}: ChatMessagesProps) {
  const { getChat } = useChatStore();
  const chat = getChat(chatId);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);
  
  if (!chat) return null;
  
  return (
    <div className={cn("flex flex-col gap-4 px-4 py-6", className)}>
      {chat.messages.map((message) => (
        <div 
          key={message.id} 
          className={cn(
            "flex w-full gap-3 p-4 rounded-lg",
            message.role === "user" 
              ? "bg-primary-foreground" 
              : "bg-muted/50"
          )}
        >
          {message.role === "user" ? (
            <UserAvatar />
          ) : (
            <BotAvatar />
          )}
          <div className="flex-1 overflow-hidden">
            <p className="text-sm">
              {message.content}
            </p>
          </div>
        </div>
      ))}
      
      {isPending && (
        <div className="flex w-full gap-3 p-4 rounded-lg bg-muted/50">
          <BotAvatar />
          <div className="flex-1 overflow-hidden">
            <p className="text-sm animate-pulse">●●●</p>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
}
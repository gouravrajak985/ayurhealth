"use client";

import { useEffect, useRef } from "react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { BotAvatar } from "@/components/chat/bot-avatar";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
          <div className="flex-1 overflow-hidden prose dark:prose-invert max-w-none">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                // Override default element styling
                p: ({node, ...props}) => <p className="text-sm mb-2 last:mb-0" {...props} />,
                h1: ({node, ...props}) => <h1 className="text-xl font-bold mb-3" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-lg font-semibold mb-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-base font-medium mb-2" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                li: ({node, ...props}) => <li className="mb-1" {...props} />,
                code: ({node, ...props}) => <code className="bg-muted px-1 py-0.5 rounded text-sm" {...props} />,
                pre: ({node, ...props}) => <pre className="bg-muted p-3 rounded-lg overflow-x-auto mb-2" {...props} />,
                blockquote: ({node, ...props}) => (
                  <blockquote className="border-l-4 border-muted pl-4 italic mb-2" {...props} />
                ),
              }}
            >
              {message.content}
            </ReactMarkdown>
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
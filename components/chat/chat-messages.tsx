"use client";

import { useEffect, useRef } from "react";
import { UserAvatar } from "@/components/chat/user-avatar";
import { BotAvatar } from "@/components/chat/bot-avatar";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/lib/store";
import { useMessageSounds } from "@/lib/sounds";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from "framer-motion";

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
  const { playMessageIn, playMessageOut } = useMessageSounds();
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  useEffect(() => {
    scrollToBottom();
    if (chat?.messages.length && chat.messages[chat.messages.length - 1].role === 'assistant') {
      playMessageIn();
    }
  }, [chat?.messages, playMessageIn]);
  
  if (!chat) return null;
  
  return (
    <div className={cn("flex flex-col gap-4 px-4 py-6", className)}>
      <AnimatePresence initial={false}>
        {chat.messages.map((message, index) => (
          <motion.div 
            key={message.id || index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
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
          </motion.div>
        ))}
      </AnimatePresence>
      
      <AnimatePresence>
        {isPending && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex w-full gap-3 p-4 rounded-lg bg-muted/50"
          >
            <BotAvatar />
            <div className="flex-1 overflow-hidden">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="flex gap-1"
              >
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="w-2 h-2 bg-green-500 rounded-full" />
                <span className="w-2 h-2 bg-green-500 rounded-full" />
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div ref={messagesEndRef} />
    </div>
  );
}
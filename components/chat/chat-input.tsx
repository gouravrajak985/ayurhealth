"use client";

import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { useChatStore } from "@/lib/store";

interface ChatInputProps {
  chatId: string;
  onSend: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({ 
  chatId, 
  onSend, 
  disabled = false,
  placeholder = "Type your message..."
}: ChatInputProps) {
  const [message, setMessage] = useState("");
  const { addMessage } = useChatStore();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim()) return;
    
    addMessage(chatId, message, "user");
    onSend(message);
    setMessage("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="relative border-t bg-background p-4">
      <div className="relative flex items-center">
        <TextareaAutosize
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={placeholder}
          className="w-full resize-none rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
          maxRows={5}
          disabled={disabled}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
        />
        <Button 
          type="submit"
          variant="ghost" 
          size="icon" 
          className="absolute right-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground" 
          disabled={disabled || !message.trim()}
        >
          <Send className="h-5 w-5" />
          <span className="sr-only">Send</span>
        </Button>
      </div>
    </form>
  );
}
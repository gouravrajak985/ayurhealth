"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { useChatStore } from "@/lib/store";
import { getAyurvedicAdvice } from "@/lib/gemini";
import Link from "next/link";
import { useParams } from "next/navigation";
import { toast } from "sonner";

export default function ChatPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId as string;
  const { getChat, addMessage, fetchChats } = useChatStore();
  const [isPending, setIsPending] = useState(false);
  
  useEffect(() => {
    fetchChats();
  }, [fetchChats]);
  
  const chat = getChat(chatId);
  
  const handleSendMessage = async (message: string) => {
    if (isPending) return;
    
    setIsPending(true);
    
    try {
      const response = await getAyurvedicAdvice(message);
      await addMessage(chatId, response, "assistant");
    } catch (error) {
      console.error("Failed to get AI response:", error);
      toast.error("Failed to get response. Please try again.");
    } finally {
      setIsPending(false);
    }
  };
  
  // Auto-respond to the first message if this is a new chat with only one message
  useEffect(() => {
    const autoRespond = async () => {
      if (chat && chat.messages.length === 1 && chat.messages[0].role === "user") {
        handleSendMessage(chat.messages[0].content);
      }
    };
    
    autoRespond();
  }, [chat]);
  
  if (!chat) return null;
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <Link href="/chat">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Button>
        </Link>
        <h1 className="text-lg font-medium truncate">{chat.title}</h1>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <ChatMessages chatId={chatId} isPending={isPending} />
      </div>
      
      <ChatInput 
        chatId={chatId} 
        onSend={handleSendMessage} 
        disabled={isPending}
        placeholder="Ask for Ayurvedic advice..."
      />
    </div>
  );
}
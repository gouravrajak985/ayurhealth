"use client";

import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "@/components/chat/chat-input";
import { ChatMessages } from "@/components/chat/chat-messages";
import { useChatStore } from "@/lib/store";
import Link from "next/link";
import { useParams } from "next/navigation";

// Simulated AI response function (in a real app, this would call the Gemini API)
const simulateAIResponse = async (message: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      // Example responses based on keywords
      if (message.toLowerCase().includes("sleep")) {
        resolve("Based on your sleep patterns, I recommend practicing 'Nidra Yoga' before bed - a form of yogic sleep that helps calm the nervous system. Also consider drinking warm milk with a pinch of nutmeg to improve sleep quality. In Ayurveda, proper sleep (nidra) is considered one of the three pillars of health alongside diet and balanced energy.");
      } else if (message.toLowerCase().includes("stress")) {
        resolve("For stress management, I recommend practicing 'Pranayama' breathing exercises, especially 'Anulom Vilom' (alternate nostril breathing) for 10 minutes daily. Consider adding adaptogenic herbs like Ashwagandha to your routine, which helps balance cortisol levels. Also, a gentle self-massage with warm sesame oil before bathing can help calm your nervous system.");
      } else if (message.toLowerCase().includes("diet") || message.toLowerCase().includes("food")) {
        resolve("Based on your dietary patterns, focus on including all six tastes (sweet, sour, salty, pungent, bitter, astringent) in your meals for balanced nutrition. Try starting your day with a small piece of ginger with lemon and honey to stimulate digestion. Focus on warm, freshly cooked meals rather than cold or processed foods to maintain your digestive fire (agni).");
      } else {
        resolve("According to Ayurvedic principles, maintaining balance in your daily routine is essential for optimal health. Consider implementing a consistent daily schedule (dinacharya) that aligns with natural cycles. Wake up before sunrise, practice gentle movement, and ensure you're eating your main meal when the sun is at its highest. Remember, prevention is the core philosophy of Ayurveda - maintaining balance prevents illness before it manifests.");
      }
    }, 1500); // Simulate network delay
  });
};

export default function ChatPage() {
  const params = useParams<{ chatId: string }>();
  const chatId = params.chatId as string;
  const { getChat, addMessage } = useChatStore();
  const [isPending, setIsPending] = useState(false);
  const chat = getChat(chatId);
  
  const handleSendMessage = async (message: string) => {
    if (isPending) return;
    
    setIsPending(true);
    
    try {
      // Here we would normally call the Gemini API
      const response = await simulateAIResponse(message);
      addMessage(chatId, response, "assistant");
    } catch (error) {
      console.error("Failed to get AI response:", error);
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
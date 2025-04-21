"use client";

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';

interface WellnessState {
  checkIns: {
    date: string;
    responses: Record<string, string>;
  }[];
  addCheckIn: (date: string, responses: Record<string, string>) => Promise<void>;
  fetchCheckIns: () => Promise<void>;
  shouldPromptNewCheckIn: () => boolean;
}

export const useWellnessStore = create<WellnessState>()((set, get) => ({
  checkIns: [],
  addCheckIn: async (date, responses) => {
    try {
      const response = await fetch('/api/wellness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date, responses }),
      });
      
      if (!response.ok) throw new Error('Failed to save check-in');
      
      const checkIn = await response.json();
      set((state) => ({
        checkIns: [...state.checkIns, checkIn],
      }));
    } catch (error) {
      console.error('Error adding check-in:', error);
      throw error;
    }
  },
  fetchCheckIns: async () => {
    try {
      const response = await fetch('/api/wellness');
      if (!response.ok) throw new Error('Failed to fetch check-ins');
      
      const checkIns = await response.json();
      set({ checkIns });
    } catch (error) {
      console.error('Error fetching check-ins:', error);
    }
  },
  shouldPromptNewCheckIn: () => {
    const checkIns = get().checkIns;
    if (checkIns.length === 0) return true;
    
    const today = new Date().toISOString().split('T')[0];
    const lastCheckIn = new Date(checkIns[0].date).toISOString().split('T')[0];
    
    return today !== lastCheckIn;
  },
}));

interface ChatState {
  chats: {
    id: string;
    title: string;
    createdAt: string;
    messages: {
      id: string;
      content: string;
      role: 'user' | 'system' | 'assistant';
      createdAt: string;
    }[];
  }[];
  activeChat: string | null;
  createChat: (title: string) => string;
  getChat: (id: string) => any;
  addMessage: (chatId: string, content: string, role: 'user' | 'system' | 'assistant') => Promise<void>;
  setActiveChat: (chatId: string) => void;
  fetchChats: () => Promise<void>;
}

export const useChatStore = create<ChatState>()((set, get) => ({
  chats: [],
  activeChat: null,
  createChat: (title) => {
    const id = uuidv4();
    const newChat = {
      id,
      title,
      createdAt: new Date().toISOString(),
      messages: [],
    };
    
    set((state) => ({
      chats: [newChat, ...state.chats],
      activeChat: id,
    }));
    
    return id;
  },
  getChat: (id) => {
    return get().chats.find(chat => chat.id === id);
  },
  addMessage: async (chatId, content, role) => {
    const messageId = uuidv4();
    const newMessage = {
      id: messageId,
      content,
      role,
      createdAt: new Date().toISOString(),
    };

    set((state) => ({
      chats: state.chats.map(chat => 
        chat.id === chatId 
          ? {
              ...chat,
              messages: [...chat.messages, newMessage],
            }
          : chat
      ),
    }));

    try {
      await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, role }),
      });
    } catch (error) {
      console.error('Error adding message:', error);
      // Remove the message if the API call fails
      set((state) => ({
        chats: state.chats.map(chat => 
          chat.id === chatId 
            ? {
                ...chat,
                messages: chat.messages.filter(msg => msg.id !== messageId),
              }
            : chat
        ),
      }));
      throw error;
    }
  },
  setActiveChat: (chatId) => {
    set({ activeChat: chatId });
  },
  fetchChats: async () => {
    try {
      const response = await fetch('/api/chats');
      if (!response.ok) throw new Error('Failed to fetch chats');
      
      const chats = await response.json();
      set({ chats });
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  },
}));
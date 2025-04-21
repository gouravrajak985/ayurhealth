"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useWellnessStore, useChatStore } from "@/lib/store";
import { useState } from "react";
import { toast } from "sonner";

export default function SettingsPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [privacyMode, setPrivacyMode] = useState(false);
  
  const handleResetData = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all your data? This will delete all your chats and wellness check-ins."
    );
    
    if (confirmReset) {
      // Clear the localStorage
      localStorage.removeItem('wellness-storage');
      localStorage.removeItem('chat-storage');
      
      // Reload the page to refresh the stores
      window.location.reload();
      
      toast.success("All data has been reset successfully");
    }
  };
  
  return (
    <div className="container p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent mb-8">
        Settings
      </h1>
      
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Notifications</CardTitle>
            <CardDescription>Manage how and when you receive notifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="daily-reminder" className="flex-1">
                Daily check-in reminders
                <span className="text-sm text-muted-foreground block mt-1">
                  Receive a reminder to complete your daily wellness check-in
                </span>
              </Label>
              <Switch 
                id="daily-reminder" 
                checked={notificationsEnabled}
                onCheckedChange={setNotificationsEnabled}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how AyurHealth.AI looks on your device</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="dark-mode" className="flex-1">
                Dark Mode
                <span className="text-sm text-muted-foreground block mt-1">
                  Use dark mode for reduced eye strain in low light environments
                </span>
              </Label>
              <Switch 
                id="dark-mode" 
                checked={darkMode}
                onCheckedChange={setDarkMode}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Privacy</CardTitle>
            <CardDescription>Manage your privacy settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="privacy-mode" className="flex-1">
                Privacy Mode
                <span className="text-sm text-muted-foreground block mt-1">
                  Hide sensitive information when using the app in public
                </span>
              </Label>
              <Switch 
                id="privacy-mode" 
                checked={privacyMode}
                onCheckedChange={setPrivacyMode}
              />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Data Management</CardTitle>
            <CardDescription>Manage your personal data</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              This will permanently delete all your chats, wellness check-ins, and preferences. This action cannot be undone.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              variant="destructive" 
              onClick={handleResetData}
            >
              Reset All Data
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
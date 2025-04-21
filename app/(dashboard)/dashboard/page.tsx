import { auth } from "@clerk/nextjs";
import { ArrowRight, MessageSquare, LineChart } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { userId } = auth();
  const currentDate = new Date();
  
  return (
    <div className="container p-6 max-w-5xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-teal-600 dark:from-green-400 dark:to-teal-400 bg-clip-text text-transparent">Welcome to AyurHealth.AI</h1>
          <p className="text-muted-foreground mt-1">Your personal Ayurvedic wellness companion</p>
        </div>
        <p className="text-muted-foreground">{formatDate(currentDate)}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="overflow-hidden border-green-200 dark:border-green-900">
          <CardHeader className="bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>Daily Check-in</span>
            </CardTitle>
            <CardDescription>Share how you're feeling today</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>Regular check-ins help us provide more personalized Ayurvedic advice tailored to your current state of wellbeing.</p>
          </CardContent>
          <CardFooter>
            <Link href="/chat/new" className="w-full">
              <Button className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600">
                Start Today's Check-in
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
        
        <Card className="overflow-hidden border-teal-200 dark:border-teal-900">
          <CardHeader className="bg-gradient-to-r from-teal-500/10 to-blue-500/10 dark:from-teal-500/20 dark:to-blue-500/20">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-5 w-5 text-teal-600 dark:text-teal-400" />
              <span>Wellness Tracker</span>
            </CardTitle>
            <CardDescription>Monitor your wellness journey</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p>Track your daily habits and see how consistent Ayurvedic practices are improving your overall wellbeing.</p>
          </CardContent>
          <CardFooter>
            <Link href="/tracker" className="w-full">
              <Button variant="outline" className="w-full border-teal-500/50 text-teal-700 dark:text-teal-400 hover:bg-teal-500/10">
                View Your Progress
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      
      <div className="mb-8">
        <Tabs defaultValue="tips">
          <TabsList className="mb-4">
            <TabsTrigger value="tips">Daily Tips</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>
          <TabsContent value="tips" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-4">Today's Ayurvedic Wisdom</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="bg-green-100 dark:bg-green-900 h-8 w-8 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 flex-shrink-0">1</div>
                <div>
                  <h4 className="font-medium">Morning Rituals</h4>
                  <p className="text-muted-foreground">Start your day with a warm glass of water with lemon to stimulate digestion and cleanse your system.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-teal-100 dark:bg-teal-900 h-8 w-8 rounded-full flex items-center justify-center text-teal-600 dark:text-teal-400 flex-shrink-0">2</div>
                <div>
                  <h4 className="font-medium">Mindful Eating</h4>
                  <p className="text-muted-foreground">Eat your largest meal at midday when digestive fire (agni) is strongest.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="bg-blue-100 dark:bg-blue-900 h-8 w-8 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">3</div>
                <div>
                  <h4 className="font-medium">Evening Calm</h4>
                  <p className="text-muted-foreground">Sip warm milk with a pinch of nutmeg before bed to promote restful sleep.</p>
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="resources" className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
            <h3 className="text-xl font-medium mb-4">Helpful Resources</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Beginner's Guide to Ayurveda</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Understand the basics of doshas, elements, and Ayurvedic principles.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="px-0 text-green-600 dark:text-green-400">
                    Read Guide
                  </Button>
                </CardFooter>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Seasonal Wellness</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Learn how to adapt your routines and diet to seasonal changes.</p>
                </CardContent>
                <CardFooter>
                  <Button variant="link" className="px-0 text-teal-600 dark:text-teal-400">
                    Learn More
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
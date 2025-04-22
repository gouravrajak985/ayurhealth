"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Loader2, Settings, User } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface UserProfile {
 weight?: number;
 height?: number;
    age?: number
    geneder?: string;
    foodPreference?: string;
}

interface Recipe {
  name: string;
  ingredients: string[];
  instructions: string[];
}

interface Meal {
  time: string;
  items: string[];
  herbs: string[];
  recipe: Recipe;
}

interface DailyPlan {
  day: string;
  meals: Meal[];
  remedies: string[];
}

interface DietPlan {
  _id: string;
  weekStartDate: string;
  dailyPlans: DailyPlan[];
}

export function DietPlan() {
  const [userProfile, setProfile] = useState<UserProfile | null>(null);
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
    fetchDietPlan();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/user/');
      if (response.ok) {
        const data = await response.json();
        const profile = data.profile || null;
        setProfile(profile);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  const fetchDietPlan = async () => {
    try {
      const response = await fetch('/api/diet-plan');
      if (response.ok) {
        const data = await response.json();
        setDietPlan(data);
      }
    } catch (error) {
      console.error('Error fetching diet plan:', error);
    } finally {
      setLoading(false);
    }
  };
  const generateDietPlan = async () => {
    if (!userProfile) {
      toast.error('Please complete your profile in settings first');
      router.push('/settings');
      return;
    }

    try {
      setGenerating(true);
      const response = await fetch('/api/diet-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });

      if (response.ok) {
        const data = await response.json();
        setDietPlan(data);
        toast.success('Diet plan generated successfully');
      }
    } catch (error) {
      console.error('Error generating diet plan:', error);
      toast.error('Failed to generate diet plan');
    } finally {
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!userProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Diet Plan</CardTitle>
          <CardDescription>
            Complete your profile to get a personalized Ayurvedic diet plan
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg text-amber-900 dark:text-amber-100">
              <p>Please complete your profile in settings before generating a diet plan.</p>
              <p className="text-sm text-amber-800 dark:text-amber-200 mt-2">
                We need information about your weight, height, age, and food preferences to create a personalized plan.
              </p>
            </div>
            <Link href="/settings">
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Go to Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!dietPlan) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Diet Plan</CardTitle>
          <CardDescription>
            Generate a personalized Ayurvedic diet plan based on your profile
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Button
            onClick={generateDietPlan}
            className="w-full"
            disabled={generating}
          >
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating your diet plan...
              </>
            ) : (
              'Generate Diet Plan'
            )}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Weekly Diet Plan</CardTitle>
        <CardDescription>
          Personalized Ayurvedic meal plan for optimal wellness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={dietPlan.dailyPlans[0].day.toLowerCase()}>
          <TabsList className="grid grid-cols-7">
            {dietPlan.dailyPlans.map((day) => (
              <TabsTrigger key={day.day} value={day.day.toLowerCase()}>
                {day.day}
              </TabsTrigger>
            ))}
          </TabsList>
          
          {dietPlan.dailyPlans.map((day) => (
            <TabsContent key={day.day} value={day.day.toLowerCase()}>
              <div className="space-y-6">
                {day.meals.map((meal, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="text-lg font-semibold">{meal.time}</h3>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Meal Items</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {meal.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="font-medium">Recommended Herbs</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {meal.herbs.map((herb, i) => (
                          <li key={i}>{herb}</li>
                        ))}
                      </ul>
                    </div>

                    {meal.recipe && (
                      <div className="bg-muted p-4 rounded-lg space-y-3">
                        <h4 className="font-medium">{meal.recipe.name}</h4>
                        
                        <div>
                          <h5 className="text-sm font-medium mb-1">Ingredients:</h5>
                          <ul className="list-disc list-inside space-y-1 text-sm">
                            {meal.recipe.ingredients.map((ingredient, i) => (
                              <li key={i}>{ingredient}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-1">Instructions:</h5>
                          <ol className="list-decimal list-inside space-y-1 text-sm">
                            {meal.recipe.instructions.map((instruction, i) => (
                              <li key={i}>{instruction}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    )}
                  </div>
                ))}

                <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h3 className="font-medium mb-2">Daily Ayurvedic Remedies</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {day.remedies.map((remedy, index) => (
                      <li key={index}>{remedy}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
      <CardFooter>
        <Button
          onClick={generateDietPlan}
          variant="outline"
          className="w-full"
          disabled={generating}
        >
          Generate New Plan
        </Button>
      </CardFooter>
    </Card>
  );
}
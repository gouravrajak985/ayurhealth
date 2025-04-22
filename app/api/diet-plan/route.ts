import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import connectDB from '@/lib/db';
import { DietPlan } from '@/models/DietPlan';
import { User } from '@/models/User';
import { getAyurvedicDietPlan } from '@/lib/gemini';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    const currentWeekStart = new Date();
    currentWeekStart.setHours(0, 0, 0, 0);
    currentWeekStart.setDate(currentWeekStart.getDate() - currentWeekStart.getDay());

    const dietPlan = await DietPlan.findOne({
      userId,
      weekStartDate: {
        $gte: currentWeekStart,
      },
    }).sort({ weekStartDate: -1 });

    return NextResponse.json(dietPlan || null);
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    
    // Get user profile
    const user = await User.findOne({ userId });

    if (!user) {
      return new NextResponse('User not found', { status: 404 });
    }

    const { profile} = user;

    const { preferences } = await req.json();
    
    // Generate diet plan using Gemini
    const dietPlanData = await getAyurvedicDietPlan({
      weight: profile.weight,
      height: profile.height,
      gender: profile.gender,
      age: profile.age,
      foodPreference: profile.foodPreference,
      ...preferences,
    });

    const weekStartDate = new Date();
    weekStartDate.setHours(0, 0, 0, 0);
    weekStartDate.setDate(weekStartDate.getDate() - weekStartDate.getDay());

    const dietPlan = await DietPlan.create({
      userId,
      weekStartDate,
      dailyPlans: dietPlanData,
    });

    return NextResponse.json(dietPlan);
  } catch (error) {
    console.error('Error creating diet plan:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
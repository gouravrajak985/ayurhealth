import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs';
import connectDB from '@/lib/db';
import { User } from '@/models/User';

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    await connectDB();
    let user = await User.findOne({ userId });

    if (!user) {
      user = await User.create({ userId });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { weight, height, age, gender, foodPreference } = await req.json();
    console.log('Received data:', { weight, height, age, gender, foodPreference, userId });

    await connectDB();

    const user = await User.findOneAndUpdate(
      { userId },
      { 
        profile: {
          weight,
          height,
          age,
          gender,
          foodPreference
        }
      },
      { new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error updating user:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
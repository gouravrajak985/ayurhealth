"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function SubscriptionPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleSubscription = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/subscription', {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to create subscription');
      
      const order = await response.json();
      
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'AyurHealth.AI',
        description: 'Premium Subscription',
        order_id: order.id,
        handler: async (response: any) => {
          try {
            const verifyResponse = await fetch('/api/subscription', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) throw new Error('Payment verification failed');

            toast.success('Subscription activated successfully!');
            router.push('/dashboard');
          } catch (error) {
            console.error('Payment verification failed:', error);
            toast.error('Failed to verify payment. Please contact support.');
          }
        },
        prefill: {
          name: 'User',
          email: 'user@example.com',
        },
        theme: {
          color: '#10B981',
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      console.error('Subscription error:', error);
      toast.error('Failed to initiate subscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container p-6 max-w-2xl mx-auto">
      <Card className="border-green-200 dark:border-green-900">
        <CardHeader className="text-center bg-gradient-to-r from-green-500/10 to-teal-500/10 dark:from-green-500/20 dark:to-teal-500/20">
          <CardTitle className="text-3xl">Premium Subscription</CardTitle>
          <CardDescription>
            Unlock unlimited access to personalized Ayurvedic wellness advice
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="text-center mb-6">
            <p className="text-4xl font-bold">₹999</p>
            <p className="text-sm text-muted-foreground">per month</p>
          </div>
          <div className="space-y-4">
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Unlimited AI consultations</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Personalized wellness tracking</span>
            </div>
            <div className="flex items-center">
              <svg className="h-5 w-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
              <span>Priority support</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600"
            onClick={handleSubscription}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Get Subscription'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
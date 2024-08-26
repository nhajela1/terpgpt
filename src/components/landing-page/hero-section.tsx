"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection: React.FC = () => {
  const router = useRouter();
  return (
    <div className="bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-800 text-white">
      <div className="container mx-auto px-4 sm:py-5">
        <div className="grid grid-rows-1 lg:grid-rows-2 gap-8 items-center justify-center">

        <div className="flex flex-col items-center lg:flex-row lg:items-start lg:justify-center max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center lg:text-left mb-8 lg:mb-0 lg:mr-12">
            <img
              src="/terpgpt-logo.png"
              alt="TerpGPT"
              className="inline-block w-32 h-32 sm:w-40 sm:h-40 mb-6 lg:mb-0 mt-4"
            />
          </div>
          <div className="max-w-2xl text-center lg:text-left">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Welcome to TerpGPT
            </h1>
            <p className="text-lg sm:text-xl mb-8 text-purple-100">
              Your intelligent AI assistant for all UMD professor 
              information. Ask any question, get instant answers!
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="font-semibold text-indigo-900 bg-white hover:bg-purple-100 transition-colors"
              onClick={() => {
                router.push("/chat");
              }}
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
        </div>




          <div className="space-y-8 ">
            <FeatureCard
              icon={<GraduationCap className="h-8 w-8" />}
              title="Professor Insights"
              description="Learn about professors' backgrounds and teaching styles."
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="24/7 Assistance"
              description="Get answers to your questions anytime, anywhere."
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => {
  return (
    <Card className="bg-white bg-opacity-10 border-0 backdrop-blur-sm hover:bg-opacity-20 transition-all">
      <CardContent className="flex items-center p-6">
        <div className="mr-6 text-purple-300">{icon}</div>
        <div>
          <h3 className="font-semibold text-white text-xl mb-2">{title}</h3>
          <p className="text-purple-100">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSection;

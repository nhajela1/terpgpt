import React from "react";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const HeroSection: React.FC = () => {
  return (
    <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
      <div className="container mx-auto px-4 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">
              Welcome to Profsly AI
            </h1>
            <p className="text-xl mb-8">
              Your intelligent AI assistant for all university course
              information. Ask any question, get instant answers!
            </p>
            <Button
              variant="secondary"
              size="lg"
              className="font-semibold text-indigo-600"
            >
              Get Started
              <ArrowRight className="ml-2" size={20} />
            </Button>
          </div>
          <div className="space-y-6">
            <FeatureCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Comprehensive Course Info"
              description="Access detailed information about any university course."
            />
            <FeatureCard
              icon={<GraduationCap className="h-6 w-6" />}
              title="Professor Insights"
              description="Learn about professors' backgrounds and teaching styles."
            />
            <FeatureCard
              icon={<MessageSquare className="h-6 w-6" />}
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
    <Card className="bg-white bg-opacity-10 border-0">
      <CardContent className="flex items-center p-4">
        <div className="mr-4 text-white">{icon}</div>
        <div>
          <h3 className="font-semibold text-white text-lg">{title}</h3>
          <p className="text-sm text-gray-200">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeroSection;

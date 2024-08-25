import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Home = () => {
  const router = useRouter();

  const handleBackClick = () => {
    router.push('/');
  };

  return (
    <div className="p-4">
      <Button 
        variant="ghost" 
        onClick={handleBackClick} 
        className="mb-4"
      >
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
      </Button>
      {/* Add more content for your home page here */}
    </div>
  );
};

export default Home;
"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import Chat from "@/components/chat-page/chat";
import ReviewCards from "@/components/chat-page/review-cards";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import reviews from "../../../python-backend/reviews.json";
import { Review } from "@/components/chat-page/review-cards";
import Home from "@/components/home/home";

interface ChatProps {
  setReviews: React.Dispatch<React.SetStateAction<Review[]>>;
}
import { ThemeToggle } from "@/components/darktheme/darktheme";

export default function ChatPage() {

  const [reviews, setReviews] = useState<Review[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm TerpGPT. How can I help you today?`,
    },
  ]);
  

  // Detect screen width and set the state
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 640); // Default small breakpoint in Tailwind CSS is 640px
    };

    // Initial check
    handleResize();

    // Add event listener for resize
    window.addEventListener("resize", handleResize);

    // Clean up the event listener
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <Home />
      <ThemeToggle />
      <div className="h-screen p-4" id="chat-page">
        <div
          className="h-full flex"
          id="review-chat-section"
          style={{ maxHeight: "calc(100vh - 2rem)" }}
        >
          {isSmallScreen ? (
            <Tabs
              defaultValue="chat"
              className="w-full flex flex-col y-overflow-auto"
            >
              <TabsList>
                <TabsTrigger value="review">Reviews</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <ScrollArea>
                <TabsContent
                  value="review"
                  style={{
                    minHeight: "calc(80vh)",
                    maxHeight: "calc(82vh)",
                    flex: 1,
                  }}
                >
                  <ReviewCards reviews={reviews} />
                </TabsContent>
              </ScrollArea>
              <TabsContent
                value="chat"
                style={{
                  minHeight: "calc(80vh)",
                  maxHeight: "calc(82vh)",
                  flex: 1,
                }}
              >
                <Chat
                  setReviews={setReviews}
                  messages={messages}
                  setMessages={setMessages}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <>
              <div className="w-1/2 h-[84vh] overflow-y-auto">
                <ScrollArea>
                  <ReviewCards reviews={reviews} />
                </ScrollArea>
              </div>
              <Chat
                setReviews={setReviews}
                messages={messages}
                setMessages={setMessages}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

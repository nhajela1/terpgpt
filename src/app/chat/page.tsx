"use client";
import React, { useState, useEffect } from "react";
import Chat from "@/components/chat-page/chat";
import ReviewCards from "@/components/chat-page/review-cards";
import CourseCards from "@/components/chat-page/course-cards";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/darktheme/darktheme";
import { Review } from "@/components/chat-page/review-cards";
import { CourseInfo } from "@/components/chat-page/course-cards";

export default function ChatPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [courses, setCourses] = useState<CourseInfo[]>([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm TerpGPT. How can I help you today?`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  console.log("Current courses state:", courses);

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
                <TabsTrigger value="info">Info</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
              </TabsList>
              <ScrollArea>
                <TabsContent
                  value="info"
                  style={{
                    minHeight: "calc(80vh)",
                    maxHeight: "calc(90vh)",
                    flex: 1,
                  }}
                >
                  <ScrollArea>
                    {reviews.length > 0 && <ReviewCards reviews={reviews} />}
                    {courses.length > 0 && <CourseCards courses={courses} />}
                  </ScrollArea>
                </TabsContent>
              </ScrollArea>
              <TabsContent
                value="chat"
                style={{
                  minHeight: "calc(80vh)",
                  maxHeight: "calc(90vh)",
                  flex: 1,
                }}
              >
                <Chat
                  setReviews={setReviews}
                  setCourses={setCourses}
                  messages={messages}
                  setMessages={setMessages}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </TabsContent>
            </Tabs>
          ) : (
            <>
              <div className="w-1/2 h-full overflow-y-auto">
                <ScrollArea>
                  {reviews.length > 0 && <ReviewCards reviews={reviews} />}
                  {courses.length > 0 && <CourseCards courses={courses} />}
                </ScrollArea>
              </div>
              <Chat
                setReviews={setReviews}
                setCourses={setCourses}
                messages={messages}
                setMessages={setMessages}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
}

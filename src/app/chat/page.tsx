"use client";
import React, { useState, useEffect } from "react";
import Chat from "@/components/chat-page/chat";
import ReviewCards from "@/components/chat-page/review-cards";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import reviews from "../../../python-backend/reviews.json";

export default function ChatPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

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

  const subjects = Array.from(
    new Set(reviews.reviews.map((review) => review.subject))
  );
  const professors = Array.from(
    new Set(reviews.reviews.map((review) => review.professor))
  );

  return (
    <div className="h-screen bg-gray-100 p-4" id="chat-page">
      {/* Header */}
      {/* Filter section */}
      <Card className="mb-4" id="filter-section" style={{ maxHeight: "calc(20vh)" }}>
        <CardContent className="p-4">
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
            <div className="flex-1">
              <Label htmlFor="subject-select" className="mb-2 block">
                Subject
              </Label>
              <Select
                value={selectedSubject}
                onValueChange={setSelectedSubject}
              >
                <SelectTrigger id="subject-select">
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label htmlFor="professor-select" className="mb-2 block">
                Professor
              </Label>
              <Select
                value={selectedProfessor}
                onValueChange={setSelectedProfessor}
              >
                <SelectTrigger id="professor-select">
                  <SelectValue placeholder="Select a professor" />
                </SelectTrigger>
                <SelectContent>
                  {professors.map((prof) => (
                    <SelectItem key={prof} value={prof}>
                      {prof}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Review cards and chat sections */}
      <div className="h-full flex" id="review-chat-section" style={{ maxHeight: "calc(80vh)" }}>
        {isSmallScreen ? (
          <Tabs defaultValue="chat" className="w-full flex flex-col y-overflow-auto">
            <TabsList>
              <TabsTrigger value="review">Reviews</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="review">
              <ScrollArea>
                <ReviewCards
                  review={reviews.reviews[0]}
                  reviews={reviews}
                  selectedSubject={selectedSubject}
                  selectedProfessor={selectedProfessor}
                />
              </ScrollArea>
            </TabsContent>
            <TabsContent value="chat" style={{ maxHeight: "calc(65vh)" }}>
              <Chat />
            </TabsContent>
          </Tabs>
        ) : (
          <>
            <div className="w-1/2 h-full overflow-y-auto">
              <ScrollArea>
                <ReviewCards
                  review={reviews.reviews[0]}
                  reviews={reviews}
                  selectedSubject={selectedSubject}
                  selectedProfessor={selectedProfessor}
                />
              </ScrollArea>
            </div>
            <Chat />
          </>
        )}
      </div>
    </div>
  );
}

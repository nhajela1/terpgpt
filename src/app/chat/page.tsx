"use client";
import React, { useState, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import Chat from "@/components/chat-page/chat";
import ReviewCards from "@/components/chat-page/review-cards";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send, Loader2, Sidebar } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import reviews from "../../../python-backend/reviews.json";
import { ThemeToggle } from "@/components/darktheme/darktheme";

export default function ChatPage() {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");

  // Mock data for classes and professors
  const subjects = Array.from(
    new Set(reviews.reviews.map((review) => review.subject))
  );
  const professors = Array.from(
    new Set(reviews.reviews.map((review) => review.professor))
  );

  return (
    <> 
    <ThemeToggle />
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
        {/* Review Cards section */}
        <ScrollArea>
          <ReviewCards
            review={reviews.reviews[0]}
            reviews={reviews}
            selectedSubject={selectedSubject}
            selectedProfessor={selectedProfessor}
          ></ReviewCards>
        </ScrollArea>

        {/* Chat section */}
        <Chat></Chat>
      </div>
    </div>
    </>
  );
}

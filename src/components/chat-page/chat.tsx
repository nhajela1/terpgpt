"use client";
import React, { useState, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import reviews from "../../../python-backend/reviews.json";
import { useTheme } from "next-themes";

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm Profsly. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedProfessor, setSelectedProfessor] = useState("");
  const { theme, systemTheme } = useTheme();

  // Mock data for classes and professors
  const subjects = Array.from(
    new Set(reviews.reviews.map((review) => review.subject))
  );
  const professors = Array.from(
    new Set(reviews.reviews.map((review) => review.professor))
  );

  const sendMessage = async () => {
    if (message.trim() === "") return;
    setLoading(true);
    setMessage("");

    // Prepare the message with filter information, but don't show it in the UI
    const fullMessage = message;
    const messageWithFilters = `[Subject: ${selectedSubject}, Professor: ${selectedProfessor}] ${message}`;

    setMessages((messages) => [
      ...messages,
      { role: "user", content: fullMessage },
      { role: "assistant", content: "" },
    ]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ...messages,
          { role: "user", content: messageWithFilters },
        ]),
      });

      if (!response.body) {
        throw new Error("Response body is null");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        result += text;
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1];
          let otherMessages = messages.slice(0, messages.length - 1);
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ];
        });
      }
    } catch (error) {
      console.error("Error:", error);
      setMessages((messages) => [
        ...messages,
        {
          role: "assistant",
          content: "Sorry, an error occurred. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="h-full w-full flex pl-4">
      <Card className="h-full w-full flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow">
          <CardContent className="p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`mb-4 ${
                  message.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <div
                  className={`inline-block p-3 rounded-lg ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : theme === "dark" ||
                        (theme === "system" && systemTheme === "dark")
                      ? "bg-gray-800 text-white"
                      : "bg-gray-200 text-blue-900"
                  }`}
                >
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </CardContent>
        </ScrollArea>
        <CardFooter className="flex p-4 border-t">
          <div className="flex w-full items-center space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type your message here..."
              className="flex-grow"
            />
            <Button
              onClick={sendMessage}
              disabled={loading || message.trim() === ""}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
              <span className="ml-2">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";
import { useState, KeyboardEvent } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import HeroSection from "@/components/landing-page/hero-section";
import FAQSection from "@/components/landing-page/faq-section";
import ContactSection from "@/components/landing-page/contact-section";

export default function Home() {
  // Set up the state for the messages
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Hi! I'm Profsly. How can I help you today?`,
    },
  ]);
  const [message, setMessage] = useState("");

  // Set up the state for the loading indicator
  const [loading, setLoading] = useState(false);

  // Function to handle sending messages
  const sendMessage = async () => {
    if (message.trim() === "") return;
    setMessage("");
    setMessages((messages) => [
      ...messages,
      { role: "user", content: message },
      { role: "assistant", content: "" },
    ]);

    const response = fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([...messages, { role: "user", content: message }]),
    }).then(async (res) => {
      if (!res.body) {
        throw new Error("Response body is null");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let result = "";

      return reader
        .read()
        .then(function processText({
          done,
          value,
        }: ReadableStreamReadResult<Uint8Array>): Promise<string> {
          if (done) {
            return Promise.resolve(result);
          }
          const text = decoder.decode(value || new Uint8Array(), {
            stream: true,
          });
          result += text;
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
          return reader.read().then(processText);
        });
    });
  };

  // Function to handle key press
  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <HeroSection />
      <FAQSection />
      <ContactSection />
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Card className="w-[500px] h-[700px]">
          <CardContent className="p-6 flex flex-col h-full">
            <ScrollArea className="flex-grow pr-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.role === "assistant"
                      ? "justify-start"
                      : "justify-end"
                  } mb-4`}
                >
                  <div
                    className={`rounded-lg p-3 max-w-[70%] ${
                      message.role === "assistant"
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-secondary-foreground"
                    }`}
                  >
                    <ReactMarkdown>{message.content}</ReactMarkdown>
                  </div>
                </div>
              ))}
            </ScrollArea>
          </CardContent>
          <CardFooter className="p-6">
            <div className="flex w-full space-x-2">
              <Input
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-grow"
              />
              <Button onClick={sendMessage}>Send</Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}

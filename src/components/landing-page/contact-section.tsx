'use client';
import React, { useState, ChangeEvent, FormEvent } from 'react';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Mail, MessageSquare, Send } from "lucide-react";

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message || 'Your message has been sent!');
        setFormData({ name: '', email: '', message: '' });
      } else {
        alert(data.message || 'There was a problem sending your message.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <section className="bg-gradient-to-br from-purple-900 via-indigo-800 to-purple-800 py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="bg-white bg-opacity-10 backdrop-blur-sm border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-white">
                Contact Us
              </CardTitle>
              <CardDescription className="text-purple-100">
                Have questions? Get in touch with the Profsly AI team.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Your name"
                    required
                    className="bg-white bg-opacity-20 text-white placeholder-purple-200"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Your email"
                    required
                    className="bg-white bg-opacity-20 text-white placeholder-purple-200"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-white">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    placeholder="Your message"
                    required
                    className="bg-white bg-opacity-20 text-white placeholder-purple-200"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-white text-indigo-900 hover:bg-purple-100 transition-colors"
                >
                  Send Message
                  <Send className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="mt-10 flex justify-center space-x-8 text-white">
            <div className="flex items-center">
              <Mail className="mr-3 h-6 w-6 text-purple-300" />
              <span>support@profsly.ai</span>
            </div>
            <div className="flex items-center">
              <MessageSquare className="mr-3 h-6 w-6 text-purple-300" />
              <span>Live chat available</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

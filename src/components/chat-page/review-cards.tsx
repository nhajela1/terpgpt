"use client"

import React, { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@radix-ui/react-scroll-area';

// Define the Review type
interface Review {
  subject: string;
  professor: string;
  review: string;
}

// Define the Props type
interface ReviewCardsProps {
  review: Review;
  reviews: { reviews: Review[] };
  selectedSubject: string | null;
  selectedProfessor: string | null;
}

const ReviewCards: React.FC<ReviewCardsProps> = ({
  review,
  reviews,
  selectedSubject,
  selectedProfessor,
}) => {
  useEffect(() => {
    const subjects = Array.from(
      new Set(reviews.reviews.map((review) => review.subject))
    );
    const professors = Array.from(
      new Set(reviews.reviews.map((review) => review.professor))
    );
  }, [reviews, selectedSubject, selectedProfessor]);

  return (
    <Card className="sm:w-full sm:h-auto">
      {/* Reviews for chosen subject and professor */}
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Reviews for chosen subject and professor:</h2>
        <div>
        {reviews.reviews
          .filter(
            (review) =>
              (!selectedSubject || review.subject === selectedSubject) &&
              (!selectedProfessor || review.professor === selectedProfessor)
          )
          .map((review, index) => (
            <ScrollArea>
            <Card key={index} className="mb-4">
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">
                  {review.subject} - {review.professor}
                </h3>
                <ReactMarkdown>{review.review}</ReactMarkdown>
              </CardContent>
            </Card>
            </ScrollArea>
          ))}
          </div>
      </CardContent>
    </Card>
  );
};

export default ReviewCards;
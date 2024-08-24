"use client";

import React, { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useQueryState } from "nuqs";

// Define the Review type
interface Review {
  subject: string;
  professor: string;
  review: string;
  stars: number;
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

  const [course, _] = useQueryState('course');
  const [professor, __] = useQueryState('professor');


  return (
    <Card className="sm:w-full sm:max-h-full sm:min-h-full">
      {/* Reviews for chosen subject and professor */}
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Reviews for chosen subject and professor:
        </h2>
        <div>
          {reviews.reviews
            .filter(
              (review) =>
                (!course || review.subject === course) &&
                (!professor || review.professor === professor)
            )
            .map((review, index) => (
              <ScrollArea key={index}>
                <Card className="mb-4">
                  <CardContent className="pt-3 pb-3">
                    <h3 className="font-semibold text-lg mb-2">
                      {review.subject} - {review.professor} ({review.stars}/5
                      stars)
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

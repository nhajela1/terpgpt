"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";

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
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [shouldShowExpand, setShouldShowExpand] = useState<boolean[]>([]);

  const reviewRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  const calculateShouldShowExpand = () => {
    const newShouldShowExpand = reviews.reviews.map((_, index) => {
      const element = reviewRefs.current[index];
      if (element) {
        const lineHeight = parseFloat(
          getComputedStyle(element).lineHeight || "1.2"
        );
        const lines = element.scrollHeight / lineHeight;
        return lines > 4;
      }
      return false;
    });
    setShouldShowExpand(newShouldShowExpand);
  };

  useEffect(() => {
    // Initial calculation of whether to show expand/collapse
    calculateShouldShowExpand();

    // Function to handle window resize
    const handleResize = () => {
      calculateShouldShowExpand();
    };

    // Add event listener for window resize
    window.addEventListener("resize", handleResize);

    // Cleanup function to remove event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [reviews, selectedSubject, selectedProfessor]);

  return (
    <Card className="sm:w-full sm:h-auto">
      {/* Reviews for chosen subject and professor */}
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">
          Reviews for chosen subject and professor:
        </h2>
        <div>
          {reviews.reviews
            .filter(
              (review) =>
                (!selectedSubject || review.subject === selectedSubject) &&
                (!selectedProfessor || review.professor === selectedProfessor)
            )
            .map((review, index) => (
              <ScrollArea key={index}>
                <Card className="mb-4">
                  <CardContent className="pt-3 pb-3">
                    <h3 className="font-semibold text-lg mb-2">
                      {review.subject} - {review.professor} ({review.stars}/5
                      stars)
                    </h3>
                    <div
                      ref={(el) => {
                        reviewRefs.current[index] = el;
                      }}
                      className={`relative ${
                        expandedIndex === index || !shouldShowExpand[index]
                          ? ""
                          : "max-h-[2.8em] overflow-hidden"
                      }`}
                    >
                      <ReactMarkdown>{review.review}</ReactMarkdown>
                      {expandedIndex !== index && shouldShowExpand[index] && (
                        <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent h-[1.5em]" />
                      )}
                    </div>
                    {/* If shouldShowExpand[index] is true, the "&&" operator will render the button. */}
                    {shouldShowExpand[index] && (
                      <button
                        onClick={() => toggleExpand(index)}
                        className="text-blue-500 mt-2"
                      >
                        {expandedIndex === index ? "See less" : "...see more"}
                      </button>
                    )}
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

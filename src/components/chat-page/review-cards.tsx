"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Define the Review type
export interface Review {
  professor: string;
  expected_grade: string;
  review: string;
  average_rating: number;
  courses: string[];
}

interface GroupedReviews {
  [professor: string]: {
    reviews: Review[];
    average_rating: number;
    courses: string[];
  };
}

// Define the Props type
interface ReviewCardsProps {
  reviews: Review[];
}

const ReviewCards: React.FC<ReviewCardsProps> = ({ reviews }) => {
  const [expandedIndex, setExpandedIndex] = useState<
    Record<string, number | null>
  >({});
  const [shouldShowExpand, setShouldShowExpand] = useState<
    Record<string, boolean[]>
  >({});

  const reviewRefs = useRef<Record<string, (HTMLDivElement | null)[]>>({});

  const toggleExpand = (professor: string, index: number) => {
    setExpandedIndex((prev) => ({
      ...prev,
      [professor]: prev[professor] === index ? null : index,
    }));
  };

  const calculateShouldShowExpand = () => {
    const newShouldShowExpand = Object.fromEntries(
      Object.entries(reviewRefs.current).map(([professor, refs]) => [
        professor,
        refs.map((ref) => {
          if (ref) {
            const lineHeight = parseFloat(
              getComputedStyle(ref).lineHeight || "1.2"
            );
            const lines = ref.scrollHeight / lineHeight;
            return lines > 4;
          }
          return false;
        }),
      ])
    );
    setShouldShowExpand(newShouldShowExpand);
  }

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
  }, [reviews]);

  if (reviews.length === 0) {
    return null;
  }

  const groupedReviews = groupReviews(reviews);

  return (
    <Card className="sm:w-full sm:h-auto">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Reviews:</h2>
        {Object.entries(groupedReviews).map(([professor, data]) => (
          <div key={professor} className="mb-8">
            <h3 className="text-lg font-semibold mb-2">{professor}</h3>
            <div className="mb-4">
              <p>
                <strong>Courses:</strong> {data.courses.join(", ")}
              </p>
              <p>
                <strong>Average Rating:</strong>{" "}
                {data.average_rating.toFixed(1)}/5 stars
              </p>
            </div>
            <div>
              {data.reviews.map((review, index) => (
                <ScrollArea key={index}>
                  <Card className="mb-4">
                    <CardContent className="pt-3 pb-3">
                      <h4 className="font-semibold text-lg mb-2">
                        Expected Grade: {review.expected_grade}
                      </h4>
                      <div
                        ref={(el) => {
                          if (!reviewRefs.current[professor]) {
                            reviewRefs.current[professor] = [];
                          }
                          reviewRefs.current[professor][index] = el;
                        }}
                        className={`relative ${
                          expandedIndex[professor] === index ||
                          !shouldShowExpand[professor]?.[index]
                            ? ""
                            : "max-h-[2.8em] overflow-hidden"
                        }`}
                      >
                        <ReactMarkdown>{review.review}</ReactMarkdown>
                        {expandedIndex[professor] !== index &&
                          shouldShowExpand[professor]?.[index] && (
                            <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent h-[1.5em]" />
                          )}
                      </div>
                      {shouldShowExpand[professor]?.[index] && (
                        <button
                          onClick={() => toggleExpand(professor, index)}
                          className="text-blue-500 mt-2"
                        >
                          {expandedIndex[professor] === index
                            ? "See less"
                            : "...see more"}
                        </button>
                      )}
                    </CardContent>
                  </Card>
                </ScrollArea>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

const groupReviews = (reviews: Review[]): GroupedReviews => {
  return reviews.reduce((acc: GroupedReviews, review) => {
    if (!acc[review.professor]) {
      acc[review.professor] = {
        reviews: [],
        average_rating: 0,
        courses: [],
      };
    }
    acc[review.professor].reviews.push(review);
    acc[review.professor].average_rating = review.average_rating;
    acc[review.professor].courses = review.courses;
    return acc;
  }, {});
};

export default ReviewCards;

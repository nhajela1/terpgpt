"use client";

import React, { useEffect, useState, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useTheme } from "next-themes";
import ReactStars from "react-stars";

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
  const { theme, systemTheme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState<
    Record<string, number | null>
  >({});
  const [shouldShowExpand, setShouldShowExpand] = useState<
    Record<string, boolean[]>
  >({});

  const reviewRefs = useRef<Record<string, (HTMLDivElement | null)[]>>({});

  // ResizeObserver to check if the content height has changed
  const resizeObserver = useRef<ResizeObserver | null>(null);

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
            return lines > 5;
          }
          return false;
        }),
      ])
    );
    setShouldShowExpand(newShouldShowExpand);
  };

  useEffect(() => {
    if (!resizeObserver.current) {
      resizeObserver.current = new ResizeObserver(calculateShouldShowExpand);
    }

    // Attach the observer to each review element
    Object.values(reviewRefs.current).forEach((refs) =>
      refs.forEach((ref) => {
        if (ref) {
          resizeObserver.current?.observe(ref);
        }
      })
    );

    // Cleanup function to remove ResizeObserver
    return () => {
      if (resizeObserver.current) {
        Object.values(reviewRefs.current).forEach((refs) =>
          refs.forEach((ref) => {
            if (ref) {
              resizeObserver.current?.unobserve(ref);
            }
          })
        );
        resizeObserver.current.disconnect();
      }
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
              <div className="flex items-center">
                <p className="flex items-center">
                  <strong>Average Rating:</strong>{" "}
                  <ReactStars
                    count={5}
                    value={data.average_rating}
                    size={18}
                    color2={"#ffd700"}
                    edit={false}
                    className="pl-1" // Added padding to the left of the stars
                  />
                  <span className="ml-1">
                    ({data.average_rating.toFixed(2)})
                  </span>
                </p>
              </div>
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
                            : "max-h-[5.6em] overflow-hidden"
                        }`}
                      >
                        <ReactMarkdown>{review.review}</ReactMarkdown>
                        {expandedIndex[professor] !== index &&
                          shouldShowExpand[professor]?.[index] && (
                            <div
                              className={`absolute bottom-0 left-0 w-full bg-gradient-to-t ${
                                theme === "dark" ||
                                (theme === "system" && systemTheme === "dark")
                                  ? "from-gray-900 to-transparent"
                                  : "from-white to-transparent"
                              } h-[1.5em]`}
                            />
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

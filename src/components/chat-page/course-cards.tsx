"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@radix-ui/react-scroll-area";

// Define the CourseInfo type
export interface CourseInfo {
  average_gpa: number;
  course_number: string;
  credits: number;
  department: string;
  description: string;
  professors: string[];
  title: string;
}

// Define the Props type
interface CourseCardsProps {
  courses: CourseInfo[];
}

const CourseCards: React.FC<CourseCardsProps> = ({ courses }) => {
  console.log("CourseCards received courses:", courses);
  if (!courses || courses.length === 0) {
    return null;
  }

  return (
    <Card className="sm:w-full sm:h-auto">
      <CardContent className="p-4">
        <h2 className="text-xl font-semibold mb-4">Courses:</h2>
        {courses.map((course, index) => (
          <ScrollArea key={index}>
            <Card className="mb-4">
              <CardContent className="pt-3 pb-3">
                <h3 className="text-lg font-semibold mb-2">
                  {course.department} {course.course_number}: {course.title}
                </h3>
                <p>
                  <strong>Credits:</strong> {course.credits}
                </p>
                <p>
                  <strong>Average GPA:</strong> {course.average_gpa.toFixed(2)}
                </p>
                <p>
                  <strong>Professors:</strong> {course.professors.join(", ")}
                </p>
                <p>
                  <strong>Description:</strong> {course.description}
                </p>
              </CardContent>
            </Card>
          </ScrollArea>
        ))}
      </CardContent>
    </Card>
  );
};

export default CourseCards;

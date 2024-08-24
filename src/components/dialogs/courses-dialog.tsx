"use client"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useQueryState } from 'nuqs'
import { useState } from "react";

interface CoursesDialogProps {
    children: React.ReactNode;
    courses: string[]
}

export default function CoursesDialog({ children, courses }: CoursesDialogProps) {
    const [course, setCourse] = useQueryState('course');
    const [dialogOpen, setDialogOpen] = useState(false);

    const selectCourse = (course: string) => {
        setCourse(course);
        return setDialogOpen(false)
    }
    
    return (
        <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <Input className="w-full"/>
                </AlertDialogHeader>
                <ul className="list-none p-0">
                    {
                        courses.map((course) => (
                            <li onClick={() => selectCourse(course)} className="py-2 px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground" key={course}>
                                {course}
                            </li>
                        ))
                    }
                </ul>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
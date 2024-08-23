"use client"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useQueryState } from 'nuqs'

interface CoursesDialogProps {
    children: React.ReactNode;
    courses: string[]
}

export default function CoursesDialog({ children, courses }: CoursesDialogProps) {
    const [course, setCourse] = useQueryState('course');
    
    return (
        <AlertDialog>
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
                            <li onClick={() => setCourse(course)} className="py-2 px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground" key={course}>
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

"use client"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useQueryState } from 'nuqs'

interface ProfessorsDialogProps {
    children: React.ReactNode;
    professors: string[]
}

export default function ProfessorsDialog({ children, professors }: ProfessorsDialogProps) {
    const [professor, setProfessor] = useQueryState('professor');

    
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
                        professors.map((prof) => (
                            <li onClick={() => setProfessor(prof)} className="py-2 px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground" key={prof}>
                                {prof}
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
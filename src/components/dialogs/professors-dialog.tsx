
"use client"
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { useQueryState } from 'nuqs'
import { useState } from "react";

interface ProfessorsDialogProps {
    children: React.ReactNode;
    professors: string[]
}

export default function ProfessorsDialog({ children, professors }: ProfessorsDialogProps) {
    const [professor, setProfessor] = useQueryState('professor');
    const [dialogOpen, setDialogOpen] = useState(false);


    const selectProfessor = (prof: string) => {
        setProfessor(prof)
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
                        professors.map((prof) => (
                            <li onClick={() => selectProfessor(prof)} className="py-2 px-3 cursor-pointer hover:bg-accent hover:text-accent-foreground" key={prof}>
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
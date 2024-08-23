"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import reviews from "../../../python-backend/reviews.json";
import CoursesDialog from "@/components/dialogs/courses-dialog";
import ProfessorsDialog from "@/components/dialogs/professors-dialog";
import { useQueryState } from "nuqs";

export default function FilterBreadcrumbs() {
    // Mock data for classes and professors
    const subjects = Array.from(
        new Set(reviews.reviews.map((review) => review.subject))
    );
    const professors = Array.from(
        new Set(reviews.reviews.map((review) => review.professor))
    );
    const [course, _] = useQueryState('course');
    const [professor, __] = useQueryState('professor');
  
    return (
        <div>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <CoursesDialog courses={subjects}>
                            <BreadcrumbPage>{course ?? "Course"}</BreadcrumbPage>
                        </CoursesDialog>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />

                    <BreadcrumbItem>
                        <ProfessorsDialog professors={professors}>
                            <BreadcrumbPage>{professor ?? "Professor"}</BreadcrumbPage>
                        </ProfessorsDialog>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>

        </div>
    )
}
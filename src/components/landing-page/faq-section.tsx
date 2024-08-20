import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQSection: React.FC = () => {
  const faqs = [
    {
      question: "What is Profsly AI?",
      answer:
        "Profsly AI is an intelligent assistant trained on professor and course information from universities. It can answer a wide range of questions about courses, professors, and academic programs.",
    },
    {
      question: "How accurate is the information provided by Profsly AI?",
      answer:
        "Profsly AI is trained on up-to-date information from university databases. However, we always recommend verifying critical information with official university sources.",
    },
    {
      question: "Can Profsly AI help with course selection?",
      answer:
        "Yes! Profsly AI can provide detailed information about courses, including prerequisites, course content, and professor teaching styles to help you make informed decisions about your course selection.",
    },
    {
      question: "Is Profsly AI available 24/7?",
      answer:
        "Absolutely! You can access Profsly AI anytime, day or night, to get answers to your questions about university courses and professors.",
    },
    {
      question: "How does Profsly AI handle privacy and data protection?",
      answer:
        "We take privacy very seriously. Profsly AI does not store personal conversations or queries. All interactions are anonymous and we adhere to strict data protection guidelines.",
    },
  ];

  return (
    <section className="bg-gradient-to-br from-indigo-900 via-purple-800 to-indigo-800 py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12 text-white">
          Frequently Asked Questions
        </h2>
        <div className="max-w-3xl mx-auto">
          <Accordion type="single" collapsible className="w-full space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className="bg-white bg-opacity-10 rounded-lg overflow-hidden"
              >
                <AccordionTrigger className="text-left text-white px-6 py-4 hover:bg-white hover:bg-opacity-20 transition-all">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-purple-100 px-6 py-4 bg-black bg-opacity-20">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;

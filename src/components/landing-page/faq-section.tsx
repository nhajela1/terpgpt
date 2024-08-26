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
      question: "What is TerpGPT?",
      answer:
        "TerpGPT is an intelligent assistant trained on professor information from UMD. It can provide details about professors, students' reviews and more.",
    },
    {
      question: "How accurate is the information provided by TerpGPT?",
      answer:
        "TerpGPT is trained on up-to-date information from UMD databases. However, we always recommend verifying critical information with official university sources.",
    },
    // {
    //   question: "Can TerpGPT help with course selection?",
    //   answer:
    //     "Yes! TerpGPT can provide detailed information about courses, including prerequisites, course content, and professor teaching styles to help you make informed decisions about your course selection.",
    // },
    {
      question: "Is TerpGPT available 24/7?",
      answer:
        "Absolutely! You can access TerpGPT anytime, day or night, to get answers to your questions about UMD professors.",
    },
    {
      question: "How does TerpGPT handle privacy and data protection?",
      answer:
        "We take privacy very seriously. TerpGPT does not store personal conversations or queries. All interactions are anonymous and we adhere to strict data protection guidelines.",
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

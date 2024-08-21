import Link from "next/link";
import Image from 'next/image';
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="w-full py-12 md:py-24 lg:py-32 xl:py-12 bg-gradient-to-br from-purple-100 via-blue-100 to-teal-100 dark:from-gray-900 dark:via-purple-900 dark:to-blue-900 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-grid-slate-900/[0.04] bg-[bottom_1px_center] dark:bg-grid-slate-400/[0.05] dark:bg-bottom dark:border-b dark:border-slate-100/5"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-white/0 dark:from-gray-900 dark:via-gray-900/80 dark:to-gray-900/0"></div>
      <div className="container px-4 md:px-6 relative z-10">
        <div className="flex flex-col items-center space-y-4 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-600 drop-shadow-sm">
              Welcome to Kards AI
            </h1>
            <p className="mx-auto max-w-[700px] text-gray-700 md:text-xl dark:text-gray-300">
              Revolutionize your learning with AI-powered flashcards. Study
              smarter, not harder.
            </p>
          </div>
          <div className="space-x-4">
            <Link href="/sign-up">
              <Button className="bg-purple-600 hover:bg-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button
                variant="outline"
                className="border-purple-600 text-purple-600 hover:bg-purple-100 shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Sign In
              </Button>
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Image src="/landing-gif.gif" width={864} height={576} alt="Landing Gif" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

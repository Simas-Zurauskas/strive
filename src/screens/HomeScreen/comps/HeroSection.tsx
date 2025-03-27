import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, Route, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  userName: string;
  hasExistingCourses: boolean;
}

const HeroSection = ({ userName, hasExistingCourses }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-background via-background/95 to-strive/5">
      <div className="absolute top-0 right-0 -mt-16 -mr-16 h-64 w-64 rounded-full bg-strive/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-64 w-64 rounded-full bg-strive/10 blur-3xl" />

      <div className="relative flex flex-col md:flex-row md:items-center p-8 md:p-12">
        <div className="md:w-2/3 md:pr-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome back, {userName?.split(' ')[0] || 'Scholar'}!</h1>
          <p className="text-muted-foreground mb-6 max-w-2xl">
            Accelerate your career transition with Strive's AI-powered learning roadmaps. Whether you're switching
            careers, upskilling in tech, or a self-directed learner, we'll build a personalized, structured path to help
            you gain marketable skills efficiently.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/courses/edit">
              <Button className="bg-strive hover:bg-strive/90 text-white">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create Your {hasExistingCourses ? 'Next' : 'First'} Learning Roadmap
              </Button>
            </Link>
            {hasExistingCourses && (
              <Link href="/courses">
                <Button variant="outline">
                  <Route className="mr-2 h-4 w-4" />
                  Resume Learning
                </Button>
              </Link>
            )}
          </div>
        </div>
        <div className="hidden md:flex md:w-1/3 justify-center mt-8 md:mt-0">
          <div className="relative w-40 h-40">
            <div className="absolute inset-0 bg-strive/20 rounded-full blur-xl" />
            <div className="absolute inset-4 bg-card rounded-full flex items-center justify-center border border-border shadow-lg">
              <Sparkles className="w-16 h-16 text-strive/80" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

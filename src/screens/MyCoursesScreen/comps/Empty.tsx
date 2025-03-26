import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BookOpen, MapPin, PlusCircle, Route } from 'lucide-react';

const Empty = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-border bg-card/50 backdrop-blur-sm">
      <div className="w-20 h-20 mb-6 rounded-full bg-background flex items-center justify-center border border-border shadow-md">
        <Route className="w-10 h-10 text-strive/80" />
      </div>

      <h3 className="text-2xl font-bold mb-4">Start Your Learning Journey</h3>

      <p className="text-muted-foreground max-w-md mb-8">
        Create your first personalized learning roadmap with Strive's AI-powered system that adapts to your skill level
        and learning goals.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full mb-8">
        <FeatureCard
          icon={<MapPin className="w-5 h-5 text-strive" />}
          title="Define Your Goals"
          description="Tell us what you want to learn and your current knowledge level."
        />
        <FeatureCard
          icon={<Route className="w-5 h-5 text-strive" />}
          title="Get Your Roadmap"
          description="Receive a custom learning path tailored just for you."
        />
        <FeatureCard
          icon={<BookOpen className="w-5 h-5 text-strive" />}
          title="Start Learning"
          description="Follow structured modules to reach your learning goals."
        />
      </div>

      <Link href="/courses/edit">
        <Button className="bg-strive hover:bg-strive/90 text-white shadow-md">
          <PlusCircle className="mr-2 h-4 w-4" />
          Create Your First Roadmap
        </Button>
      </Link>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => {
  return (
    <div className="flex flex-col items-center p-4 rounded-lg border border-border bg-background">
      <div className="mb-2">{icon}</div>
      <h4 className="font-medium mb-1">{title}</h4>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Empty;

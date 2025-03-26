import { H2 } from '@/components/typography';
import { Brain, Route, User, Award, Briefcase } from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <Briefcase className="h-8 w-8 text-strive" />,
      title: 'Define Your Learning Goals',
      description: 'Tell Strive your objectives, current knowledge level, and learning preferences.',
    },
    {
      icon: <Brain className="h-8 w-8 text-strive" />,
      title: 'Get Your Personalized Path',
      description: 'Our AI creates a structured roadmap with industry-relevant skills and projects.',
    },
    {
      icon: <Award className="h-8 w-8 text-strive" />,
      title: 'Track Your Progress',
      description: 'Complete modules, measure your advancement, and apply your new knowledge effectively.',
    },
  ];

  return (
    <section className="space-y-6">
      <H2 className="font-bold">Your Personalized Learning Journey</H2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {steps.map((step, index) => (
          <div key={index} className="relative">
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 bg-background p-4 rounded-full border border-border shadow-sm relative z-10">
                {step.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-muted-foreground">{step.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorksSection;

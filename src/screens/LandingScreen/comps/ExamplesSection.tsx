import React from 'react';

export const ExamplesSection = () => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-amber-50 mb-4">
          Endless Learning Possibilities
        </h2>
        <p className="text-lg text-gray-700 dark:text-amber-200/80 max-w-3xl mx-auto">
          Strive creates personalized roadmaps for any learning goal—from industry-standard skills to niche passions.
          Here are just a few examples:
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Popular Tech courses */}
        <ExampleCard
          title="Web Development"
          description="Master React, Next.js, and modern frontend skills with a roadmap tailored to your experience level and career goals."
          category="Tech"
          icon="code"
        />
        <ExampleCard
          title="Data Science"
          description="Learn Python, statistics, machine learning, and visualization with a customized path that matches your background."
          category="Tech"
          icon="chart"
        />
        <ExampleCard
          title="AI Engineering"
          description="Build expertise in deep learning, neural networks, and NLP with content adapted to your existing programming knowledge."
          category="Tech"
          icon="ai"
        />

        {/* Business & Finance */}
        <ExampleCard
          title="Investment Strategy"
          description="Develop a comprehensive understanding of markets, asset classes, and portfolio management with principles adapted to your financial goals."
          category="Business"
          icon="finance"
        />
        <ExampleCard
          title="Entrepreneurship"
          description="Learn startup fundamentals, from idea validation to scaling, with customized content based on your industry and experience."
          category="Business"
          icon="startup"
        />
        <ExampleCard
          title="Digital Marketing"
          description="Master SEO, content strategy, social media, and analytics with a personalized approach to your specific market and objectives."
          category="Business"
          icon="marketing"
        />

        {/* Creative & Arts */}
        <ExampleCard
          title="Digital Art Mastery"
          description="Progress from fundamentals to advanced techniques in digital illustration, concept art, and 3D modeling based on your current skills."
          category="Creative"
          icon="art"
        />
        <ExampleCard
          title="Music Production"
          description="Learn composition, arrangement, mixing, and mastering with a roadmap designed for your genre preferences and equipment setup."
          category="Creative"
          icon="music"
        />
        <ExampleCard
          title="Creative Writing"
          description="Develop storytelling techniques, character development, and narrative structure with guidance tailored to your preferred literary genre."
          category="Creative"
          icon="writing"
        />

        {/* Health & Sciences */}
        <ExampleCard
          title="Nutrition Science"
          description="Understand macronutrients, metabolism, meal planning, and dietary protocols with content customized to your health goals and knowledge level."
          category="Health"
          icon="nutrition"
        />
        <ExampleCard
          title="Molecular Biology"
          description="Explore genetics, cell biology, and biochemical processes with a structured path that builds on your existing science background."
          category="Science"
          icon="dna"
        />
        <ExampleCard
          title="Cognitive Psychology"
          description="Study memory, learning, perception, and decision-making through principles and research tailored to your academic or practical interests."
          category="Science"
          icon="brain"
        />

        {/* Languages & Humanities */}
        <ExampleCard
          title="Multilingual Fluency"
          description="Achieve conversational proficiency in multiple languages with an integrated learning approach based on your linguistic background."
          category="Languages"
          icon="language"
        />
        <ExampleCard
          title="Philosophy of Mind"
          description="Explore consciousness, identity, and the mind-body problem with a curriculum that connects to your philosophical interests and background."
          category="Humanities"
          icon="philosophy"
        />
        <ExampleCard
          title="Ancient Civilizations"
          description="Discover the art, architecture, politics, and daily life of historical societies with content focused on your areas of interest."
          category="Humanities"
          icon="history"
        />

        {/* Practical Skills */}
        <ExampleCard
          title="Cybersecurity"
          description="Learn penetration testing, threat analysis, and security frameworks with content tailored to your IT background and career goals."
          category="Tech"
          icon="security"
        />
        <ExampleCard
          title="Public Speaking"
          description="Develop confidence, structure compelling presentations, and master audience engagement with practice exercises suited to your comfort level."
          category="Skills"
          icon="speaking"
        />
        <ExampleCard
          title="Mindfulness & Productivity"
          description="Learn meditation techniques, focus management, and productivity systems personalized to your lifestyle and challenges."
          category="Skills"
          icon="mindfulness"
        />

        {/* Unique/Exotic courses */}
        <ExampleCard
          title="Wilderness Survival"
          description="Master shelter building, navigation, foraging, and emergency preparedness with scenarios appropriate for your local environment."
          category="Unique"
          icon="survival"
        />
        <ExampleCard
          title="Traditional Craft Mastery"
          description="Learn woodworking, blacksmithing, or leathercraft through structured progression from basics to advanced techniques."
          category="Unique"
          icon="craft"
        />
        <ExampleCard
          title="Biomimicry Architecture"
          description="Explore how nature's design principles can create sustainable, innovative structures and materials through projects adapted to your skills."
          category="Unique"
          icon="nature"
        />
      </div>
    </div>
  );
};

// Example Card Component
const ExampleCard = ({
  title,
  description,
  category,
  icon,
}: {
  title: string;
  description: string;
  category: 'Tech' | 'Business' | 'Creative' | 'Health' | 'Science' | 'Languages' | 'Humanities' | 'Skills' | 'Unique';
  icon: string;
}) => {
  const getCategoryColor = () => {
    switch (category) {
      case 'Tech':
        return 'bg-amber-500 dark:bg-amber-500';
      case 'Business':
        return 'bg-orange-500 dark:bg-orange-500';
      case 'Creative':
        return 'bg-rose-500 dark:bg-rose-500';
      case 'Health':
        return 'bg-emerald-500 dark:bg-emerald-500';
      case 'Science':
        return 'bg-blue-500 dark:bg-blue-500';
      case 'Languages':
        return 'bg-indigo-500 dark:bg-indigo-500';
      case 'Humanities':
        return 'bg-purple-500 dark:bg-purple-500';
      case 'Skills':
        return 'bg-cyan-500 dark:bg-cyan-500';
      case 'Unique':
        return 'bg-yellow-400 dark:bg-yellow-400';
      default:
        return 'bg-amber-500 dark:bg-amber-500';
    }
  };

  const getIcon = () => {
    switch (icon) {
      // Tech icons
      case 'code':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
          </svg>
        );
      case 'chart':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
        );
      case 'ai':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
        );
      case 'security':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
        );

      // Business icons
      case 'finance':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'startup':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'marketing':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"
            />
          </svg>
        );

      // Creative icons
      case 'art':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        );
      case 'music':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
            />
          </svg>
        );
      case 'writing':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        );

      // Health & Science icons
      case 'nutrition':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        );
      case 'dna':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        );
      case 'brain':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );

      // Languages & Humanities icons
      case 'language':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
            />
          </svg>
        );
      case 'philosophy':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
        );
      case 'history':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );

      // Skills icons
      case 'speaking':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
            />
          </svg>
        );
      case 'mindfulness':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        );

      // Unique/Exotic icons
      case 'survival':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'nature':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case 'craft':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 11V9a2 2 0 00-2-2m2 4v4a2 2 0 104 0v-1m-4-3H9m2 0h4m6 1a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
    }
  };

  return (
    <div className="bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md hover:shadow-lg transition-all duration-300 hover:border-amber-500/40 dark:hover:border-amber-500/30 group p-6">
      <div className="flex items-center mb-4">
        <div className={`${getCategoryColor()} p-2 rounded-lg text-white dark:text-black mr-3`}>{getIcon()}</div>
        <div>
          <span className="text-xs font-medium text-gray-500 dark:text-amber-200/50">{category}</span>
          <h3 className="font-semibold text-xl text-gray-900 dark:text-amber-50">{title}</h3>
        </div>
      </div>
      <p className="text-gray-700 dark:text-amber-200/70">{description}</p>
    </div>
  );
};

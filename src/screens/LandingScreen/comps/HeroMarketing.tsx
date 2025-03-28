import React from 'react';

interface HeroMarketingProps {}

export const HeroMarketing: React.FC<HeroMarketingProps> = () => {
  return (
    <div className="w-full lg:w-1/2 mb-8 sm:mb-10 lg:mb-0 pr-0 lg:pr-12">
      <div className="mb-2 inline-block">
        <span className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-400 dark:from-amber-500 dark:to-yellow-400 text-white dark:text-black text-xs font-medium rounded-full">
          Revolutionary AI-Powered Learning
        </span>
      </div>
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-amber-50 mb-4 sm:mb-6">
        Your <span className="text-[color:var(--strive)]">personalized</span> path to mastery
      </h1>
      <p className="text-base sm:text-lg text-gray-700 dark:text-amber-200/80 mb-6 sm:mb-8 max-w-xl">
        Strive revolutionizes self-directed learning with AI-generated roadmaps precisely tailored to your goals,
        skills, and pace. For ambitious learners who demand structure and efficiency.
      </p>

      <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
        {/* Feature 1 - Personalized Roadmaps */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/40 dark:to-amber-800/30 shadow-sm flex items-center justify-center mr-3 sm:mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-amber-600 dark:text-amber-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-amber-100">
              Personalized Roadmaps
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-amber-200/70">
              Tailored learning paths based on your specific goals and current skill level
            </p>
          </div>
        </div>

        {/* Feature 2 - AI-Generated Content */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/30 shadow-sm flex items-center justify-center mr-3 sm:mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-orange-600 dark:text-orange-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-amber-100">
              AI-Generated Content
            </h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-amber-200/70">
              Comprehensive learning modules created with cutting-edge AI technology
            </p>
          </div>
        </div>

        {/* Feature 3 - Flexible Learning */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/40 dark:to-yellow-800/30 shadow-sm flex items-center justify-center mr-3 sm:mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 dark:text-yellow-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-amber-100">Flexible Learning</h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-amber-200/70">
              Adjust course duration and difficulty to match your pace and preferences
            </p>
          </div>
        </div>

        {/* Feature 4 - For Self-Starters */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-rose-100 to-rose-200 dark:from-rose-900/40 dark:to-rose-800/30 shadow-sm flex items-center justify-center mr-3 sm:mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-rose-600 dark:text-rose-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-amber-100">For Self-Starters</h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-amber-200/70">
              Built for proactive learners who want to maximize their learning efficiency and outcomes
            </p>
          </div>
        </div>

        {/* Feature 5 - AI Chatbot Mentors */}
        <div className="flex items-start">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/40 dark:to-purple-800/30 shadow-sm flex items-center justify-center mr-3 sm:mr-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600 dark:text-purple-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-amber-100">AI Mentor Chatbots</h3>
            <p className="text-sm sm:text-base text-gray-700 dark:text-amber-200/70">
              Context-aware mentors at every level providing personalized guidance when you need it
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

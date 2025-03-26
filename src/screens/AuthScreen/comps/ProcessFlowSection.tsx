import React from 'react';

export const ProcessFlowSection = () => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-amber-50 mb-4">How Strive Works</h2>
        <p className="text-lg text-gray-700 dark:text-amber-200/80 max-w-3xl mx-auto">
          Your personalized learning journey in four simple steps
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-4">
        {/* Step 1 */}
        <div className="relative bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-500/40 dark:hover:border-amber-500/30">
          <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-amber-500 dark:bg-amber-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            1
          </div>

          <div className="h-40 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-amber-500/50 dark:text-amber-400/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 5v4a1 1 0 001 1h5" />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-amber-50 mb-3">Define Your Goal</h3>
          <p className="text-gray-700 dark:text-amber-200/70 mb-4">
            Describe what you want to learn and your current knowledge level in simple terms.
          </p>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-lg p-3">
            <p className="text-sm italic text-amber-700 dark:text-amber-300/80">
              "I want to learn machine learning for data analysis. I know basic Python but no ML yet."
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="relative bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-500/40 dark:hover:border-amber-500/30">
          <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-orange-500 dark:bg-orange-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            2
          </div>

          <div className="h-40 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-orange-500/50 dark:text-orange-400/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-amber-50 mb-3">AI Generates Roadmap</h3>
          <p className="text-gray-700 dark:text-amber-200/70 mb-4">
            Our AI analyzes your goal and creates a personalized learning pathway with interconnected modules.
          </p>

          <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-3">
            <p className="text-sm italic text-orange-700 dark:text-orange-300/80">
              Strive suggests: 25 hours, Intermediate difficulty, 15 connected learning modules
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="relative bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-500/40 dark:hover:border-amber-500/30">
          <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-yellow-500 dark:bg-yellow-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            3
          </div>

          <div className="h-40 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-yellow-500/50 dark:text-yellow-400/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-amber-50 mb-3">Customize Your Path</h3>
          <p className="text-gray-700 dark:text-amber-200/70 mb-4">
            Adjust the length, difficulty, and focus areas to match your learning style and time constraints.
          </p>

          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-3">
            <p className="text-sm italic text-yellow-700 dark:text-yellow-300/80">
              Easily adjust from a 5-hour crash course to a 60-hour deep dive with simple sliders
            </p>
          </div>
        </div>

        {/* Step 4 */}
        <div className="relative bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-500/40 dark:hover:border-amber-500/30">
          <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-green-500 dark:bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-md">
            4
          </div>

          <div className="h-40 flex items-center justify-center mb-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-24 w-24 text-green-500/50 dark:text-green-400/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-amber-50 mb-3">Start Learning</h3>
          <p className="text-gray-700 dark:text-amber-200/70 mb-4">
            Begin your journey with AI-generated content tailored exactly to your needs and progression level.
          </p>

          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3">
            <p className="text-sm italic text-green-700 dark:text-green-300/80">
              Track progress as you complete modules and build your knowledge step by step
            </p>
          </div>
        </div>
      </div>

      {/* Credit system callout - uncommented and adjusted */}
      <div className="mt-10 bg-gradient-to-r from-amber-100/80 to-orange-100/80 dark:from-amber-900/40 dark:to-orange-900/40 rounded-xl border border-amber-200/50 dark:border-amber-500/30 p-6 md:p-8 shadow-md backdrop-blur-sm">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 md:mr-8">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-amber-50 mb-2">
              Start Your Learning Journey Today
            </h3>
            <p className="text-gray-700 dark:text-amber-200/80">
              Sign up now and receive <span className="font-semibold">30 free credits</span> to create your first
              personalized courses.
            </p>
          </div>
          <div className="flex-shrink-0">
            <div className="text-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              Get Started Free
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

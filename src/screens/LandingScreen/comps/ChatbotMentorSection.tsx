import React from 'react';

export const ChatbotMentorSection = () => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-amber-50 mb-4">
          AI Mentor Chatbots at Every Step
        </h2>
        <p className="text-lg text-gray-700 dark:text-amber-200/80 max-w-3xl mx-auto">
          Never get stuck again with contextual AI mentors guiding your learning journey
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Course-Level Mentor */}
        <div className="relative bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-500/40 dark:hover:border-amber-500/30 flex flex-col">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-blue-500/10 dark:bg-blue-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-blue-600 dark:text-blue-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M12 7v.01" />
                <path d="M16 11v.01" />
                <path d="M8 11v.01" />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-amber-50 mb-3 text-center">Course-Level Mentor</h3>
          <p className="text-gray-700 dark:text-amber-200/70 mb-6 text-center">
            Provides high-level guidance on course progression, motivation, and broad concepts
          </p>

          <div className="mt-auto bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg p-4">
            <p className="text-sm text-blue-700 dark:text-blue-300 italic">
              "How does this course connect to my career goals? What should I focus on most?"
            </p>
          </div>
        </div>

        {/* Module-Level Mentor */}
        <div className="relative bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-500/40 dark:hover:border-amber-500/30 flex flex-col">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-purple-500/10 dark:bg-purple-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-purple-600 dark:text-purple-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <path d="M8 9h8" />
                <path d="M8 13h6" />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-amber-50 mb-3 text-center">Module-Level Mentor</h3>
          <p className="text-gray-700 dark:text-amber-200/70 mb-6 text-center">
            Provides support focused on specific modules and clarifies concepts within context
          </p>

          <div className="mt-auto bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg p-4">
            <p className="text-sm text-purple-700 dark:text-purple-300 italic">
              "Can you explain how these concepts in this module relate to what I learned previously?"
            </p>
          </div>
        </div>

        {/* Lesson-Level Mentor */}
        <div className="relative bg-white/90 dark:bg-black/80 backdrop-blur-sm rounded-xl border border-amber-200/30 dark:border-amber-500/20 shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:border-amber-500/40 dark:hover:border-amber-500/30 flex flex-col">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 rounded-full bg-green-500/10 dark:bg-green-500/20 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-green-600 dark:text-green-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="10" r="2" />
                <path d="M12 14v.01" />
              </svg>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-900 dark:text-amber-50 mb-3 text-center">Lesson-Level Mentor</h3>
          <p className="text-gray-700 dark:text-amber-200/70 mb-6 text-center">
            Delivers granular assistance within individual lessons to solve specific problems
          </p>

          <div className="mt-auto bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-4">
            <p className="text-sm text-green-700 dark:text-green-300 italic">
              "I'm stuck implementing this algorithm. Can you help me debug this specific part?"
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <p className="text-gray-700 dark:text-amber-200/80 max-w-3xl mx-auto">
          Each mentor understands your learning context, providing precise guidance exactly when you need it
        </p>
      </div>
    </div>
  );
};

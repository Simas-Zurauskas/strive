import React from 'react';

export const CustomizationSection = () => {
  return (
    <div className="relative z-10 w-full max-w-7xl mx-auto px-4 py-10 md:py-16">
      <div className="bg-gradient-to-br from-amber-50/90 to-orange-50/90 dark:from-gray-900/90 dark:to-gray-800/90 rounded-3xl shadow-xl border border-amber-100 dark:border-amber-900/30 backdrop-blur-sm overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center p-8 md:p-12">
          {/* Left Side - Text */}
          <div className="w-full lg:w-1/2 pr-0 lg:pr-8 mb-8 lg:mb-0">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-amber-50 mb-6">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-amber-500 to-orange-500">
                Your pace. Your depth.
              </span>{' '}
              <br /> Your perfect learning path.
            </h2>
            <p className="text-lg text-gray-700 dark:text-amber-200/80 mb-8">
              Strive's AI suggests the ideal roadmap, but <span className="font-semibold">you're in control</span>.
              Adjust any course to match exactly what you need:
            </p>

            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-amber-600 dark:text-amber-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-amber-100">Expand Simple Topics</h3>
                  <p className="text-gray-700 dark:text-amber-200/70">
                    Turn a basic introduction into an in-depth exploration with comprehensive modules.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-orange-500/10 dark:bg-orange-500/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-orange-600 dark:text-orange-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-amber-100">Condense Complex Subjects</h3>
                  <p className="text-gray-700 dark:text-amber-200/70">
                    Transform vast topics into digestible 1-hour crash courses focused on key concepts.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-yellow-400/10 dark:bg-yellow-400/20 flex items-center justify-center mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-yellow-600 dark:text-yellow-400"
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
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-amber-100">Adjust Difficulty</h3>
                  <p className="text-gray-700 dark:text-amber-200/70">
                    Fine-tune content complexity from beginner-friendly to expert-level challenges.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Interactive Visualization */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="overflow-hidden relative w-full max-w-md aspect-[4/3] bg-white/60 dark:bg-black/60 rounded-2xl shadow-lg border border-amber-200/30 dark:border-amber-900/30 p-6">
              {/* Course Title */}
              <div className="mb-8">
                <div className="text-xs font-medium text-gray-500 dark:text-amber-200/50 mb-1">COURSE</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-amber-50">Machine Learning Fundamentals</h3>
              </div>

              {/* Duration Slider */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-amber-200/70">Duration</div>
                  <div className="text-sm font-semibold bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-md">
                    12 hours
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 w-[20%]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-amber-200/40 mt-1">
                  <span>1 hour</span>
                  <span>60 hours</span>
                </div>
              </div>

              {/* Difficulty Slider */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <div className="text-sm font-medium text-gray-700 dark:text-amber-200/70">Difficulty</div>
                  <div className="text-sm font-semibold bg-amber-500/10 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 px-2 py-1 rounded-md">
                    Intermediate
                  </div>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full">
                  <div className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 w-[45%]"></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500 dark:text-amber-200/40 mt-1">
                  <span>Beginner</span>
                  <span>Expert</span>
                </div>
              </div>

              {/* Decorative Dots */}
              <div className="absolute -top-3 -right-4 w-24 h-24 bg-amber-500/5 dark:bg-amber-500/10 rounded-full blur-sm"></div>
              <div className="absolute -bottom-5 -left-5 w-32 h-32 bg-orange-500/5 dark:bg-orange-500/10 rounded-full blur-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { favouriteCourse } from '@/lib/services/courseServices';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface FavouriteStarProps {
  isFavourite?: boolean;
  uxId: string;
  queryKey: string[];
}

const FavouriteStar: React.FC<FavouriteStarProps> = ({ isFavourite, uxId, queryKey }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: favouriteCourse,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey });
    },
  });

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        mutate({ uxId: uxId, favourite: !isFavourite });
      }}
      className={`${
        isFavourite
          ? 'text-strive hover:text-strive/80'
          : 'text-foreground/70 hover:text-foreground dark:text-foreground/60 dark:hover:text-foreground/90'
      } transition-colors focus:outline-none relative ${
        isPending ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer'
      }`}
      aria-label={isFavourite ? 'Remove from favorites' : 'Add to favorites'}
      disabled={isPending}
      style={{ transform: 'translate(8px, -8px)' }}
    >
      <span className="absolute inset-0 -m-2"></span>
      {isFavourite ? (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-7 w-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      )}
    </button>
  );
};

export default FavouriteStar;

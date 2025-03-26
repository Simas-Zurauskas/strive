import { addCreditsService, getCreditsService, useCreditsService } from '@/lib/services/creditService';
import { QKeys } from '@/types';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';

export const useCredits = () => {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const {
    data: credits = 0,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QKeys.CREDITS],
    queryFn: () => getCreditsService(),
    enabled: !!session?.user.email,
  });

  const { mutateAsync: add, isPending: isPendingAdd } = useMutation({
    mutationFn: (val: number) => addCreditsService(val),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QKeys.CREDITS] }),
  });

  const { mutateAsync: use, isPending: isPendingUse } = useMutation({
    mutationFn: (val: 1 | 2) => useCreditsService(val),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: [QKeys.CREDITS] }),
  });

  const loading = isLoading || isFetching || isPendingAdd || isPendingUse;

  return { credits, add, use, loading };
};

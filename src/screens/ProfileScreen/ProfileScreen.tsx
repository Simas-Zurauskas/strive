'use client';
import Alert from '@/components/Alert';
import { Section } from '@/components/layout';
import { H2, P } from '@/components/typography';
import { Button, CardContent } from '@/components/ui';
import { useAuth } from '@/hooks/useAuth';
import { useCredits } from '@/hooks/useCredits';
import { destroyAccount } from '@/lib/services/userServices';
import { useMutation } from '@tanstack/react-query';
import { signOut } from 'next-auth/react';
import { useState } from 'react';
import { toast } from 'sonner';

const ProfileScreen = () => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const { user } = useAuth();
  const { credits } = useCredits();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => destroyAccount(),
    onSuccess: () => {
      setIsDeleteOpen(false);
      signOut();
    },
    onError: (error) => {
      toast.error('Failed to delete account', {
        richColors: true,
      });
    },
  });

  if (!user) return null;

  return (
    <>
      <Alert
        open={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={mutate}
        title="Delete Account"
        subtitle="Are you sure you want to delete your account? This action cannot be undone."
        isLoading={isPending}
      />
      <div className="max-w-6xl mx-auto py-6 px-4">
        <H2 className="mb-6">Your Profile</H2>
        <Section title={user.name} description={user.email} verticalGutter>
          <CardContent className="flex justify-end flex-col items-start gap-2">
            <div className="flex flex-col leading-tight">
              <P>Credits: {credits}</P>
              <span className="text-sm text-muted-foreground italic mt-2">
                Find the app useful? Contact <span className="font-medium text-primary">simaszurauskas@gmail.com</span>{' '}
                for more credits.
              </span>
            </div>

            <div className="h-4" />
            <div className="flex gap-2 w-full justify-between">
              <Button onClick={() => signOut()}>Logout</Button>
              <Button variant="destructive" onClick={() => setIsDeleteOpen(true)}>
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Section>
      </div>
    </>
  );
};

export default ProfileScreen;

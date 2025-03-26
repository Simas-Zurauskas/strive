import Alert from '@/components/Alert';
import { Button } from '@/components/ui';
import { deleteCourse } from '@/lib/services/courseServices';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { toast } from 'sonner';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { QKeys } from '@/types';

interface EditProps {
  uxId: string;
}

export const Edit: React.FC<EditProps> = ({ uxId }) => {
  const [isDelOpen, setIsDelOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteCourse(uxId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [QKeys.COURSES] });
      router.push('/courses');
    },
    onError: (err) => toast.error(err.message, { richColors: true }),
  });

  return (
    <>
      <Alert
        open={isDelOpen}
        onClose={() => setIsDelOpen(false)}
        title="Delete Course?"
        subtitle="This will permanently delete your course, including all generated content, learning materials, and progress. This action cannot be undone."
        onConfirm={mutate}
        isLoading={isPending}
      />
      <Alert
        open={isEditOpen}
        onClose={() => setIsEditOpen(false)}
        title="Edit Course?"
        subtitle="This will open the course editor where you can modify course from scratch. Note that any changes will create a new version of this course and all current learning progress will be reset."
        onConfirm={() => router.push(`/courses/edit?id=${uxId}`)}
        isLoading={isPending}
      />
      <div className="flex gap-2 justify-between">
        <Button variant="outline" onClick={() => setIsEditOpen(true)} disabled={isPending}>
          <FiEdit className="size-4" />
          Edit
        </Button>
        <Button variant="outline" onClick={() => setIsDelOpen(true)} disabled={isPending}>
          <FiTrash2 className="size-4" />
          Delete
        </Button>
      </div>
    </>
  );
};

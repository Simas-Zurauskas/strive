import Alert from '@/components/Alert';
import { Button } from '@/components/ui';
import { useCredits } from '@/hooks/useCredits';
import { AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import styled from 'styled-components';

const Div = styled.div``;

interface RegenerateLessonProps {
  onRegenerate: () => void;
}

export const RegenerateLesson: React.FC<RegenerateLessonProps> = ({ onRegenerate }) => {
  const [open, setOpen] = useState(false);
  const { credits } = useCredits();

  return (
    <>
      <Alert
        open={open}
        onClose={() => setOpen(false)}
        onConfirm={() => {
          onRegenerate();
          setOpen(false);
        }}
        title="Regenerate Lesson"
        subtitle="This will regenerate the lesson. Are you sure you want to continue?"
      />
      {credits > 1 && (
        <Button variant="secondary" onClick={() => setOpen(true)}>
          <AlertTriangle className="size-4" />
          Regenerate Lesson (Cr. 2)
        </Button>
      )}
    </>
  );
};

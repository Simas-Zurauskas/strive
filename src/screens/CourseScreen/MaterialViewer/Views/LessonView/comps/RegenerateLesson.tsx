import Alert from '@/components/Alert';
import { Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';
import styled from 'styled-components';

const Div = styled.div``;

interface RegenerateLessonProps {
  onRegenerate: () => void;
}

export const RegenerateLesson: React.FC<RegenerateLessonProps> = ({ onRegenerate }) => {
  const [open, setOpen] = useState(false);
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
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <AlertTriangle className="size-4" />
        Regenerate Lesson
      </Button>
    </>
  );
};

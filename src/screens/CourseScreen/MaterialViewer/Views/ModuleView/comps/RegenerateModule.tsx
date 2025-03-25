import Alert from '@/components/Alert';
import { Button } from '@/components/ui';
import { AlertTriangle } from 'lucide-react';
import React, { useState } from 'react';

interface RegenerateModuleProps {
  onRegenerate: () => void;
}

export const RegenerateModule: React.FC<RegenerateModuleProps> = ({ onRegenerate }) => {
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
        title="Regenerate Module Content"
        subtitle="This will recreate the entire module content from your source materials. Any progress will be lost. Are you sure you want to continue?"
      />
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <AlertTriangle className="size-4" />
        Regenerate Module (Cr. 1)
      </Button>
    </>
  );
};

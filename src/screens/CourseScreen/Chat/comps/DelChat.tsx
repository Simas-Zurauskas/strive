import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui';
import { deleteChat } from '@/lib/services/courseServices';
import { CPointer, QKeys } from '@/types';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import styled from 'styled-components';
import { MoreVertical } from 'lucide-react';

const Div = styled.div`
  position: absolute;
  right: 4px;
  bottom: 0px;
  z-index: 10;

  .trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    svg {
      transform: rotate(90deg);
    }
  }

  [data-slot='dropdown-menu-item'] {
    cursor: pointer;
  }
`;

interface DelChatProps {
  cPointer: CPointer;
  onDelete: () => void;
  disabled: boolean;
}

export const DelChat: React.FC<DelChatProps> = ({ cPointer, onDelete, disabled }) => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: () => deleteChat(cPointer),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [QKeys.CHAT, cPointer.uxId, cPointer.module?.moduleId, cPointer.module?.lessonId],
      });
      onDelete();
    },
  });

  return (
    <Div>
      <DropdownMenu>
        <DropdownMenuTrigger disabled={isPending || disabled} className="trigger">
          <MoreVertical className="h-4 w-4 opacity-50" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onClick={() => mutate()}
            disabled={isPending || disabled}
          >
            Clear messages
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Div>
  );
};

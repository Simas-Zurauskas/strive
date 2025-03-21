import { ReactNode } from 'react';
import styled from 'styled-components';
import { ChevronDown, ChevronRight } from 'lucide-react';

const ItemContainer = styled.div<{ $isLockedIn: boolean; $isActive: boolean }>`
  display: flex;
  flex-direction: column;
  border-radius: 0.25rem;
  overflow: hidden;
  margin-bottom: 8px;
  box-shadow: ${(props) => {
    if (props.$isActive) return '0 4px 16px rgba(0, 0, 0, 0.2)';
    if (props.$isLockedIn) return '0 4px 14px rgba(0, 0, 0, 0.15)';
    return '0 2px 10px rgba(0, 0, 0, 0.05)';
  }};
  transition: all 0.2s ease-in-out;
  background-color: ${(props) => (props.$isActive ? 'var(--card)' : 'var(--background)')};
  border: none;
  outline: ${(props) => {
    // if (props.$isActive) return '1px solid var(--foreground)';
    return '1px solid var(--border)';
  }};
  outline-offset: -1px;
  transform: ${(props) => (props.$isLockedIn ? 'translateY(-2px)' : 'none')};

  ${(props) =>
    !props.$isLockedIn &&
    `
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transform: translateY(-2px);
      background-color: var(--card);
    }
  `}

  ${(props) =>
    props.$isLockedIn &&
    `
    background-color: var(--card);
  `}
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  min-height: 48px;
  padding: 0;
`;

const ChevronButton = styled.button<{ $isExpanded: boolean; $isActive: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 48px;
  width: 48px;
  height: 48px;
  border: none;
  background-color: transparent;
  color: ${(props) => {
    if (props.$isActive) return 'var(--foreground)';
    if (props.$isExpanded) return 'var(--primary)';
    return 'var(--muted-foreground)';
  }};
  cursor: pointer;
  transition: all 0.15s ease;
  border-radius: 4px;

  &:hover {
    background-color: var(--accent);
    color: var(--foreground);
  }

  &:focus {
    outline: none;
  }
`;

const HeaderContent = styled.div<{ $isExpanded: boolean; $isActive: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0 16px 0 8px;
  gap: 8px;
  cursor: pointer;
  border-radius: 4px;
  flex: 1;
  margin: 1px;
  align-self: stretch;
  transition: all 0.2s ease-in-out;

  ${(props) => {
    if (props.$isActive) {
      return `
        font-weight: 700;
        color: var(--foreground);
      `;
    }
    if (props.$isExpanded) {
      return `
        font-weight: 600;
        color: var(--primary);
      `;
    }
    return `
      color: var(--foreground);
      opacity: 0.8;
      font-weight: 400;
    `;
  }}

  &:hover {
    background-color: var(--accent);
    color: var(--accent-foreground);
  }
`;

interface ExpandableItemProps {
  itemId: string;
  isExpanded: boolean;
  isActive?: boolean;
  onToggle: (itemId: string, event: React.MouseEvent) => void;
  header: ReactNode;
  children: ReactNode;
  onClick: (itemId: string) => void;
}

const ExpandableItem: React.FC<ExpandableItemProps> = ({
  itemId,
  isExpanded,
  isActive = false,
  onToggle,
  header,
  children,
  onClick,
}) => {
  return (
    <ItemContainer $isLockedIn={isExpanded || isActive} $isActive={isActive}>
      <HeaderRow>
        <ChevronButton $isExpanded={isExpanded} $isActive={isActive} onClick={(e) => onToggle(itemId, e)}>
          {isExpanded ? <ChevronDown className="size-5" /> : <ChevronRight className="size-5" />}
        </ChevronButton>
        <HeaderContent $isExpanded={isExpanded} $isActive={isActive} onClick={() => onClick(itemId)}>
          {header}
        </HeaderContent>
      </HeaderRow>
      {isExpanded && children}
    </ItemContainer>
  );
};

export default ExpandableItem;

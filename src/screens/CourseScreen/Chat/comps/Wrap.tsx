import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Div = styled(motion.div)`
  min-width: 40px;
  max-width: 420px;
  top: 56px;
  position: relative;
  height: calc(100vh - 40px);

  .content {
    flex: 1;

    padding: 20px 10px;
    overflow-y: auto;
    width: 100%;
    height: 100%;
    border: 1px solid red;
  }

  .toggle-button {
    position: absolute;
    top: 10px;
    left: -12px;
    z-index: 10;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: var(--background);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }
`;

const ContentContainer = styled(motion.div)`
  width: 100%;
  height: 100%;
  padding-top: 0;
  padding-bottom: 24px;
`;

interface WrapProps {
  children: React.ReactNode;
}

export const Wrap: React.FC<WrapProps> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const animationComplete = useRef(true);

  const handleToggleCollapse = () => {
    if (!animationComplete.current) return;

    animationComplete.current = false;

    if (isCollapsed) {
      setIsCollapsed(false);
      setTimeout(() => {
        setContentVisible(true);
        animationComplete.current = true;
      }, 200);
    } else {
      setContentVisible(false);
      setTimeout(() => {
        setIsCollapsed(true);
        animationComplete.current = true;
      }, 100);
    }
  };

  return (
    <Div
      className="bg-background border-l flex flex-col"
      animate={{
        width: isCollapsed ? '40px' : '420px',
      }}
      initial={false}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        duration: 0.15,
      }}
    >
      <button
        className="toggle-button"
        onClick={handleToggleCollapse}
        aria-label={isCollapsed ? 'Expand chat panel' : 'Collapse chat panel'}
      >
        {isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
      </button>

      <ContentContainer animate={{ opacity: contentVisible ? 1 : 0 }} transition={{ duration: 0.1 }}>
        {contentVisible && <div className="content">{children}</div>}
      </ContentContainer>
    </Div>
  );
};

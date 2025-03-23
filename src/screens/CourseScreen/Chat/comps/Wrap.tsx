import { ChevronLeft, ChevronRight, Maximize2, Minimize2 } from 'lucide-react';
import React, { useRef, useState, useCallback } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

const Div = styled(motion.div)`
  min-width: 40px;
  max-width: 700px;
  top: 0;
  position: absolute;
  right: 0;
  height: 100%;
  overflow: visible;
  z-index: 10;

  .content {
    flex: 1;
    /* padding: 0px 10px; */
    overflow-y: auto;
    width: 100%;
    height: 100%;
    position: relative;
    /* border: 1px solid red; */
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

  .expand-button {
    position: absolute;
    top: 10px;
    right: 10px;
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

// Create a wrapper to maintain layout stability
const StableWrapper = styled(motion.div)`
  position: relative;
  height: calc(100vh - 40px);
  top: 56px;
  overflow: visible;
`;

type ExpansionState = 'collapsed' | 'expanded' | 'extraExpanded';

interface WrapProps {
  children: React.ReactNode;
}

export const Wrap: React.FC<WrapProps> = ({ children }) => {
  const [expansionState, setExpansionState] = useState<ExpansionState>('expanded');
  const [contentVisible, setContentVisible] = useState(true);
  const animationComplete = useRef(true);

  // Memoize the width calculations to prevent recalculation on each render
  const getWidth = useCallback(() => {
    switch (expansionState) {
      case 'collapsed':
        return '40px';
      case 'expanded':
        return '420px';
      case 'extraExpanded':
        return '700px';
      default:
        return '420px';
    }
  }, [expansionState]);

  const getWrapperWidth = useCallback(() => {
    switch (expansionState) {
      case 'collapsed':
        return '40px';
      case 'expanded':
      case 'extraExpanded':
        return '420px';
      default:
        return '420px';
    }
  }, [expansionState]);

  const handleToggleCollapse = useCallback(() => {
    if (!animationComplete.current) return;
    animationComplete.current = false;

    if (expansionState === 'collapsed') {
      setExpansionState('expanded');
      setTimeout(() => {
        setContentVisible(true);
        animationComplete.current = true;
      }, 200);
    } else {
      setContentVisible(false);
      setTimeout(() => {
        setExpansionState('collapsed');
        animationComplete.current = true;
      }, 100);
    }
  }, [expansionState]);

  const handleToggleExtraExpand = useCallback(() => {
    if (!animationComplete.current || expansionState === 'collapsed') return;
    animationComplete.current = false;

    if (expansionState === 'expanded') {
      setExpansionState('extraExpanded');
      animationComplete.current = true;
    } else {
      setExpansionState('expanded');
      animationComplete.current = true;
    }
  }, [expansionState]);

  // Shared transition config
  const transitionConfig = {
    type: 'tween',
    ease: 'easeInOut',
    duration: 0.25,
  };

  // Pre-compute animation values to avoid recalculation during render
  const wrapperWidth = getWrapperWidth();
  const divWidth = getWidth();

  return (
    <StableWrapper
      animate={{
        width: wrapperWidth,
      }}
      initial={false}
      transition={transitionConfig}
    >
      <Div
        className="bg-background border-l flex flex-col"
        animate={{
          width: divWidth,
        }}
        initial={false}
        transition={transitionConfig}
      >
        <button
          className="toggle-button"
          onClick={handleToggleCollapse}
          aria-label={expansionState === 'collapsed' ? 'Expand chat panel' : 'Collapse chat panel'}
        >
          {expansionState === 'collapsed' ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
        </button>

        {expansionState !== 'collapsed' && (
          <button
            className="expand-button"
            onClick={handleToggleExtraExpand}
            aria-label={expansionState === 'expanded' ? 'Extra expand chat panel' : 'Reduce chat panel'}
          >
            {expansionState === 'expanded' ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
        )}

        <ContentContainer animate={{ opacity: contentVisible ? 1 : 0 }} transition={{ duration: 0.1 }}>
          {contentVisible && <div className="content">{children}</div>}
        </ContentContainer>
      </Div>
    </StableWrapper>
  );
};

import { Handle, NodeProps, Position } from 'reactflow';
import styled from 'styled-components';
import { Course } from '@/lib/mongo/models/CourseModel';

const ModuleContainer = styled.div<{ $isCompleted: boolean }>`
  padding: 16px;
  border-radius: var(--radius-md);
  background-color: ${(props) => props.theme.colors.card};
  color: ${(props) => props.theme.colors.cardForeground};
  border: 2px solid ${(props) => (props.$isCompleted ? '#22c55e' : props.theme.colors.border)};
  width: 320px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease-in-out;
  position: relative;
  overflow: hidden;

  ${(props) =>
    props.$isCompleted &&
    `
    &::after {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 50px;
      height: 50px;
      background: #22c55e;
      clip-path: polygon(0 0, 100% 0, 100% 100%);
    }
    
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      right: -2px;
      width: 42px;
      height: 42px;
      background: #15803d;
      clip-path: polygon(0 0, 100% 0, 100% 100%);
      z-index: 1;
    }
    
    .completion-checkmark {
      position: absolute;
      top: 5px;
      right: 5px;
      transform: rotate(45deg);
      z-index: 2;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  `}

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    border-color: ${(props) => (props.$isCompleted ? '#22c55e' : props.theme.colors.primary)};
  }

  .module-title {
    font-weight: 600;
    margin-bottom: 8px;
    color: ${(props) => props.theme.colors.primary};
  }

  .module-description {
    font-size: 14px;
    margin-bottom: 10px;
    color: ${(props) => props.theme.colors.mutedForeground};
  }

  .module-meta {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    margin-top: 14px;
    color: ${(props) => props.theme.colors.mutedForeground};
  }

  .module-required {
    background-color: ${(props) => props.theme.colors.primary};
    color: ${(props) => props.theme.colors.primaryForeground};
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
  }

  .module-optional {
    background-color: ${(props) => props.theme.colors.muted};
    color: ${(props) => props.theme.colors.mutedForeground};
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
  }

  .module-time {
    display: flex;
    align-items: center;
    gap: 4px;
    font-weight: 600;
    background-color: ${(props) => props.theme.colors.accent};
    color: ${(props) => props.theme.colors.accentForeground};
    padding: 2px 8px;
    border-radius: var(--radius-sm);
    font-size: 12px;
  }

  .time-value {
    font-size: 14px;
    color: inherit;
  }

  .lessons-progress {
    margin-top: 12px;
  }

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 6px;
  }

  .progress-label {
    font-size: 12px;
    font-weight: 500;
    color: ${(props) => props.theme.colors.primary};
  }

  .progress-count {
    font-size: 12px;
    font-weight: 500;
  }

  .progress-bar-bg {
    width: 100%;
    height: 6px;
    background-color: ${(props) => props.theme.colors.muted};
    border-radius: 3px;
    overflow: hidden;
  }

  .progress-bar-fill {
    height: 100%;
    border-radius: 3px;
    background-color: ${(props) => props.theme.colors.primary};
    transition: width 0.3s ease;
  }
`;

interface NodeModuleEditProps extends NodeProps {
  showLessonsProgress: boolean;
}
export const NodeModuleEdit: React.FC<NodeModuleEditProps> = ({ data, showLessonsProgress }) => {
  const module = data.module as Course['modules']['roadmap'][number];

  const handleModuleClick = () => {};

  // Calculate lesson completion stats
  const totalLessons = module.lessons.length;
  const completedLessons = module.lessons.filter((lesson) => lesson.isCompleted).length;
  const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  const isCompleted = totalLessons > 0 && completedLessons === totalLessons;

  return (
    <ModuleContainer $isCompleted={isCompleted} onClick={handleModuleClick}>
      <Handle type="target" position={Position.Top} isConnectable={false} />
      <div className="module-title">{module.title}</div>
      {module.description && <div className="module-description">{module.description}</div>}

      {isCompleted && (
        <div className="completion-checkmark">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 20 20" fill="white">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Lesson progress indicator - always show, but display N/A when no lessons */}
      {showLessonsProgress && (
        <div className="lessons-progress">
          <div className="progress-header">
            <span className="progress-label">
              {isCompleted ? (
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    style={{ marginRight: '4px' }}
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Completed
                </span>
              ) : (
                'Progress'
              )}
            </span>
            <span className="progress-count">
              {totalLessons > 0 ? (
                `${completedLessons}/${totalLessons} lessons`
              ) : (
                <span style={{ fontStyle: 'italic', opacity: 0.6 }}>N/A</span>
              )}
            </span>
          </div>
          {totalLessons > 0 && (
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: `${completionPercentage}%` }}></div>
            </div>
          )}
        </div>
      )}

      <div className="module-meta">
        {module.estimatedHours !== undefined && (
          <div className="module-time">
            Est. Time: <span className="time-value">{module.estimatedHours}h</span>
          </div>
        )}
        <div className={module.isRequired ? 'module-required' : 'module-optional'}>
          {module.isRequired ? 'Required' : 'Optional'}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={false} />
    </ModuleContainer>
  );
};

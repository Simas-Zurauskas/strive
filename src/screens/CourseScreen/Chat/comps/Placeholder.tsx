import styled from 'styled-components';
import { MessageSquare } from 'lucide-react';

const EmptyStateContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
  height: 100%;
  gap: 1rem;
  color: var(--muted-foreground);
  max-width: 420px;
`;

const EmptyStateIcon = styled.div`
  background-color: var(--strive);
  border-radius: 50%;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
`;

const EmptyStateTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--foreground);
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.3rem;
`;

const EmptyStateText = styled.p`
  font-size: 0.9rem;
  max-width: 400px;
  margin-bottom: 0.75rem;
`;

const SuggestionList = styled.ul`
  text-align: left;
  margin-top: 1rem;
  width: 100%;
  max-width: 400px;
`;

const SuggestionItem = styled.li`
  background-color: var(--secondary);
  border-radius: 0.5rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: var(--foreground);
  cursor: pointer;
  transition: all 0.2s ease;
  list-style: none;
  border-left: 3px solid var(--strive);

  &:hover {
    background-color: var(--accent);
  }
`;

const EmptyStateHighlight = styled.span`
  color: var(--primary-foreground);
  font-weight: 600;
  background-color: var(--strive);
  padding: 0.3rem 0.6rem;
  border-radius: 0.375rem;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  margin: 0 0.3rem;
  vertical-align: middle;
  line-height: 1.2;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

interface PlaceholderProps {
  level: 'course' | 'module' | 'lesson';
  onSuggestionClick: (suggestion: string) => void;
}

const Placeholder: React.FC<PlaceholderProps> = ({ level, onSuggestionClick }) => {
  // Get appropriate suggestions based on the level
  const getSuggestions = () => {
    switch (level) {
      case 'course':
        return [
          'What are the prerequisites for this course?',
          'How is this course structured?',
          'What will I be able to do after completing this course?',
        ];
      case 'module':
        return [
          'What are the key concepts in this module?',
          'How does this module connect to the overall course goals?',
          'Can you provide a real-world scenario where these module concepts apply?',
        ];
      case 'lesson':
        return [
          'Can you explain this lesson in simpler terms?',
          'What are the most important takeaways from this lesson?',
          'How does this lesson connect to the rest of the module?',
        ];
    }
  };

  // Get appropriate title based on the level
  const getEmptyStateTitle = () => {
    switch (level) {
      case 'course':
        return (
          <>
            Chat with your <EmptyStateHighlight>Strive</EmptyStateHighlight> course assistant
          </>
        );
      case 'module':
        return (
          <>
            Chat about this <EmptyStateHighlight>module</EmptyStateHighlight>
          </>
        );
      case 'lesson':
        return (
          <>
            Chat about this <EmptyStateHighlight>lesson</EmptyStateHighlight>
          </>
        );
    }
  };

  // Get appropriate description based on the level
  const getEmptyStateDescription = () => {
    switch (level) {
      case 'course':
        return 'Ask questions about course structure, prerequisites, or general guidance for your learning journey.';
      case 'module':
        return "Ask questions about this module's concepts, how it fits into the course, or clarification on module topics.";
      case 'lesson':
        return 'Ask for detailed explanations, help with exercises, or clarification on specific concepts in this lesson.';
    }
  };

  const suggestions = getSuggestions();
  const emptyStateTitle = getEmptyStateTitle();
  const emptyStateDescription = getEmptyStateDescription();

  return (
    <EmptyStateContainer>
      <EmptyStateIcon>
        <MessageSquare size={30} className="text-primary-foreground" />
      </EmptyStateIcon>
      <EmptyStateTitle>{emptyStateTitle}</EmptyStateTitle>
      <EmptyStateText>{emptyStateDescription}</EmptyStateText>
      <SuggestionList>
        {suggestions.map((suggestion, index) => (
          <SuggestionItem key={index} onClick={() => onSuggestionClick(suggestion)}>
            {suggestion}
          </SuggestionItem>
        ))}
      </SuggestionList>
    </EmptyStateContainer>
  );
};

export default Placeholder;

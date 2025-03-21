import { Course } from '@/lib/mongo/models/CourseModel';
import styled from 'styled-components';
import { RootView, ModuleView, LessonView } from './Views';
import { View } from '../types';

const Div = styled.div``;

const ContentContainer = styled.div`
  max-width: 720px;
  margin: 0 auto;
`;

interface MaterialViewerProps {
  course: Course;
  view: View;
  setView: (view: View) => void;
}

const MaterialViewer: React.FC<MaterialViewerProps> = ({ course, view, setView }) => {
  return (
    <Div>
      <ContentContainer className="mb-6">
        <div style={{ height: 48 }} />
        {view.type === 'root' && <RootView course={course} setView={setView} />}
        {view.type === 'module' && <ModuleView course={course} moduleId={view.moduleId} setView={setView} />}
        {view.type === 'lesson' && (
          <LessonView course={course} moduleId={view.moduleId} lessonNumber={view.lessonNumber} />
        )}
      </ContentContainer>
    </Div>
  );
};

export default MaterialViewer;

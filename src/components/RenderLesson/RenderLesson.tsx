import styled from 'styled-components';
import { MD } from './comps';

const Div = styled.div`
  .hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    aspect-ratio: 16/5;
    border-radius: 4px;
  }
`;

interface RenderLessonProps {
  md: string;
  heroImageUrl: string;
}

const RenderLesson: React.FC<RenderLessonProps> = ({
  md,
  heroImageUrl = `https://oaidalleapiprodscus.blob.core.windows.net/private/org-aOAgTGevm9nuj90WvvgQlOcl/user-mXzX7RcdW9Lf689S1whmdlNk/img-TBgwzyd835PYGUxlQqSvcxyt.png?st=2025-03-17T14%3A25%3A37Z&se=2025-03-17T16%3A25%3A37Z&sp=r&sv=2024-08-04&sr=b&rscd=inline&rsct=image/png&skoid=d505667d-d6c1-4a0a-bac7-5c84a87759f8&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-03-16T17%3A31%3A11Z&ske=2025-03-17T17%3A31%3A11Z&sks=b&skv=2024-08-04&sig=w4XRgKVZ68V5Y53qHF9HwW3QNG%2B90olWgx7pbVM4cAc%3D`,
}) => {
  return (
    <Div>
      {heroImageUrl && <img src={heroImageUrl} alt="Hero Image" className="hero-img" />}
      <MD value={md} />
    </Div>
  );
};

export default RenderLesson;

import styled from 'styled-components';
import { LoaderIcon } from 'lucide-react';

const fadeInKeyframes = `
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const Div = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  ${fadeInKeyframes}
`;

interface LoaderProps {}

const Loader: React.FC<LoaderProps> = () => {
  return (
    <Div>
      <div className="bg-card py-6 px-10 rounded-lg shadow-md flex items-center gap-3 border opacity-0 animate-[fadeIn_0.2s_ease-in_0.3s_forwards]">
        <LoaderIcon className="w-7 h-7 animate-[spin_2s_linear_infinite] text-primary" />
        <span className="text-md font-medium text-foreground">{'Loading'}</span>
      </div>
    </Div>
  );
};

export default Loader;

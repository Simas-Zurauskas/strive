import { cn } from '@/lib/utils';

interface Props {
  children: React.ReactNode;
  className?: string;
}

export const H1: React.FC<Props> = ({ children, className }) => {
  return (
    <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)}>{children}</h1>
  );
};

export const H2: React.FC<Props> = ({ children, className }) => {
  return <h2 className={cn('scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0', className)}>{children}</h2>;
};

export const H3: React.FC<Props> = ({ children, className }) => {
  return <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)}>{children}</h3>;
};

export const H4: React.FC<Props> = ({ children, className }) => {
  return <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)}>{children}</h4>;
};

export const P: React.FC<Props> = ({ children, className }) => {
  return <p className={cn('leading-7 [&:not(:first-child)]:mt-1', className)}>{children}</p>;
};

export const Muted: React.FC<Props> = ({ children, className }) => {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>;
};

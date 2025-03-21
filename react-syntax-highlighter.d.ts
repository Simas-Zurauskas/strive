declare module "react-syntax-highlighter" {
  import { ReactNode } from "react";

  export const Prism: React.ComponentType<any>;
  export const Light: React.ComponentType<any>;

  export default function SyntaxHighlighter(props: any): ReactNode;
}

declare module "react-syntax-highlighter/dist/esm/styles/prism" {
  export const vscDarkPlus: any;
  export const gruvboxLight: any;
}

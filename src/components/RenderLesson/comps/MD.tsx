import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, gruvboxLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useTheme } from 'next-themes';

const Div = styled.div`
  line-height: 1.6;
  color: ${(props) => props.theme.colors.foreground};
  background-color: ${(props) => props.theme.colors.background};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
    line-height: 1.25;
    color: ${(props) => props.theme.colors.foreground};
  }
  h1 {
    font-size: 2em;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    padding-bottom: 0.3em;
  }
  h2 {
    font-size: 1.5em;
    border-bottom: 1px solid ${(props) => props.theme.colors.border};
    padding-bottom: 0.3em;
  }

  /* Text formatting */
  p {
    margin-top: 0;
    margin-bottom: 16px;
  }
  a {
    color: ${(props) => props.theme.colors.primary};
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  strong {
    font-weight: 600;
  }

  /* Lists */
  ul,
  ol {
    padding-left: 2em;
    margin-top: 0;
    margin-bottom: 16px;
  }
  li {
    margin-top: 0.25em;
  }

  /* Blockquotes */
  blockquote {
    padding: 0 1em;
    color: ${(props) => props.theme.colors.mutedForeground};
    border-left: 0.25em solid ${(props) => props.theme.colors.border};
    margin: 0 0 16px 0;
  }

  /* Code (inline) */
  code:not([class*='language-']) {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: ${(props) => props.theme.colors.muted};
    color: ${(props) => props.theme.colors.primary};
    border-radius: 3px;
    font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
  }

  /* Tables */
  table {
    display: block;
    width: 100%;
    overflow: auto;
    margin-top: 0;
    margin-bottom: 16px;
    border-spacing: 0;
    border-collapse: collapse;
  }
  table th,
  table td {
    padding: 6px 13px;
    border: 1px solid ${(props) => props.theme.colors.border};
  }
  table th {
    font-weight: 600;
    background-color: ${(props) => props.theme.colors.muted};
  }
  table tr {
    background-color: ${(props) => props.theme.colors.background};
    border-top: 1px solid ${(props) => props.theme.colors.border};
  }
  table tr:nth-child(2n) {
    background-color: ${(props) => props.theme.colors.muted};
  }

  /* Horizontal rule */
  hr {
    height: 0.25em;
    padding: 0;
    margin: 24px 0;
    background-color: ${(props) => props.theme.colors.border};
    border: 0;
  }

  /* Images */
  img {
    max-width: 100%;
    box-sizing: border-box;
  }

  /* Code blocks - handled by SyntaxHighlighter */
  pre {
    background-color: ${(props) => props.theme.colors.card};
    border-radius: ${(props) => props.theme.radius.md};
    overflow: auto;
    margin: 1em 0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  }
`;

interface MDProps {
  value: string;
}

const markdown = `# A demo of \`react-markdown\`

\`react-markdown\` is a markdown component for React.

👉 Changes are re-rendered as you type.

👈 Try writing some markdown on the left.

## Overview

* Follows [CommonMark](https://commonmark.org)
* Optionally follows [GitHub Flavored Markdown](https://github.github.com/gfm/)
* Renders actual React elements instead of using \`dangerouslySetInnerHTML\`
* Lets you define your own components (to render \`MyHeading\` instead of \`'h1'\`)
* Has a lot of plugins

## Contents

Here is an example of a plugin in action
([remark-toc](https://github.com/remarkjs/remark-toc)).
**This section is replaced by an actual table of contents**.

## Syntax highlighting

Here is an example of a plugin to highlight code:
[rehype-starry-night](https://github.com/rehypejs/rehype-starry-night).

\`\`\`js
import React from 'react'
import ReactDom from 'react-dom'
import {MarkdownHooks} from 'react-markdown'
import rehypeStarryNight from 'rehype-starry-night'

const markdown = \`
# Your markdown here
\`

ReactDom.render(
  <MarkdownHooks rehypePlugins={[rehypeStarryNight]}>{markdown}</MarkdownHooks>,
  document.querySelector('#content')
)
\`\`\`

Pretty neat, eh?

## GitHub flavored markdown (GFM)

For GFM, you can *also* use a plugin:
[remark-gfm](https://github.com/remarkjs/react-markdown#use).
It adds support for GitHub-specific extensions to the language:
tables, strikethrough, tasklists, and literal URLs.

These features **do not work by default**.
👆 Use the toggle above to add the plugin.

| Feature    | Support              |
| ---------: | :------------------- |
| CommonMark | 100%                 |
| GFM        | 100% w/ \`remark-gfm\` |

~~strikethrough~~

* [ ] task list
* [x] checked item

https://example.com

## HTML in markdown

⚠️ HTML in markdown is quite unsafe, but if you want to support it, you can
use [rehype-raw](https://github.com/rehypejs/rehype-raw).
You should probably combine it with
[rehype-sanitize](https://github.com/rehypejs/rehype-sanitize).

<blockquote>
  👆 Use the toggle above to add the plugin.
</blockquote>

## Components

You can pass components to change things:

\`\`\`js
import React from 'react'
import ReactDom from 'react-dom'
import Markdown from 'react-markdown'
import MyFancyRule from './components/my-fancy-rule.js'

const markdown = \`
# Your markdown here
\`

ReactDom.render(
  <Markdown
    components={{
      // Use h2s instead of h1s
      h1: 'h2',
      // Use a component instead of hrs
      hr(props) {
        const {node, ...rest} = props
        return <MyFancyRule {...rest} />
      }
    }}
  >
    {markdown}
  </Markdown>,
  document.querySelector('#content')
)
\`\`\`

## More info?

Much more info is available in the
[readme on GitHub](https://github.com/remarkjs/react-markdown)!

***

A component by [Espen Hovlandsdal](https://espen.codes/)`;

export const MD: React.FC<MDProps> = ({ value }) => {
  const { resolvedTheme } = useTheme();
  const [currentTheme, setCurrentTheme] = useState<string>('light');

  // Update theme when it changes
  useEffect(() => {
    setCurrentTheme(resolvedTheme || 'light');
  }, [resolvedTheme]);

  return (
    <Div>
      <Markdown
        remarkPlugins={[remarkGfm]}
        components={{
          code: ({ node, className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            return match ? (
              <SyntaxHighlighter
                // @ts-ignore - Type mismatch between react-syntax-highlighter and its types
                style={currentTheme === 'dark' ? vscDarkPlus : gruvboxLight}
                language={match[1]}
                PreTag="div"
                {...props}
                customStyle={{
                  borderRadius: '4px',
                  fontSize: '14px',
                }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {value}
      </Markdown>
    </Div>
  );
};

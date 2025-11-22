import React from 'react';
import ReactMarkdown from 'react-markdown';
import {Text as GravityText} from '@gravity-ui/uikit';
import CodeBlock from '@/shared/ui/CodeBlock/CodeBlock';

type MarkdownViewerProps = {
    content: string;
};

const MarkdownViewer: React.FC<MarkdownViewerProps> = ({content}) => {
    if (!content || !content.trim()) {
        return null;
    }

    return (
        <ReactMarkdown
            components={{
                // Обработка параграфов - используем Gravity Text
                p: ({children}) => (
                    <GravityText variant="body-1" style={{marginBottom: '12px'}}>
                        {children}
                    </GravityText>
                ),
                // Обработка заголовков
                h1: ({children}) => (
                    <GravityText variant="header-1" style={{marginTop: '24px', marginBottom: '16px'}}>
                        {children}
                    </GravityText>
                ),
                h2: ({children}) => (
                    <GravityText variant="header-2" style={{marginTop: '20px', marginBottom: '12px'}}>
                        {children}
                    </GravityText>
                ),
                h3: ({children}) => (
                    <GravityText variant="header-3" style={{marginTop: '16px', marginBottom: '10px'}}>
                        {children}
                    </GravityText>
                ),
                // Обработка инлайн кода
                code: ({inline, className, children, ...props}) => {
                    // Блочные кода обрабатываются в pre, здесь только инлайн
                    if (inline) {
                        return (
                            <code
                                style={{
                                    backgroundColor: 'var(--g-color-base-float)',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontFamily: 'monospace',
                                    fontSize: '0.9em',
                                }}
                                {...props}
                            >
                                {children}
                            </code>
                        );
                    }

                    // Для блочных кодов возвращаем обычный code, обработка будет в pre
                    return (
                        <code className={className} {...props}>
                            {children}
                        </code>
                    );
                },
                // Обработка блоков кода (pre содержит code)
                pre: ({children}) => {
                    const codeElement = React.Children.toArray(children).find(
                        (child) => React.isValidElement(child) && child.type === 'code',
                    ) as React.ReactElement<{className?: string; children?: React.ReactNode}> | undefined;

                    if (codeElement) {
                        const className = codeElement.props.className || '';
                        const match = /language-(\w+)/.exec(className);
                        const language = match ? match[1] : 'text';
                        const codeContent = String(codeElement.props.children || '').trim();
                        return <CodeBlock language={language}>{codeContent}</CodeBlock>;
                    }

                    return <pre>{children}</pre>;
                },
                // Обработка списков
                ul: ({children}) => (
                    <ul style={{marginBottom: '12px', paddingLeft: '24px'}}>{children}</ul>
                ),
                ol: ({children}) => (
                    <ol style={{marginBottom: '12px', paddingLeft: '24px'}}>{children}</ol>
                ),
                li: ({children}) => (
                    <li style={{marginBottom: '4px'}}>
                        <GravityText variant="body-1">{children}</GravityText>
                    </li>
                ),
                // Обработка ссылок
                a: ({href, children}) => (
                    <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{color: 'var(--g-color-text-link)'}}
                    >
                        {children}
                    </a>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
};

export default MarkdownViewer;

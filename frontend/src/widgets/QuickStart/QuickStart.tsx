import React, {useEffect, useRef} from 'react';
import {Card, Text} from '@gravity-ui/uikit';
import {CopyInput} from '@/shared/ui/CopyInput';
import ReactMarkdown from 'react-markdown';
import type {Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import './QuickStart.scss';

type QuickStartProps = {
    dsn: string;
    exampleDsnConnection?: string;
};

const CodeBlock: React.FC<{children: React.ReactNode; className?: string}> = ({
    children,
    className,
}) => {
    const codeRef = useRef<HTMLElement>(null);
    const isInline = !className || !className.includes('language-');

    useEffect(() => {
        if (codeRef.current && !isInline) {
            Prism.highlightElement(codeRef.current);
        }
    }, [children, isInline]);

    if (isInline) {
        return (
            <code ref={codeRef} className="quick-start-inline-code">
                {String(children)}
            </code>
        );
    }

    const language = className?.replace('language-', '') || 'text';

    return (
        <pre className="quick-start-code-block">
            <code ref={codeRef} className={className} aria-label={`Code block: ${language}`}>
                {String(children).replace(/\n$/, '')}
            </code>
        </pre>
    );
};

const QuickStart: React.FC<QuickStartProps> = ({dsn, exampleDsnConnection}) => {
    const markdownWithDsn = exampleDsnConnection
        ? exampleDsnConnection.replace(/YOUR_DSN_HERE/g, dsn)
        : '';

    const markdownComponents: Components = {
        code(props) {
            const {className, children} = props;
            return <CodeBlock className={className}>{children}</CodeBlock>;
        },
        p({children}) {
            return <Text as="p">{children}</Text>;
        },
        h1({children}) {
            return <Text as="h1" variant="header-1">{children}</Text>;
        },
        h2({children}) {
            return <Text as="h2" variant="header-2">{children}</Text>;
        },
        h3({children}) {
            return <Text as="h3" variant="header-3">{children}</Text>;
        },
        h4({children}) {
            return <Text as="h4" variant="subheader-1">{children}</Text>;
        },
        h5({children}) {
            return <Text as="h5" variant="subheader-2">{children}</Text>;
        },
        h6({children}) {
            return <Text as="h6" variant="subheader-3">{children}</Text>;
        },
        ul({children}) {
            return <ul className="quick-start-list">{children}</ul>;
        },
        ol({children}) {
            return <ol className="quick-start-list">{children}</ol>;
        },
        li({children}) {
            return <li className="quick-start-list-item">{children}</li>;
        },
        a({href, children}) {
            return (
                <a href={href} target="_blank" rel="noopener noreferrer" className="quick-start-link">
                    {children}
                </a>
            );
        },
        strong({children}) {
            return <strong className="quick-start-strong">{children}</strong>;
        },
        em({children}) {
            return <em className="quick-start-em">{children}</em>;
        },
    };

    return (
        <>
            <Card view="filled" theme={'info'} style={{padding: '16px', margin: '16px 0'}}>
                <CopyInput label={'DSN: '} value={dsn} size={'l'} />
            </Card>

            {markdownWithDsn && (
                <Card view="filled" style={{padding: '16px', margin: '16px 0'}}>
                    <div className="quick-start-markdown">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                            {markdownWithDsn}
                        </ReactMarkdown>
                    </div>
                </Card>
            )}
        </>
    );
};

export default QuickStart;

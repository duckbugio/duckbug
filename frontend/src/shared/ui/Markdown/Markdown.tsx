import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Button, Text as GravityText, Icon} from '@gravity-ui/uikit';
import ReactMarkdown from 'react-markdown';
import type {Components} from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';
import {Check, Copy} from '@gravity-ui/icons';
import './Markdown.scss';
import 'prismjs/themes/prism-tomorrow.css';

type MarkdownProps = {
    content: string;
    className?: string;
};

const CodeBlock: React.FC<{children: React.ReactNode; className?: string}> = ({
    children,
    className,
}) => {
    const codeRef = useRef<HTMLElement>(null);
    const language = className?.replace('language-', '');

    useEffect(() => {
        if (codeRef.current && language) {
            Prism.highlightElement(codeRef.current);
        }
    }, [children, language]);

    return (
        <code ref={codeRef} className={className} title={`Code block: ${language}`}>
            {String(children).replace(/\n$/, '')}
        </code>
    );
};

const PreWithCopy = (
    props: React.DetailedHTMLProps<React.HTMLAttributes<HTMLPreElement>, HTMLPreElement> & {
        node?: unknown;
    },
) => {
    const [isCopied, setIsCopied] = useState(false);

    const handleCopyClick = useCallback(() => {
        // @ts-expect-error - accessing internal ReactMarkdown node structure
        const codeValue = props.node?.children[0]?.children[0]?.value;

        if (codeValue) {
            navigator.clipboard.writeText(codeValue);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
        }
    }, [props.node]);

    return (
        <div className="markdown-pre-container">
            <div className="markdown-copy-button-container">
                <Button
                    className="markdown-copy-button"
                    view="outlined-contrast"
                    onClick={handleCopyClick}
                    title="Копировать код"
                    size="m"
                >
                    <Icon data={isCopied ? Check : Copy} size={16} />
                </Button>
            </div>
            <pre {...props} />
        </div>
    );
};

const markdownComponents: Components = {
    pre: PreWithCopy,
    code: ({className, children}) => <CodeBlock className={className}>{children}</CodeBlock>,
    p: ({children}) => <GravityText as="p">{children}</GravityText>,
    h1: ({children}) => (
        <GravityText as="h1" variant="header-1">
            {children}
        </GravityText>
    ),
    h2: ({children}) => (
        <GravityText as="h2" variant="header-2">
            {children}
        </GravityText>
    ),
    h3: ({children}) => (
        <GravityText as="h3" variant="header-2">
            {children}
        </GravityText>
    ),
    h4: ({children}) => (
        <GravityText as="h4" variant="subheader-1">
            {children}
        </GravityText>
    ),
    h5: ({children}) => (
        <GravityText as="h5" variant="subheader-2">
            {children}
        </GravityText>
    ),
    h6: ({children}) => (
        <GravityText as="h6" variant="subheader-3">
            {children}
        </GravityText>
    ),
    ul: ({children}) => <ul className="markdown-list">{children}</ul>,
    ol: ({children}) => <ol className="markdown-list">{children}</ol>,
    li: ({children}) => <li className="markdown-list-item">{children}</li>,
    a: ({href, children}) => (
        <a href={href} target="_blank" rel="noopener noreferrer" className="markdown-link">
            {children}
        </a>
    ),
    strong: ({children}) => <strong className="markdown-strong">{children}</strong>,
    em: ({children}) => <em className="markdown-em">{children}</em>,
};

export const Markdown: React.FC<MarkdownProps> = ({content, className}) => {
    return (
        <div className={`markdown ${className || ''}`}>
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

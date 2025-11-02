import React, {useEffect, useRef} from 'react';
import {Card} from '@gravity-ui/uikit';
import {CopyInput} from '@/shared/ui/CopyInput';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Prism from 'prismjs';

type QuickStartProps = {
    dsn: string;
    exampleDsnConnection?: string;
};

const CodeBlock: React.FC<{children: React.ReactNode; className?: string}> = ({
    children,
    className,
}) => {
    const codeRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (codeRef.current) {
            Prism.highlightElement(codeRef.current);
        }
    }, [children]);

    return (
        <pre>
            <code ref={codeRef} className={className}>
                {String(children).replace(/\n$/, '')}
            </code>
        </pre>
    );
};

const QuickStart: React.FC<QuickStartProps> = ({dsn, exampleDsnConnection}) => {
    // Заменяем плейсхолдер DSN на реальный DSN в markdown
    const markdownWithDsn = exampleDsnConnection
        ? exampleDsnConnection.replace(/YOUR_DSN_HERE/g, dsn)
        : '';

    return (
        <>
            <Card view="filled" theme={'info'} style={{padding: '16px', margin: '16px 0'}}>
                <CopyInput label={'DSN: '} value={dsn} size={'l'} />
            </Card>

            {markdownWithDsn && (
                <Card view="filled" style={{padding: '16px', margin: '16px 0'}}>
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            code(props: any) {
                                const {inline, className, children, ...rest} = props;
                                if (inline) {
                                    return (
                                        <code className={className} {...rest}>
                                            {children}
                                        </code>
                                    );
                                }
                                return (
                                    <CodeBlock className={className}>{children}</CodeBlock>
                                );
                            },
                        }}
                    >
                        {markdownWithDsn}
                    </ReactMarkdown>
                </Card>
            )}
        </>
    );
};

export default QuickStart;

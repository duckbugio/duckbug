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
                            code(props) {
                                const {className, children} = props;
                                return <CodeBlock className={className}>{children}</CodeBlock>;
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

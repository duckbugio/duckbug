import React, {useEffect, useRef} from 'react';
import Prism from 'prismjs';

type CodeBlockProps = {
    children?: unknown;
    language?: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({children, language = 'javascript'}) => {
    const ref = useRef<HTMLElement>(null);
    useEffect(() => {
        if (ref.current) {
            Prism.highlightElement(ref.current);
        }
    }, [children]);

    return (
        <pre>
            <code ref={ref} className={`language-${language}`}>
                {JSON.stringify(children, null, 2)}
            </code>
        </pre>
    );
};

export default CodeBlock;

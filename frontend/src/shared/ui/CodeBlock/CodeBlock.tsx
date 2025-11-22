import React, {useEffect, useRef} from 'react';
import Prism from 'prismjs';

type CodeBlockProps = {
    children?: unknown;
    language?: string;
};

const CodeBlock: React.FC<CodeBlockProps> = ({children, language = 'javascript'}) => {
    const ref = useRef<HTMLElement>(null);
    
    // Преобразуем children в строку для отображения
    const codeContent = typeof children === 'string' 
        ? children.trim() 
        : typeof children === 'object' && children !== null
        ? JSON.stringify(children, null, 2)
        : String(children ?? '');

    useEffect(() => {
        if (ref.current) {
            Prism.highlightElement(ref.current);
        }
    }, [codeContent]);

    return (
        <pre>
            <code ref={ref} className={`language-${language}`}>
                {codeContent}
            </code>
        </pre>
    );
};

export default CodeBlock;

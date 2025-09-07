import React from 'react';
import {Card} from '@gravity-ui/uikit';

interface StackTraceProps {
    stacktrace: string[];
}

const StackTrace: React.FC<StackTraceProps> = ({stacktrace}) => {
    return (
        <Card view={'raised'} style={{padding: '8px'}}>
            {stacktrace.map((row, index: number) => (
                <Card key={index} style={{marginBottom: '8px', padding: '8px'}}>
                    {row.trim()}
                </Card>
            ))}
        </Card>
    );
};

export default StackTrace;

import React, {ReactElement} from 'react';
import CodeBlock from '@/shared/ui/CodeBlock/CodeBlock';

interface JsonToTableProps {
    data: Record<string, unknown> | Array<unknown>;
    className?: string;
}

const JsonToTable: React.FC<JsonToTableProps> = ({data, className}) => {
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        return <CodeBlock language={'json'}>{data as unknown as ReactElement}</CodeBlock>;
    }

    // return typeof data;

    const renderValue = (value: unknown): React.ReactNode => {
        if (value === null) {
            return 'null';
        }

        if (typeof value === 'object') {
            return <JsonToTable data={value as Record<string, unknown>} />;
            //return <CodeBlock language={'json'}>{String(value)}</CodeBlock>;
        }

        return String(value);
    };

    return (
        <div className={`json-table-container ${className || ''}`}>
            <table className="json-table">
                <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.entries(data).map(([key, value]) => (
                        <tr key={key}>
                            <td className="json-key">{key}</td>
                            <td className="json-value">{renderValue(value)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default JsonToTable;

import React, {useMemo} from 'react';
import {Card} from '@gravity-ui/uikit';
import {CopyInput} from '@/shared/ui/CopyInput';
import {Markdown} from '@/shared/ui/Markdown';

type QuickStartProps = {
    dsn: string;
    exampleDsnConnection?: string;
};


const QuickStart: React.FC<QuickStartProps> = ({dsn, exampleDsnConnection}) => {
    const markdownWithDsn = useMemo(
        () => exampleDsnConnection?.replace(/YOUR_DSN_HERE/g, dsn) ?? '',
        [dsn, exampleDsnConnection],
    );

    return (
        <>
            <Card view="filled" theme={'info'} style={{padding: '16px', margin: '16px 0'}}>
                <CopyInput label={'DSN: '} value={dsn} size={'l'} />
            </Card>

            {markdownWithDsn && (
                <Card style={{padding: '16px', margin: '16px 0'}}>
                    <Markdown content={markdownWithDsn} />
                </Card>
            )}
        </>
    );
};

export default QuickStart;

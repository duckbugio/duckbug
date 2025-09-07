import React from 'react';
import {Card} from '@gravity-ui/uikit';
import {CopyInput} from '@/shared/ui/CopyInput';
import QuickStartPHP from '@/shared/ui/QuickStart/languages/QuickStartPHP';

type QuickStartProps = {
    language: string;
    dsn: string;
};

const QuickStart: React.FC<QuickStartProps> = ({language, dsn}) => {
    return (
        <>
            <Card view="filled" theme={'info'} style={{padding: '16px', margin: '16px 0'}}>
                <CopyInput label={'DSN: '} value={dsn} size={'l'} />
            </Card>

            {language === 'php' && <QuickStartPHP dsn={dsn} />}
        </>
    );
};

export default QuickStart;

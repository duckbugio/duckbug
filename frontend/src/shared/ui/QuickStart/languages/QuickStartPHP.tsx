import React from 'react';
import CodeBlock from '@/shared/ui/CodeBlock/CodeBlock';
import {Text as GravityText} from '@gravity-ui/uikit';

type QuickStartPHPProps = {
    dsn: string;
};

const language = 'php';

const QuickStartPHP: React.FC<QuickStartPHPProps> = ({dsn}) => {
    return (
        <>
            <GravityText variant={'header-2'}>Install</GravityText>
            <br />
            <br />
            <GravityText variant={'body-1'}>
                To install the PHP SDK, you need to be using Composer in your project. For more
                details about Composer, see the Composer documentation.
            </GravityText>

            <br />
            <br />
            <br />

            <GravityText variant={'header-2'}>Configure SDK</GravityText>
            <br />
            <br />
            <GravityText variant={'body-1'}>
                To capture all errors, even the one during the startup of your application, you
                should initialize the Sentry PHP SDK as soon as possible.
            </GravityText>

            <CodeBlock language={language}>
                {`
                    FuckBug::init([
                        Provider::setup(
                            new FuckBugProvider(
                                '${dsn}',
                            )
                        ),
                    ]);
                `}
            </CodeBlock>

            <br />

            <GravityText variant={'header-2'}>Verify</GravityText>
            <br />
            <br />
            <GravityText variant={'body-1'}>
                In PHP you can either capture a caught exception or capture the last error with
                captureLastError.
            </GravityText>

            <CodeBlock language={language}>
                {`
                    try {
                        $this->functionFailsForSure();
                    } catch (\\Throwable $exception) {
                        FuckBug::capture($exception);
                    }
                `}
            </CodeBlock>
        </>
    );
};

export default QuickStartPHP;

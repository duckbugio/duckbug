import React from 'react';
import MarkdownViewer from '@/shared/ui/MarkdownViewer/MarkdownViewer';

type QuickStartPHPProps = {
    dsn: string;
};

const QuickStartPHP: React.FC<QuickStartPHPProps> = ({dsn}) => {
    const markdownContent = `## Install

To install the PHP SDK, you need to be using Composer in your project. For more details about Composer, see the Composer documentation.

## Configure SDK

To capture all errors, even the one during the startup of your application, you should initialize the Sentry PHP SDK as soon as possible.

\`\`\`php
DuckBug::init([
    Provider::setup(
        new DuckBugProvider(
            '${dsn}',
        )
    ),
]);
\`\`\`

## Verify

In PHP you can either capture a caught exception or capture the last error with captureLastError.

\`\`\`php
try {
    $this->functionFailsForSure();
} catch (\\Throwable $exception) {
    DuckBug::capture($exception);
}
\`\`\`
`;

    return <MarkdownViewer content={markdownContent} />;
};

export default QuickStartPHP;

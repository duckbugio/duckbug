import React, {FC} from 'react';

interface PageContainerProps {
    children: React.ReactNode;
}

export const PageContainer: FC<PageContainerProps> = ({children}) => {
    return (
        <div
            style={{
                width: '100%',
                maxWidth: '1400px',
                margin: '0 auto',
                paddingTop: '24px',
                paddingLeft: '24px',
                paddingRight: '24px',
            }}
        >
            {children}
        </div>
    );
};

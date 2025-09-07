import React from 'react';
import block from 'bem-cn-lite';

const b = block('not-found');

export const NotFoundPage: React.FC = () => {
    return (
        <div className={b()}>
            <div className={b('block')}>
                <div className={b('title')}>Not Found</div>
            </div>
        </div>
    );
};

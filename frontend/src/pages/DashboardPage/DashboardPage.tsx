import React from 'react';
import block from 'bem-cn-lite';

const b = block('dashboard');

export const DashboardPage: React.FC = () => {
    return (
        <div className={b()}>
            <div className={b('block')}>
                <div className={b('title')}>Dashboard</div>
            </div>
        </div>
    );
};

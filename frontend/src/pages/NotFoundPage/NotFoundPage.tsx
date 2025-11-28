import React from 'react';
import block from 'bem-cn-lite';
import {useTranslation} from '@/shared/lib/i18n/hooks';

const b = block('not-found');

export const NotFoundPage: React.FC = () => {
    const {t} = useTranslation();
    return (
        <div className={b()}>
            <div className={b('block')}>
                <div className={b('title')}>{t('notFound.title')}</div>
            </div>
        </div>
    );
};

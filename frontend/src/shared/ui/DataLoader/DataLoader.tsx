import {Spin} from '@gravity-ui/uikit';
import {FC} from 'react';

export const DataLoader: FC = () => {
    return (
        <div style={{display: 'flex', justifyContent: 'center', padding: '40px'}}>
            <Spin size="l" />
        </div>
    );
};

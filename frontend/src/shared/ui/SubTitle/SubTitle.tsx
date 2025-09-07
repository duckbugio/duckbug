import {Text as GravityText} from '@gravity-ui/uikit';
import {FC} from 'react';

interface SubTitleProps {
    title: string;
}

export const SubTitle: FC<SubTitleProps> = ({title}) => {
    return (
        <div style={{marginTop: '24px'}}>
            <GravityText variant="body-3">{title}</GravityText>
        </div>
    );
};

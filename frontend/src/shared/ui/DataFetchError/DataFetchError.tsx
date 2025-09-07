import {Button, Card, Text as GravityText} from '@gravity-ui/uikit';
import {FC} from 'react';

interface DataFetchErrorProps {
    errorMessage: string;
    onRetry: () => void;
}

export const DataFetchError: FC<DataFetchErrorProps> = ({errorMessage, onRetry}) => {
    return (
        <Card theme="danger" style={{padding: '20px', marginBottom: '20px', textAlign: 'center'}}>
            <GravityText color="danger">Ошибка загрузки данных: {errorMessage}</GravityText>
            <div style={{marginTop: '12px'}}>
                <Button view="outlined" onClick={onRetry}>
                    Повторить
                </Button>
            </div>
        </Card>
    );
};

import {Component, ReactNode} from 'react';
import {Alert, Button} from '@gravity-ui/uikit';

interface ErrorBoundaryProps {
    children: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {hasError: true, error};
    }

    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = {hasError: false, error: null};
    }

    componentDidCatch(_error: Error) {
        // You can wire any client logger here
        // console.error('Uncaught error:', error);
    }

    handleReload = () => {
        this.setState({hasError: false, error: null});
        window.location.reload();
    };

    render() {
        if (this.state.hasError) {
            return (
                <div style={{padding: 20}}>
                    <Alert
                        theme="danger"
                        message={`Произошла ошибка приложения: ${this.state.error?.message ?? ''}`}
                        style={{marginBottom: 16}}
                    />
                    <Button view="outlined" onClick={this.handleReload}>
                        Перезагрузить страницу
                    </Button>
                </div>
            );
        }

        return this.props.children;
    }
}

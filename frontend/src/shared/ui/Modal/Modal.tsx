import {
    Button,
    Modal as GUIModal,
    type ModalProps as GUIModalProps,
    Text as GUIText,
} from '@gravity-ui/uikit';
import {CircleXmarkFill} from '@gravity-ui/icons';

interface ModalProps extends GUIModalProps {
    title: string;
}
export const Modal = ({title, children, onOpenChange, ...props}: ModalProps) => {
    return (
        <GUIModal {...props} onOpenChange={onOpenChange}>
            <div
                style={{
                    padding: '16px',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexDirection: 'row',
                        marginBottom: '16px',
                        gap: '10px',
                    }}
                >
                    <div style={{width: 40, height: 40}} />
                    <div style={{flex: 1, alignSelf: 'center'}}>
                        <GUIText variant="header-1">{title}</GUIText>
                    </div>
                    <Button
                        view="flat"
                        style={{
                            width: 40,
                            height: 40,
                        }}
                        onClick={() => onOpenChange?.(false)}
                    >
                        <div
                            style={{
                                flex: 1,
                                width: 40,
                                height: 40,
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                            }}
                        >
                            <CircleXmarkFill />
                        </div>
                    </Button>
                </div>

                {children}
            </div>
        </GUIModal>
    );
};

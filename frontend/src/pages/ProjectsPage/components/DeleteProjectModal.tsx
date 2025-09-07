import {Modal} from '@/shared/ui/Modal';
import {Button, Text as GravityText} from '@gravity-ui/uikit';

interface DeleteProjectModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    projectName?: string;
    loading?: boolean;
}

export const DeleteProjectModal = ({
    open,
    onOpenChange,
    onConfirm,
    projectName,
    loading = false,
}: DeleteProjectModalProps) => {
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} title="Удаление проекта">
            <div style={{padding: '24px'}}>
                <GravityText style={{marginBottom: '24px'}}>
                    Вы уверены, что хотите удалить проект "{projectName}"? Это действие нельзя
                    отменить.
                </GravityText>

                <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                    <Button view="outlined" onClick={() => onOpenChange(false)} disabled={loading}>
                        Отмена
                    </Button>
                    <Button view="action" onClick={handleConfirm} loading={loading}>
                        Удалить
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

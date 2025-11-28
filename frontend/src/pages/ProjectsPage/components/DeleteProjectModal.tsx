import {Modal} from '@/shared/ui/Modal';
import {Button, Text as GravityText} from '@gravity-ui/uikit';
import {useTranslation} from '@/shared/lib/i18n/hooks';

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
    const {t} = useTranslation();
    const handleConfirm = () => {
        onConfirm();
        onOpenChange(false);
    };

    return (
        <Modal open={open} onOpenChange={onOpenChange} title={t('projects.delete')}>
            <div style={{padding: '24px'}}>
                <GravityText style={{marginBottom: '24px'}}>
                    {t('projects.deleteConfirm', {name: projectName})}
                </GravityText>

                <div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
                    <Button view="outlined" onClick={() => onOpenChange(false)} disabled={loading}>
                        {t('common.cancel')}
                    </Button>
                    <Button view="action" onClick={handleConfirm} loading={loading}>
                        {t('common.delete')}
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

import {Modal} from '@/shared/ui/Modal';
import {Button, type ModalProps, TextInput} from '@gravity-ui/uikit';
import {useRef} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';

interface CreateProjectModalProps extends ModalProps {
    createProject: (event: React.FormEvent<HTMLFormElement>) => void;
    creatingProject: boolean;
}

export const CreateProjectModal = ({
    createProject,
    creatingProject,
    ...props
}: CreateProjectModalProps) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const formtRef = useRef<HTMLFormElement>(null);

    const focusInput = () => {
        inputRef.current?.focus();
    };

    useHotkeys(
        'enter',
        () => {
            formtRef.current?.submit();
        },
        {},
        {enabled: props.open},
    );

    return (
        <Modal
            {...props}
            onTransitionInComplete={focusInput}
            title="Создать проект"
            disableBodyScrollLock={creatingProject}
            disableOutsideClick={creatingProject}
            disableVisuallyHiddenDismiss={creatingProject}
        >
            <form ref={formtRef} onSubmit={createProject}>
                <div>
                    <TextInput
                        controlRef={inputRef}
                        name={'productName'}
                        type="text"
                        placeholder="Название проекта"
                    />
                </div>
                <div style={{height: 10}}></div>
                <div>
                    <Button loading={creatingProject} view="action" type={'submit'}>
                        {'Создать'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

import {Modal} from '@/shared/ui/Modal';
import {Button, type ModalProps, Select, TextInput} from '@gravity-ui/uikit';
import {useRef, useState} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';
import {useTechnologies} from '@/features/projects/hooks/useTechnologies';

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
    const {technologies, loading: technologiesLoading} = useTechnologies();
    const [selectedTechnologyId, setSelectedTechnologyId] = useState<string>('');

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
                    <Select
                        name="technologyId"
                        placeholder="Выберите технологию"
                        value={[selectedTechnologyId]}
                        onUpdate={(value) => setSelectedTechnologyId(value[0] || '')}
                        options={technologies.map((tech) => ({
                            value: tech.id.toString(),
                            content: tech.name,
                        }))}
                        loading={technologiesLoading}
                        disabled={technologiesLoading}
                    />
                </div>
                <div style={{height: 10}}></div>
                <div>
                    <Button
                        loading={creatingProject}
                        view="action"
                        type={'submit'}
                        disabled={!selectedTechnologyId}
                    >
                        {'Создать'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

import {useNavigate} from 'react-router-dom';
import {PageTitle} from '@/shared/ui/PageTitle';
import {PageContainer} from '@/shared/ui/PageContainer';
import {useProjects} from '@/features/projects/hooks/useProjects';
import {ProjectsTable} from '@/features/projects/ui/ProjectsTable';
import {useCallback, useState} from 'react';
import {useHotkeys} from 'react-hotkeys-hook';
import {CreateProjectModal} from './components/CreateProjectModal';
import {DeleteProjectModal} from './components/DeleteProjectModal';
import {useCreateProject} from '@/features/projects/hooks/useCreateProject';
import {useDeleteProject} from '@/features/projects/hooks/useDeleteProject';

const ProjectsPage = () => {
    const navigate = useNavigate();
    const {projects, loading, error, handleLoadProjects} = useProjects({});
    const [open, setOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<{id: string; name: string} | null>(null);

    const toggleModal = useCallback(() => {
        setOpen((prevStatus) => !prevStatus);
    }, []);

    const onProjectCreate = useCallback(() => {
        handleLoadProjects();
        toggleModal();
    }, [handleLoadProjects, toggleModal]);

    const {createProject, loading: createingProject} = useCreateProject(onProjectCreate);
    const {deleteProject, loading: deletingProject} = useDeleteProject({
        onProjectDelete: () => {
            handleLoadProjects();
            setDeleteModalOpen(false);
            setProjectToDelete(null);
        },
    });

    const handleDeleteClick = useCallback(
        (id: string) => {
            const project = projects.find((p) => p.id === id);
            if (project) {
                setProjectToDelete({id: project.id, name: project.name});
                setDeleteModalOpen(true);
            }
        },
        [projects],
    );

    const handleConfirmDelete = useCallback(() => {
        if (projectToDelete) {
            deleteProject(projectToDelete.id);
        }
    }, [deleteProject, projectToDelete]);

    const _createProject = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        const name = formData.get('productName') as string;
        createProject({name});
    };

    useHotkeys('a', toggleModal);

    return (
        <PageContainer>
            <PageTitle title={'Проекты'} addHandle={toggleModal} />

            <ProjectsTable
                projects={projects}
                loading={loading}
                error={error}
                navigate={navigate}
                onRetry={handleLoadProjects}
                onDelete={handleDeleteClick}
            />

            <CreateProjectModal
                open={open}
                onOpenChange={toggleModal}
                createProject={_createProject}
                creatingProject={createingProject}
            />

            <DeleteProjectModal
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                onConfirm={handleConfirmDelete}
                projectName={projectToDelete?.name}
                loading={deletingProject}
            />
        </PageContainer>
    );
};

export default ProjectsPage;

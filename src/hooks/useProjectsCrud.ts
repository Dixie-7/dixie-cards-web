import { useCallback, useEffect, useState } from 'react';
import { projectsApi } from '@/services/projectsApi';
import type { ProjectDto, ProjectPayload } from '@/types/projects';

function sortProjects(projects: ProjectDto[]) {
  return [...projects].sort(
    (currentProject, nextProject) =>
      currentProject.sortOrder - nextProject.sortOrder,
  );
}

export function useProjectsCrud(token?: string | null) {
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setProjects(await projectsApi.listProjects(token));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'Unexpected projects loading error',
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadProjects();
  }, [loadProjects]);

  const createProject = useCallback(
    async (payload: ProjectPayload) => {
      const createdProject = await projectsApi.createProject(payload, token);

      setProjects((currentProjects) =>
        sortProjects([...currentProjects, createdProject]),
      );

      return createdProject;
    },
    [token],
  );

  const updateProject = useCallback(
    async (projectId: number, payload: ProjectPayload) => {
      const updatedProject = await projectsApi.updateProject(
        projectId,
        payload,
        token,
      );

      setProjects((currentProjects) =>
        sortProjects(
          currentProjects.map((project) =>
            project.id === projectId ? updatedProject : project,
          ),
        ),
      );

      return updatedProject;
    },
    [token],
  );

  const deleteProject = useCallback(
    async (projectId: number) => {
      await projectsApi.deleteProject(projectId, token);

      setProjects((currentProjects) =>
        currentProjects.filter((project) => project.id !== projectId),
      );
    },
    [token],
  );

  return {
    projects,
    isLoading,
    error,
    reload: loadProjects,
    createProject,
    updateProject,
    deleteProject,
  };
}

import { useCallback, useEffect, useState } from 'react';
import { skillApi } from '@/features/skills/api/skillApi';
import type { SkillDto, SkillPayload } from '@/features/skills/types/skill.types';

function sortSkills(skills: SkillDto[]) {
  return [...skills].sort(
    (currentSkill, nextSkill) => currentSkill.sortOrder - nextSkill.sortOrder,
  );
}

export function useSkills(token?: string | null, currentUserId = 7) {
  const [skills, setSkills] = useState<SkillDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadSkills = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setSkills(await skillApi.listSkills(token));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'Unexpected skills loading error',
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadSkills();
  }, [loadSkills]);

  const createSkill = useCallback(
    async (payload: SkillPayload) => {
      const createdSkill = await skillApi.createSkill(
        payload,
        token,
        currentUserId,
      );

      setSkills((currentSkills) => sortSkills([...currentSkills, createdSkill]));

      return createdSkill;
    },
    [currentUserId, token],
  );

  const updateSkill = useCallback(
    async (skillId: number, payload: SkillPayload) => {
      const updatedSkill = await skillApi.updateSkill(
        skillId,
        payload,
        token,
        currentUserId,
      );

      setSkills((currentSkills) =>
        sortSkills(
          currentSkills.map((skill) =>
            skill.id === skillId ? updatedSkill : skill,
          ),
        ),
      );

      return updatedSkill;
    },
    [currentUserId, token],
  );

  const deleteSkill = useCallback(
    async (skillId: number) => {
      await skillApi.deleteSkill(skillId, token);

      setSkills((currentSkills) =>
        currentSkills.filter((skill) => skill.id !== skillId),
      );
    },
    [token],
  );

  return {
    skills,
    isLoading,
    error,
    reload: loadSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  };
}

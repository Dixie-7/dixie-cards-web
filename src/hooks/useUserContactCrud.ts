import { useCallback, useEffect, useState } from 'react';
import { userContactApi } from '@/services/userContactApi';
import type { UserContactDto, UserContactPayload } from '@/types/userContact';

export function useUserContactCrud(token?: string | null, currentUserId = 7) {
  const [contact, setContact] = useState<UserContactDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContact = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setContact(await userContactApi.getUserContact(token));
    } catch (unknownError) {
      setError(
        unknownError instanceof Error
          ? unknownError.message
          : 'Unexpected contact loading error',
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    void loadContact();
  }, [loadContact]);

  const createContact = useCallback(
    async (payload: UserContactPayload) => {
      const createdContact = await userContactApi.createUserContact(
        payload,
        token,
        currentUserId,
      );

      setContact(createdContact);

      return createdContact;
    },
    [currentUserId, token],
  );

  const updateContact = useCallback(
    async (contactId: number, payload: UserContactPayload) => {
      const updatedContact = await userContactApi.updateUserContact(
        contactId,
        payload,
        token,
        currentUserId,
      );

      setContact(updatedContact);

      return updatedContact;
    },
    [currentUserId, token],
  );

  const deleteContact = useCallback(
    async (contactId: number) => {
      await userContactApi.deleteUserContact(contactId, token);

      setContact(null);
    },
    [token],
  );

  return {
    contact,
    isLoading,
    error,
    reload: loadContact,
    createContact,
    updateContact,
    deleteContact,
  };
}

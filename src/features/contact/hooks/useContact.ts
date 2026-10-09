import { useCallback, useEffect, useState } from 'react';
import { contactApi } from '@/features/contact/api/contactApi';
import type { UserContactDto, UserContactPayload } from '@/features/contact/types/contact.types';

export function useContact(token?: string | null, currentUserId = 7) {
  const [contact, setContact] = useState<UserContactDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadContact = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      setContact(await contactApi.getUserContact(token));
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
      const createdContact = await contactApi.createUserContact(
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
      const updatedContact = await contactApi.updateUserContact(
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
      await contactApi.deleteUserContact(contactId, token);

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

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';

export const useConnection = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendRequest = async (receiverId: string, token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/connections/request`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ receiverId }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw result;
      }

      return result.data;
    } catch (error: any) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRequest, isLoading };
};
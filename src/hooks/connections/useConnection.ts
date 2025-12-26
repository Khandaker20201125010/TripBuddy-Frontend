/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { toast } from 'sonner';

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
        // We throw the result so the component catch block gets the message and status
        throw result; 
      }

      return result.data;
    } catch (error: any) {
      // Re-throw so TravelerCard can see if it's a 403 Forbidden
      throw error; 
    } finally {
      setIsLoading(false);
    }
  };

  return { sendRequest, isLoading };
};
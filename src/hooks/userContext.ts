import { createContext } from 'react';

interface UserContextType {
  message: string;
  setMessage: (message: string) => void;
}

export const UserContext = createContext<UserContextType>({
  message: '',
  setMessage: () => {},
});

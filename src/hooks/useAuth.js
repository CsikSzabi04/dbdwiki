import { useContext } from 'react';
import { AuthContext } from '../context/AuthContextInstance';

export const useAuth = () => useContext(AuthContext);
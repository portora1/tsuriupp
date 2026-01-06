import { createContext} from 'react';

import type { Session, User } from '@supabase/supabase-js';

// Contextが持つデータの型を定義
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { createContext, useState, useEffect, useContext } from 'react';
import type { ReactNode } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { Session, User } from '@supabase/supabase-js';

// Contextが持つデータの型を定義
type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Contextを提供するためのプロバイダーコンポーネント
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // const updateSession = useCallback((session: Session | null) => {
  //   setSession(session);
  //   setUser(session?.user ?? null);
  // }, []);

  // セッション情報の取得
  useEffect(() => {
    // getSesstionが成功したときにthenに入ってdetaという名前のオブジェクトを返してる
    // dataの中にあるsessionの中身を直接抜き出している
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      console.log(session)
      setUser(session?.user ?? null);
      setLoading(false);
    });


    // Supabaseの認証状態の変化を監視
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // クリーンアップ関数
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
  };

  // ローディング中は何も表示させず画面がちらつかないようにする
  return <AuthContext.Provider value={value}>
    {!loading && children}</AuthContext.Provider>;
};

// Contextを簡単に使うためのカスタムフック
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
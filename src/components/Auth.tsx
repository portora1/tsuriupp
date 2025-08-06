// src/components/Auth.tsx
import { supabase,} from '../lib/supabaseClient'; //クライアントをインポートしている
import React, { useState } from 'react';

export const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //ログイン処理
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true);
            // Supabaseのパスワード関数を呼び出す
            const { error } = await supabase.auth.signInWithPassword({ email, password });
            if (error) throw error;
            alert('ログインしました！');
        } catch (error: any) {
            alert(error.error_description || error.message);
        } finally {
            setLoading(false);
        }
    };

    //新規登録の処理
    const handleSingUp = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            setLoading(true)
            //　サインアップ関数を呼び出す
            const { error } = await supabase.auth.signUp({ email, password });
            if (error) throw error;
            alert('確認メールを送信しました！メールを確認して、リンクをクリックしてください。');
        } catch (error: any) {
            alert(error.error_description || error.messege);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>釣りアップっぷ ログイン</h2>
            <p>メールアドレスとパスワードでログインまたは新規登録してください。</p>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">メールアドレス</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div>
                <label htmlFor="password">パスワード</label>
                <input
                  id="password"
                  type="password"
                  placeholder="........"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div>
                    <button type="submit" disabled={loading}>
                        {loading ? <span>処理中...</span> : <span>ログイン</span>}
                    </button>
                    <button type="button" onClick={handleSingUp} disabled={loading}>
                        {loading ? <span>処理中...</span> : <span>新規登録</span>}
                    </button>
                </div>
            </form>
        </div>
    );
};
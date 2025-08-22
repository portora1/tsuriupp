import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient'; 

export const Auth = () => {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            setLoading(true);
            if (isLoginMode) {
                const { error}  = await supabase.auth.signInWithPassword({ email, password });
                if(error) throw error;
            } else {
                if(!username) {
                alert('ユーザー名を入力して下さい。');
                setLoading(false);
                return;
            }
            const { error } = await supabase.auth.signUp({
                email,
                password,
                options: { data: { username: username } },
            });
            if (error) throw error;
            alert('確認メールを送信しました！');
        }
    } catch (error: any) {
        alert(error.message || 'エラーが発生しました。');
    } finally {
        setLoading(false);
    }
};

    return (
        <div>
            <h2>{isLoginMode ? '釣りアップっぷ ログイン' : '新規登録'}</h2>
            <form onSubmit={handleAuth}>
                {!isLoginMode && (
                    <div>
                        <label htmlFor="username">ユーザー名</label>
                        <input
                        id="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    </div>
                )}
                <div>
                    <label htmlFor="email">メールアドレス</label>
                    <input
                    id="email"
                    type="email"                        
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
               />
                </div>
                <div>
                    <label htmlFor="password">パスワード</label>
                    <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? '処理中...' : (isLoginMode ? 'ログイン' : '新規登録')}
                </button>
            </form>

            <hr />
            <div>
                <p>
                  {isLoginMode ? 'アカウントをお持ちでないですか？' : 'すでにアカウントをお持ちですか？'}
                </p>
                <button
                    type="button"
                    onClick={() => setIsLoginMode(!isLoginMode)}
                >
                    {isLoginMode ? '新規登録' : 'ログイン'}
                </button>
            </div>
        </div>
    );
};


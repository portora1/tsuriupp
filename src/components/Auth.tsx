import { supabase,} from '../lib/supabaseClient'; //クライアントをインポートしている
import { useState } from 'react';

export const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //ログイン・サインアップ機能を１つの関数にまとめる
    const handleAuth = async (isLogin: boolean) => {
        try {
            setLoading(true);
            // Supabaseのパスワード関数を呼び出す
            let error;
            if (isLogin) {
                //ログイン処理の部分
                ({ error } = await supabase.auth.signInWithPassword({email, password }));
            } else {
                //サインアップ処理の部分
                ({ error } = await supabase.auth.signUp({ email, password }));
            }
            
            if (error) throw error;
            if (isLogin) {
                alert('ログインしました！')
            } else {
                alert('確認メールを送信しました！メールを確認して、リンクをクリックしてください。');
            }
            } catch (error: any) {
                alert(error.message || 'エラーが発生しました。');
            } finally {
                setLoading(false);
            }
        }


    return (
        <div>
            <h2>釣りアップっぷ ログイン</h2>
            <p>メールアドレスとパスワードでログインまたは新規登録してください。</p>
            <form onSubmit={(e) => e.preventDefault()}>
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
                    {/*ログインボタン*/}
                    <button onClick={() => handleAuth(true)} disabled={loading}>
                        {loading ? <span>処理中...</span> : <span>ログイン</span>}
                    </button>
                    {/*新規登録ボタン*/}
                    <button onClick= {() =>handleAuth(false)} disabled={loading}>
                        {loading ? <span>処理中...</span> : <span>新規登録</span>}
                    </button>
                </div>
            </form>
        </div>
    );
};
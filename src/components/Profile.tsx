import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient"
import { useAuth } from "../contexts/AuthContext";

export const Profile = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const [username, setUsername] = useState(user?.user_metadata.username || '');

    useEffect(() => {
        if(user) {
            setUsername(user.user_metadata.username || '');
        }
    }, [user]);
    const handleProfileUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user){
            alert('ユーザー情報が見つかりません。');
            return;
        }
        try {
            setLoading(true);
            const { error } = await supabase.auth.updateUser
        ({data: {username: username },
        });

        if(error) throw error;
        alert('プロフィールを更新しました！');
        } catch (error: any) {
        alert(error.message ||'更新に失敗しました');
        } finally {
            setLoading(false);
        } 
    };

    return (
        <div>
            <h2>プロフィール編集</h2>
            <form onSubmit={handleProfileUpdate}>
                <div>
                    <label htmlFor="username">ユーザー名</label>
                    <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                </div>
                <div>
                    <label>メールアドレス</label>
                    <p>{user?.email}</p>
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? '更新中...' : '更新する'}
                </button>
            </form>
        </div>
    );
};


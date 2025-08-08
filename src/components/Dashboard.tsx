import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { useFishingLogs } from "../hooks/useFishingLogs";

export const Dashboard = () => {
    const { user } = useAuth();
    
    const { logs, loading, error, addLog } = useFishingLogs(user);

    const [fishName, setFishName] = useState('');
    const [fishSize, setFishSize] = useState('');
    const [location, setLocation] = useState('');
    const [comment, setComment] = useState('');

    const handleLogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user || !fishName || !location) {
            alert('魚の名前と場所は必須です。');
            return;
        }
        try {
            const {data, error: insertError } = await supabase
            .from('fishing_logs')
            .insert({
                fish_name: fishName,
                fish_size: fishSize ? Number(fishSize) : null,
                location: location,
                comment: comment,
                user_id: user.id,
                fished_at: new Date().toISOString(),
            })
            .select()
            .single();
        
        if (insertError) throw insertError;

        addLog(data);

        setFishName('')
        setFishSize('');
        setLocation('');
        setComment('');
        } catch(err) {
            console.error('Error inserting log:', err);
            alert('投稿に失敗しました。');
        }
    };

    if (loading) return <div>釣果を読み込み中...</div>;
    if (error) return <div>エラー： {error}</div>;

    return (
        <div>
            <h1>釣りアップっぷ</h1>
            <form onSubmit={handleLogSubmit}>
                <h3>新しい釣果を記録</h3>
                <div>
                    <label>魚の名前</label>
                    <input 
                    type="text" 
                    value={fishName} 
                    onChange={e => setFishName(e.target.value)} required 
                    />
                </div>
                <div>
                    <label>場所</label>
                    <input
                    type="text"
                    value={location}
                    onChange={e => setLocation(e.target.value)} required
                    />
                </div>
                <div>
                    <label>サイズ(cm)</label>
                    <input
                    type="number"
                    value={fishSize}
                    onChange={e => setFishSize(e.target.value)}
                    />
                    <div>
                        <label>コメント：</label>
                        <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}></textarea>
                    </div>
                </div>
                <button type="submit">投稿する</button>
            </form>

            <hr />

            <h3>あなたの釣果一覧</h3>
            {logs.length > 0 ? (
                <ul>
                    {logs.map(log => (
                        <li key={log.id}>
                            <strong>{log.fish_name}</strong>
                            - {log.location}{log.fish_size && ` (${log.fish_size} cm)`}
                          <p>{log.comment}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>まだ投稿がありません</p>
            )}
        </div>
    );
};
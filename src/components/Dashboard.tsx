import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import type { FishingLog } from "../App";

export const Dashboard = () => {
    const { user } = useAuth();
    const [logs, setLogs] = useState<FishingLog[]>([]);
    const [loading, setLoading] = useState(true);

    const [fishName, setFishName] = useState('');
    const [fishSize, setFishSize] = useState('');
    const [location, setLocation] = useState('');

    useEffect(() => {
        const fetchLogs = async () => {
            if(!user) return;
            try {
                setLoading(true);
                const { data, error} = await supabase
                .from('fishing_logs')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            if(error) throw error;
            if(data) setLogs(data);
            } catch(error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };
    
        fetchLogs();
    },[user]);

    const handleLogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user || !fishName || !location) {
            alert('魚の名前と場所は必須です。');
            return;
        }
        try {
            const { data, error } = await supabase
              .from('fishing_logs')
              .insert({
                fish_name: fishName,
                fish_size: fishSize ? Number(fishSize) : null,
                location: location,
                user_id: user.id,
              })
              .select();
            if(error) throw error;
            if(data) {
                setLogs([data[0], ...logs]);
            }
            setFishName('');
            setFishSize('');
            setLocation('');
        } catch (error) {
            console.error('Error inserting log:', error);
            alert('投稿に失敗しました。');
        }
    };
    if (loading) {
        return <div>釣果を読み込み中...</div>;
    }
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
                        </li>
                    ))}
                </ul>
            ) : (
                <p>まだ投稿がありません</p>
            )}
        </div>
    );
};
import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "../contexts/AuthContext";
import { useFishingLogs } from "../hooks/useFishingLogs";
import type { FishingLog } from "../App";
import { useStorage } from "../hooks/useStorage";

export const Dashboard = () => {
    const { user } = useAuth();
    
    const { logs, loading, error, addLog, removeLog, updateLog } = useFishingLogs(user);
    const { isUploading, uploadImage, deleteImage } = useStorage('fishing-images');

    //投稿フォーム用
    const [fishName, setFishName] = useState('');
    const [fishSize, setFishSize] = useState('');
    const [location, setLocation] = useState('');
    const [comment, setComment] = useState('');
    const [fishweight, setFishWeitht ] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);

    //編集フォーム用
    const [editingLogId, setEditingLogId] = useState<number | null>(null);
    const [editingFishName, setEditingFishName] = useState('');
    const [editingFishSize, setEditingFishSize] = useState('');
    const [editingLocation, setEditingLocation] = useState<string | null>('');
    const [editingComment, setEditingComment] = useState<string | null>('');
    const [editingFishWeight, setEdeitingFishtWeight] = useState('');
    const [editingImageFile, setEditingImageFile] = useState<File | null>(null);



    const handleLogSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if(!user || !fishName) {
            alert('魚の名前は必須です。');
            return;
        }
        try {
            let imageUrl: string | null = null;

            if (imageFile) {
                imageUrl = await uploadImage(imageFile);
            }
            const {data, error: insertError } = await supabase
            .from('fishing_logs')
            .insert({
                fish_name: fishName,
                fish_size: fishSize ? Number(fishSize) : null,
                fish_weight: fishweight ? Number(fishweight) : null,
                location: location,
                comment: comment,
                user_id: user.id,
                fished_at: new Date().toISOString(),
                image_url: imageUrl,
            })
            .select()
            .single();
        
        if (insertError) throw insertError;

        addLog(data);

        setFishName('')
        setFishSize('');
        setFishWeitht('');
        setLocation('');
        setComment('');
        setFishWeitht('');
        setImageFile(null);
        } catch(err: any) {
            console.error('Error inserting log:', err);
            alert(err.message || '投稿に失敗しました。');
        }
    };

    const handleDelete = async (logToDelete: FishingLog) => {
        if (window.confirm('この釣果記録を本当に削除しますか？')) {
            try {
                if(logToDelete.image_url) {
                    await deleteImage(logToDelete.image_url)
                }
                const { error } = await supabase
                .from('fishing_logs')
                .delete()
                .eq('id', logToDelete.id);
                if(error) throw error;
                removeLog(logToDelete.id);
            } catch (err) {
                console.error('Error deleting log:', err);
                alert('削除に失敗しました。');
            }
        }
    };

    const handleEditStart = (log: FishingLog) => {
        setEditingLogId(log.id);
        setEditingFishName(log.fish_name);
        setEditingFishSize(String(log.fish_size || ''));
        setEditingLocation(log.location);
        setEditingComment(log.comment)
        setEdeitingFishtWeight(String(log.fish_weight || ''));
        setEditingImageFile(null);
    };

    const handleEditCancel = () => {
        setEditingLogId(null);
    };

    const handleEditSave = async (logToUpdate: FishingLog) => {
        try {
            let updatedImageUrl = logToUpdate.image_url;
            if (editingImageFile) {
                if (logToUpdate.image_url) {
                    await deleteImage(logToUpdate.image_url);
                }
                updatedImageUrl = await uploadImage(editingImageFile);
            }
            const { data, error } = await supabase
                .from('fishing_logs')
                .update({
                    fish_name: editingFishName,
                    fish_size: editingFishSize ? Number(editingFishSize) : null,
                    fish_weight: editingFishWeight ? Number(editingFishWeight) : null,
                    location: editingLocation,
                    comment: editingComment,
                    image_url: updatedImageUrl,
                })
                .eq('id', logToUpdate.id)
                .select()
                .single();
            if (error) throw error;

            updateLog(data);
            setEditingLogId(null);
        } catch (err) {
            console.error('Error updating log', err);
            alert('更新に失敗しました。');
        }
    };

    if (loading) return <div>釣果を読み込み中...</div>;
    if (error) return <div>エラー： {error}</div>;

    return (
        <div>
            <h1>釣りアップっぷ</h1>
            {/*投稿フォーム*/}
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
                        onChange={e => setLocation(e.target.value)}
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
                    <div>
                        <label>重さ (kg)</label>
                        <input
                        type="number"
                        value={fishweight}
                        onChange={e => setFishWeitht(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>コメント：</label>
                        <textarea
                        value={comment}
                        onChange={e => setComment(e.target.value)}></textarea>
                    </div>
                    <div>
                        <label htmlFor="image-upload">写真</label>
                        <input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={(e) =>{
                                if(e.target.files && e.target.files[0]) {
                                    setImageFile(e.target.files[0]);
                                }
                            }}
                        />
                    </div>
                    <button type="submit" disabled={isUploading}>{isUploading ? '投稿中...' : '投稿する'}</button>
                </form>

            <hr />

            <h3>あなたの釣果一覧</h3>
            {logs.length > 0 ? (
                <ul>
                    {logs.map(log => (
                        <li key={log.id}>
                            {editingLogId === log.id ? (
                            // 編集フォーム
                            <div className="edit-form">
                                <div>
                                    <label htmlFor={`edit-fish-name-${log.id}`}>名前</label>
                                    <input
                                    id={`edit-fish-name-${log.id}`}
                                    type="text"
                                    value={editingFishName}
                                    onChange={e => setEditingFishName(e.target.value)} 
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`edit-location-${log.id}`}>場所</label>
                                    <input
                                    id={`edit-location-${log.id}`}
                                    type="text"
                                    value={editingLocation || ''}
                                    placeholder="例： 〇〇漁港"
                                    onChange={e => setEditingLocation(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`edit-fish-size-${log.id}`}>サイズ</label>
                                    <input
                                    id={`edit-fish-weight-${log.id}`}
                                    type="number"
                                    value={editingFishSize}
                                    placeholder="cm"
                                    onChange={e => setEditingFishSize(e.target.value)}
                                />
                                </div>
                                <div>
                                    <label htmlFor={`edit-fish-weight-${log.id}`}>重さ</label>
                                    <input
                                    id={`edit-fish-weight-${log.id}`}
                                    type="number"
                                    value={editingFishWeight}
                                    placeholder="kg"
                                    onChange={e => setEdeitingFishtWeight(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label htmlFor={`edit-comment-${log.id}`}>コメント</label>
                                    <textarea
                                    id={`edit-comment-${log.id}`}
                                    value={editingComment || ''}
                                    placeholder="例：人生最大サイズ！"
                                    onChange={e => setEditingComment(e.target.value)}
                                    ></textarea>
                                </div>
                                <div> 
                                    <label>写真</label>
                                    {log.image_url && !editingImageFile && <img src={log.image_url} alt="現在の写真" className="log-image" />}
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => {
                                           if (e.target.files && e.target.files[0]) {
                                            setEditingImageFile(e.target.files[0]);
                                            }
                                        }}
                                   />
                                </div>
                                <button onClick={() => handleEditSave(log)}>保存</button>
                                <button onClick={handleEditCancel}>キャンセル</button>
                            </div>
                            ) : (
                            <div>
                                {log.image_url && <img src={log.image_url} alt={log.fish_name} className="log-image" />}
                                <strong>{log.fish_name}</strong>
                                {log.location&& <span> - {log.location}</span>}
                                <div>
                                    {log.fish_size && <span>サイズ: ({log.fish_size} cm)</span>}
                                    {log.fish_weight && <span>/ 重さ: {log.fish_weight} kg</span>}
                                </div>
                            {log.comment && <p>{log.comment}</p>}
                            <button onClick={() => handleEditStart(log)}>編集</button>
                            <button onClick={() => handleDelete(log)}>削除</button>
                            </div>
                          )}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>まだ投稿がありません</p>
            )}
        </div>
    );
};
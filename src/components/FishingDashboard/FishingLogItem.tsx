import { useState } from "react";
import type { FishingLog } from "../../App";
import { FishingLogEditForm } from "./FishingLogEditForm"
import { useAuth  } from "../../contexts/AuthContext";

type FishingLogItemProps = {
    log: FishingLog;
    onDelete: (log: FishingLog) => void;
    onUpdate: (log: FishingLog, updateData: any) => void;
};

export const FishingLogItem = ({ log, onDelete, onUpdate }:FishingLogItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const { user } = useAuth();

    const handleSave = (updatedData: any) => {
        onUpdate(log, updatedData);
        setIsEditing(false);
    };

    const isOwnPost = user && user.id === log.user_id;

    return (
        <li key={log.id}>
            {isEditing ? (
                <FishingLogEditForm log={log} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            ) : (
                <div>
                    {log.image_url && <img src={log.image_url} alt={log.fish_name} className="log-image" />}
                    <strong>{log.fish_name}</strong>
                    {log.location && <span> - {log.location}</span>}
                        <div>
                        {log.fish_size && <span>サイズ: ({log.fish_size} cm)</span>}
                        {log.fish_weight && <span>/ 重さ: {log.fish_weight} kg</span>}
                    </div>
                    {log.comment && <p>{log.comment}</p>}
                    {isOwnPost && (
                    <div>                    
                        <button onClick= {() => setIsEditing(true)}>編集</button>
                        <button onClick= {() => {
                            if (window.confirm('この釣果記録を本当に削除しますか？')) {
                                onDelete(log);
                            }
                        }}>削除</button>
                    </div>
                    )}
                </div>
            )}
        </li>
    );
};


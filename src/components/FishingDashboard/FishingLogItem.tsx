import { useState } from "react";
import type { FishingLogFormData, FishingLogWithProfile } from "../../types";
import { FishingLogEditForm } from "./FishingLogEditForm"
import { useAuth } from "../../hooks/useAuth";

type FishingLogItemProps = {
    log: FishingLogWithProfile;
    onDelete: (log: FishingLogWithProfile) => void;
    onUpdate: (log: FishingLogWithProfile, updateData: FishingLogFormData) => void;
};

export const FishingLogItem = ({ log, onDelete, onUpdate }: FishingLogItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const { user } = useAuth();

    const handleSave = (updatedData: FishingLogFormData) => {
        onUpdate(log, updatedData);
        setIsEditing(false);
    };

    const isOwnPost = user && user.id === log.profile_id;

    return (
        <li key={log.id} className="post-card-container">
            {isEditing ? (
                <FishingLogEditForm log={log} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            ) : (
                <>
                    <div className="post-card">
                        <div className="card-username-header">
                            {log.profiles && (
                                <span className="log-username">{log.profiles.username}</span>
                            )}
                        </div>
                        {/* 画像部分 */}
                        {log.image_url && (
                            <div className="card-image-wrapper" onClick={() => setIsModalOpen(true)}>
                                <img src={log.image_url} alt={log.fish_name} className="log-image" />
                            </div>
                        )}
                        {/* テキスト部分 */}
                        <div className="post-content">
                            <div className="post-main-info">
                                <strong className="fish-name">{log.fish_name}</strong>
                                {log.location && <span className="location-tag"> @ {log.location}</span>}
                            </div>
                            <div className="spec-info">
                                {log.fish_size && <span>サイズ: ({log.fish_size} cm)</span>}
                                {log.fish_weight && <span>/ 重さ: {log.fish_weight} g</span>}
                            </div>
                            {log.comment && <p className="content-text">{log.comment}</p>}
                            {/* 自分の投稿だけ編集と削除 */}
                            {isOwnPost && (
                                <div className="log-actions">
                                    <button onClick={() => setIsEditing(true)}>編集</button>
                                    <button onClick={() => {
                                        if (window.confirm('この釣果記録を本当に削除しますか？')) {
                                            // console.log(`[Item] onDelete CALLED with log ID: ${log.id}`);
                                            onDelete(log);
                                        }
                                    }}>削除</button>
                                </div>
                            )}
                        </div>

                    </div>
                    {isModalOpen && log.image_url && (
                        <div className="modal-overlay">
                            <div className="modal-close-layer" onClick={() => setIsModalOpen(false)} />
                            <div className="modal-inner">
                                <img src={log.image_url} alt={log.fish_name} className="modal-image" />
                                <div className="modal-close-hint">タップで閉じる</div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </li>
    );
};


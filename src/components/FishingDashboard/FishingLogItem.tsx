import { useState } from "react";
import type { FishingLogFormData, FishingLogWithProfile } from "../../types";
import { FishingLogEditForm } from "./FishingLogEditForm"
import { useAuth } from "../../hooks/useAuth";
import { Dialog } from "../UI/Dialog";
type FishingLogItemProps = {
    log: FishingLogWithProfile;
    onDelete: (log: FishingLogWithProfile) => void;
    onUpdate: (log: FishingLogWithProfile, updateData: FishingLogFormData) => void;
};

export const FishingLogItem = ({ log, onDelete, onUpdate }: FishingLogItemProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const { user } = useAuth();

    const handleSave = (updatedData: FishingLogFormData) => {
        onUpdate(log, updatedData);
        setIsEditing(false);
    };

    const isOwnPost = user && user.id === log.profile_id;

    return (
        <li key={log.id} className="post-card">
            {isEditing ? (
                <FishingLogEditForm log={log} onSave={handleSave} onCancel={() => setIsEditing(false)} />
            ) : (
                <>
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
                                <button onClick={() => { setIsDeleteDialogOpen(true) }}>削除</button>
                            </div>
                        )}
                    </div>
                </>
            )
            }
            <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <img src={log.image_url!} alt={log.fish_name} style={{ width: "100%", borderRadius: "8px" }} />
            </Dialog>

            <Dialog
                isOpen={isDeleteDialogOpen}
                onClose={() => setIsDeleteDialogOpen(false)}
                title="投稿の削除"
            >
                <p>「{log.fish_name}」を削除しますか？</p>
                <div className="log-actions" style={{ justifyContent: "center", marginTop: "20px" }}>
                    <button className="delete-btn"
                        onClick={() => {
                            onDelete(log); setIsDeleteDialogOpen(false)
                        }}>削除する</button>
                    <button onClick={() => setIsDeleteDialogOpen(false)}>キャンセル</button>
                </div>
            </Dialog>
        </li >
    );
};


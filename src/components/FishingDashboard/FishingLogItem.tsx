import { useState } from "react";
import type { FishingLogFormData, FishingLogWithProfile } from "../../types";
import { FishingLogEditForm } from "./FishingLogEditForm";
import { useAuth } from "../../hooks/useAuth";
import { Dialog } from "../UI/Dialog";
import { ReactionArea } from "../UI/ReactionArea/ReactionArea";
import styles from "./FishingLogItem.module.scss";

type FishingLogItemProps = {
  log: FishingLogWithProfile;
  onDelete: (log: FishingLogWithProfile) => void;
  onUpdate: (
    log: FishingLogWithProfile,
    updateData: FishingLogFormData
  ) => void;
};

export const FishingLogItem = ({
  log,
  onDelete,
  onUpdate,
}: FishingLogItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { user } = useAuth();

  const handleSave = (updatedData: FishingLogFormData) => {
    onUpdate(log, updatedData);
    setIsEditing(false);
  };

  const isOwnPost = user && user.id === log.profile_id;

  return (
    <li key={log.id} className={styles.postCard}>
      {isEditing ? (
        <FishingLogEditForm
          log={log}
          onSave={handleSave}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <>
          <div className={styles.usernameHeader}>
            {log.profiles && (
              <span className={styles.username}>{log.profiles.username}</span>
            )}
          </div>
          {/* 画像部分 */}
          {log.image_url && (
            <div
              className={styles.imageWrapper}
              onClick={() => setIsModalOpen(true)}
            >
              <img src={log.image_url} alt={log.fish_name} />
            </div>
          )}
          {/* テキスト部分 */}
          <div className={styles.postContent}>
            <div className={styles.postmainInfo}>
              <strong className={styles.fishName}>{log.fish_name}</strong>
              {log.location && (
                <span className={styles.locationTag}> @ {log.location}</span>
              )}
            </div>
            <div className={styles.specInfo}>
              {log.fish_size && <span>サイズ: ({log.fish_size} cm)</span>}
              {log.fish_weight && <span>/ 重さ: {log.fish_weight} g</span>}
            </div>
            {log.comment && <p className={styles.contentText}>{log.comment}</p>}
            {/* 自分の投稿だけ編集と削除 */}
            {isOwnPost && (
              <div className={styles.logActions}>
                <button onClick={() => setIsEditing(true)}>編集</button>
                <button
                  onClick={() => {
                    setIsDeleteDialogOpen(true);
                  }}
                >
                  削除
                </button>
              </div>
            )}
          </div>
          <div className={styles.reactionWrapper}>
            <ReactionArea targetId={log.id} />
          </div>
        </>
      )}
      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <img
            src={log.image_url!}
            alt={log.fish_name}
            style={{
              maxWidth: "100%",
              maxHeight: "90vh",
              objectFit: "contain",
              borderRadius: "4px",
            }}
          />
        </div>
      </Dialog>

      <Dialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        title="投稿の削除"
      >
        <p>「{log.fish_name}」を削除しますか？</p>
        <div
          className={styles.logActions}
          style={{
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button
            className="delete-btn"
            onClick={() => {
              onDelete(log);
              setIsDeleteDialogOpen(false);
            }}
          >
            削除する
          </button>
          <button onClick={() => setIsDeleteDialogOpen(false)}>
            キャンセル
          </button>
        </div>
      </Dialog>
    </li>
  );
};

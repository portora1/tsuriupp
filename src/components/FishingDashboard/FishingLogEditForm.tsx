import { useState } from "react";
import styles from "./FishingLogEditForm.module.scss";
import type { FishingLog, FishingLogFormData } from "../../types";

type FishingLogEditFormProps = {
  log: FishingLog;
  onSave: (updateData: FishingLogFormData) => void;
  onCancel: () => void;
};

export const FishingLogEditForm = ({
  log,
  onSave,
  onCancel,
}: FishingLogEditFormProps) => {
  const [fishName, setFishName] = useState(log.fish_name);
  const [location, setLocation] = useState(log.location);
  const [fishSize, setFishSize] = useState(String(log.fish_size || ""));
  const [fishWeight, setFishWeight] = useState(String(log.fish_weight || ""));
  const [comment, setComment] = useState(log.comment);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ fishName, location, fishSize, fishWeight, comment, imageFile });
  };

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <div className={styles.formRow}>
        <input
          type="text"
          value={fishName}
          onChange={(e) => setFishName(e.target.value)}
          placeholder="マダイ"
          required
        />
      </div>
      <div className={styles.formRow}>
        <input
          type="text"
          value={location || ""}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="例：〇〇漁港"
          required
        />
      </div>
      <div className={styles.formRow}>
        <input
          type="number"
          value={fishSize}
          onChange={(e) => setFishSize(e.target.value)}
          placeholder="cm"
        />
      </div>
      <div className={styles.formRow}>
        <input
          type="number"
          value={fishWeight}
          onChange={(e) => setFishWeight(e.target.value)}
          placeholder="g"
        />
      </div>
      <div className={styles.formRow}>
        <textarea
          value={comment || ""}
          onChange={(e) => setComment(e.target.value)}
          placeholder="例：人生最大サイズ！"
        ></textarea>
      </div>
      <div className={styles.formRow}>
        <label>写真</label>
        <div className={styles.imageContainer}>
          {log.image_url && !imageFile && (
            <img
              src={log.image_url}
              alt="現在の写真"
              className={styles.previewImege}
            />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setImageFile(e.target.files[0]);
              }
            }}
          />
        </div>
      </div>
      <div className={styles.editFormActions}>
        <button type="submit">保存</button>
        <button type="button" onClick={onCancel}>
          キャンセル
        </button>
      </div>
    </form>
  );
};

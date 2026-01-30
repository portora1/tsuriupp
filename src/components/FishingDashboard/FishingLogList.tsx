import type { FishingLogFormData, FishingLogWithProfile } from "../../types";
import { FishingLogItem } from "./FishingLogItem";
import styles from "./FishingLogList.module.scss";

type FishingLogListProps = {
  logs: FishingLogWithProfile[];
  onDelete: (log: FishingLogWithProfile) => void;
  onUpdate: (
    log: FishingLogWithProfile,
    updatedData: FishingLogFormData
  ) => void;
};

export const FishingLogList = ({
  logs,
  onDelete,
  onUpdate,
}: FishingLogListProps) => {
  return (
    <div>
      <h3>みんなの釣果一覧</h3>
      {logs.length > 0 ? (
        <ul className={styles.listContainer}>
          {logs.map((log) => (
            <FishingLogItem
              key={log.id}
              log={log}
              onDelete={onDelete}
              onUpdate={onUpdate}
            />
          ))}
        </ul>
      ) : (
        <p>まだ投稿がありません</p>
      )}
    </div>
  );
};

import type { FishingLogWithProfile } from "../../types";
import { FishingLogItem } from "./FishingLogItem"

type FishingLogListProps = {
    logs: FishingLogWithProfile[];
    onDelete: (log: FishingLogWithProfile) => void;
    onUpdate: (log: FishingLogWithProfile, updatedData: any) => void;
};

export const FishingLogList = ({ logs, onDelete, onUpdate }: FishingLogListProps) => {

    return (
        <div>
            <h3>みんなの釣果一覧</h3>
            {logs.length > 0 ? (
                <ul>
                    {logs.map(log => (
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




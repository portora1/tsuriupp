import type { FishDexEntry } from "../../types";
import { FishDexItem } from "./FishDexItem";

type Props = {
    entries: FishDexEntry[];
};

export const FishDexList = ({ entries }: Props) => {
    return (
        <div className="fish-dex-list-container">
            {entries.length > 0 ? (
                <ul className="fish-dex-list">
                    {entries.map(entry => (
                        <FishDexItem key={`${entry.profile_id}-${entry.fish_name}`} entry={entry} />
                    ))}
                </ul>
            ) : (
                <p>まだ図鑑に登録されている魚がいません。</p>
            )}
        </div>
    );
};
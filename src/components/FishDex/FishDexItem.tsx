import type { FishDexEntry } from "../../types";

type Props = {
    entry:FishDexEntry;
};

export const FishDexItem = ({ entry }: Props) => {
    return (
        <li className="fish-dex-item">
            <h3>{entry.fish_name}</h3>
            <div className="dex-details">
                <span>最大サイズ: {entry.max_size || '記録なし'}cm</span>
                <span>最大重量: {entry.max_weight || '記録なし'}kg</span>
                <span>捕獲数: {entry.catch_count}</span>
            </div>
        </li>
    );
};
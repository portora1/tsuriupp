import type { FishDexEntry } from "../../types";

type Props = {
    entry: FishDexEntry;
};

export const FishDexItem = ({ entry }: Props) => {
    return (
        <li className="fish-dex-item">
            <h3 className="fish-name">{entry.fish_name}</h3>
            <div className="dex-details">
                <div className="dex-row">
                    <span>記録された最大サイズ: {entry.max_size ? `${entry.max_size}cm` : "記録なし"}</span>
                    {entry.top_angler && (
                        < span className="top-angler">(👑{entry.top_angler}さん) </span>
                    )}
                </div>
                <span>記録された最大重量: {entry.max_weight ? `${entry.max_weight}g` : '記録なし'} </span>
                <span>ユーザー累計捕獲数: {entry.total_count}匹</span>
            </div>
        </li >
    );
};
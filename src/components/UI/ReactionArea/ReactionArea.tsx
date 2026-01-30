import { useState } from "react";
import type { ReactionData } from "../../../types";
import { ReactionButton } from "../ReactionButton";
import styles from "./ReactionArea.module.scss";

interface ReactionAreaProps {
  targetId: string | number;
  initialReactions?: ReactionData[];
}
export const ReactionArea = ({
  targetId,
  initialReactions = [],
}: ReactionAreaProps) => {
  const [reactions, setReactions] = useState<ReactionData[]>(initialReactions);
  const [mySelectEmoji, setMySelectEmoji] = useState("");
  // myCurrent 自分が選んでいるリアクション
  // カウントが0ならリストから消す処理
  const handleSelect = (emoji: string) => {
    setReactions((prev) => {
      const myCurrent = prev.find((r) => r.me);
      if (myCurrent && myCurrent.emoji === emoji) {
        setMySelectEmoji("");
        return prev
          .map((r) =>
            r.emoji === emoji ? { ...r, count: r.count - 1, me: false } : r
          )
          .filter((r) => r.count > 0);
      }
      setMySelectEmoji(emoji);
      const base = prev
        .map((r) => (r.me ? { ...r, count: r.count - 1, me: false } : r))
        .filter((r) => r.count > 0);
      // 選んだ絵文字はリストにあるか？
      const existing = base.some((r) => r.emoji === emoji);
      if (existing) {
        return base.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, me: true } : r
        );
      }
      //   無かったら増やす
      return [...base, { emoji, count: 1, me: true }];
    });
    // DB連携予定
    console.log(`Target ${targetId}updated whih ${emoji}`);
  };
  return (
    <div className={styles.reactionContainer}>
      <ReactionButton selectEmoji={mySelectEmoji} onSelect={handleSelect} />
      <div className={styles.badgeList}>
        {reactions.map((res) => (
          <button
            key={res.emoji}
            className={`${styles.badge} ${res.me ? styles.myReaction : ""}`}
            onClick={() => handleSelect(res.emoji)}
          >
            <span>{res.emoji}</span>
            <span className={styles.count}>{res.count}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

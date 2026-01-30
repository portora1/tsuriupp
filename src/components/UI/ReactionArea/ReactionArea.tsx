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

  const handleSelect = (emoji: string) => {
    setReactions((prev) => {
      const myCurrentReactions = prev.find((r) => r.me);
      if (myCurrentReactions && myCurrentReactions.emoji === emoji) {
        const nextReactions = prev
          .map((r) =>
            r.emoji === emoji ? { ...r, count: r.count - 1, me: false } : r
          )
          .filter((r) => r.count > 0);
        setMySelectEmoji("");
        return nextReactions;
      }

      let newReactions = prev
        .map((r) => (r.me ? { ...r, count: r.count - 1, me: false } : r))
        .filter((r) => r.emoji === emoji);
      const existing = newReactions.find((r) => r.emoji === emoji);
      if (existing) {
        return prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, me: true } : r
        );
      }
      return [...newReactions, { emoji, count: 1, me: true }];
    });
    setMySelectEmoji(emoji);
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

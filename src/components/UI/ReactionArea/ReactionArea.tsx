import { useEffect, useState } from "react";
import type { ReactionData, ReactionRaw } from "../../../types";
import { ReactionButton } from "../ReactionButton";
import styles from "./ReactionArea.module.scss";
import { useAuth } from "../../../hooks/useAuth";
import { supabase } from "../../../lib/supabaseClient";
import { handleSupabaseError } from "../../../lib/errorHandlers";

const EMOJI_MAP = ["👍", "👏", "😳", "☺️", "👀"];

interface ReactionAreaProps {
  targetId: number;
  tableName: "fishing_log_reactions" | "fish_dex_reactions";
  targetColumn: "log_id" | "fish_id";
  rawReactions?: ReactionRaw[];
  onRefresh?: () => void;
}
export const ReactionArea = ({
  targetId,
  tableName,
  targetColumn,
}: ReactionAreaProps) => {
  const [internalReactions, setInternalReactions] = useState<ReactionRaw[]>([]);
  const { user } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const fetchReactions = async () => {
    const { data, error } = await supabase
      .from(tableName)
      .select("*")
      .eq(targetColumn, targetId);

    if (!error && data) {
      setInternalReactions(data as ReactionRaw[]);
    }
  };

  useEffect(() => {
    fetchReactions();
  }, [targetId, tableName]);

  const reactions: ReactionData[] = EMOJI_MAP.map((emoji, index) => {
    const matches = internalReactions.filter((r) => r.emoji_id === index);
    return {
      emoji,
      count: matches.length,
      me: matches.some((r) => r.user_id === user?.id),
    };
  }).filter((r) => r.count > 0);

  const mySelectEmoji =
    EMOJI_MAP[
      internalReactions.find((r) => r.user_id === user?.id)?.emoji_id ?? -1
    ] || "";
  // myCurrent 自分が選んでいるリアクション
  // カウントが0ならリストから消す処理
  const handleSelect = async (emoji: string) => {
    if (!user) return;
    setError(null);
    const emojiId = EMOJI_MAP.indexOf(emoji);
    if (emojiId === -1) return;
    const myCurrent = internalReactions.find((r) => r.user_id === user.id);
    try {
      if (myCurrent && myCurrent.emoji_id === emojiId) {
        // 削除処理
        await supabase
          .from(tableName)
          .delete()
          .match({ [targetColumn]: targetId, user_id: user.id });
      } else {
        // 新規と上書き
        await supabase.from(tableName).upsert(
          {
            [targetColumn]: targetId,
            user_id: user.id,
            emoji_id: emojiId,
          },
          { onConflict: `${targetColumn},user_id` },
        );
      }
      fetchReactions();
    } catch (err: unknown) {
      const message = handleSupabaseError(err);
      setError(message || "リアクションの更新に失敗しました");
      if (err instanceof Error) {
        console.log(err);
      }
    }
    // console.log(`Target ${targetId}updated whih ${emoji}`);
  };
  return (
    <div className={styles.reactionContainer}>
      <ReactionButton selectEmoji={mySelectEmoji} onSelect={handleSelect} />

      {error && <p className={styles.errorText}>{error}</p>}
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

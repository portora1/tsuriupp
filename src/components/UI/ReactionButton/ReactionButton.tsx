import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { ReactionPopover } from "./ReactionPopover";
import styles from "./ReactionButton.module.scss";
// import type { ReactionData } from "../../../types";

interface ReactionButtonProps {
  selectEmoji: string;
  onSelect: (emoji: string) => void;
}

export const ReactionButton = ({
  selectEmoji,
  onSelect,
}: ReactionButtonProps) => {
  const [showPopover, setShowPopover] = useState(false);
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  //   const handlePressStart = (e:React.MouseEvent | React.TouchEvent) => {
  const handlePressStart = () => {
    if (timeRef.current) clearTimeout(timeRef.current);
    timeRef.current = setTimeout(() => {
      setShowPopover(true);
      console.log("ポップアップを表示");
    }, 150);
    console.log("タイマー開始");
  };

  const handlePressEnd = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
      console.log("タイマー終了");
    }
  };

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    setShowPopover(false);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {showPopover && (
          <>
            <motion.div
              className={styles.overlay}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setShowPopover(false);
              }}
            />
            <ReactionPopover onSelect={handleSelect} />
          </>
        )}
      </AnimatePresence>

      <button
        type="button"
        className={`${styles.mainButton} ${selectEmoji ? styles.hasSelect : ""}`}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        // onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        onClick={() => {
          if (!showPopover && selectEmoji === "") {
            onSelect("👍");
          }
        }}
      >
        <span className={styles.emoji}>{selectEmoji || "👍"}</span>
        <span className={styles.label}>いいね</span>
      </button>
    </div>
  );
};

import { AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { ReactionPopover } from "./ReactionPopover";
import styles from "./ReactionButton.module.scss";

export const ReactionButton = () => {
  const [showPopover, setShowPopover] = useState(false);
  const [selectedReaction, setSelectedReaction] = useState("👍");
  const timeRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressStart = () => {
    timeRef.current = setTimeout(() => {
      setShowPopover(true);
    }, 500);
  };

  const handlePressEnd = () => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
  };

  const handleSelect = (emoji: string) => {
    setSelectedReaction(emoji);
    setShowPopover(false);
  };

  return (
    <div className={styles.container}>
      <AnimatePresence>
        {showPopover && <ReactionPopover onSelect={handleSelect} />}
      </AnimatePresence>

      <button
        className={styles.mainButton}
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
      >
        <span>{selectedReaction}</span>
        <span>いいね</span>
      </button>
    </div>
  );
};

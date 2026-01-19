import { motion } from "framer-motion";
import styles from "./ReactionButton.module.scss";

interface ReactionItemProps {
  emoji: string;
  label: string;
  onSelect: (emoji: string) => void;
}

export const ReactionItem = ({ emoji, label, onSelect }: ReactionItemProps) => {
  return (
    <motion.button
      className={styles.reactionItem}
      whileHover={{ scale: 1.3 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => onSelect(emoji)}
      title={label}
    >
      {emoji}
    </motion.button>
  );
};

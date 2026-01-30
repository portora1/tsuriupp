import { motion } from "framer-motion";
import { ReactionItem } from "./ReactionItem";
import styles from "./ReactionButton.module.scss";

const reactions = [
  { emoji: "👍", label: "good" },
  { emoji: "👏", label: "clap" },
  { emoji: "😳", label: "wow" },
  { emoji: "☺️", label: "smile" },
  { emoji: "👀", label: "eyes" },
];

interface ReactionPopoverProps {
  onSelect: (emoji: string) => void;
}

export const ReactionPopover = ({ onSelect }: ReactionPopoverProps) => {
  return (
    <motion.div
      className={styles.popover}
      initial={{ opacity: 0, y: 10, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.9 }}
    >
      {reactions.map((res, index) => (
        <motion.div
          key={res.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { delay: index * 0.05 },
          }}
        >
          <ReactionItem
            emoji={res.emoji}
            label={res.label}
            onSelect={onSelect}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

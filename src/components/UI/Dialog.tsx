import type { ReactNode } from "react";
import { createPortal } from "react-dom";

type DialogProps = {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
};

export const Dialog = ({ isOpen, onClose, title, children, }: DialogProps) => {
    if (!isOpen) {
        return null;
    }

    const portalRoot = document.getElementById("portal-root");
    if (!portalRoot) return null;

    const handleBackdropClick = (event: React.MouseEvent<HTMLDivElement>) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return createPortal(
        <div className="dialog-backdrop" onClick={handleBackdropClick}>
            <div className="dialog-content">
                {title && <h3 className="dialog-title">{title}</h3>}
                <div className="dialog-body">{children}</div>
                <button className="dialog-close-btn" onClick={onClose}>閉じる</button>
            </div>
        </div>,
        portalRoot
    );
};

"use client";

import { useRef } from "react";
import { Paperclip, Smile, Bold, Code, Link2, Send, Lock, LucideIcon } from "lucide-react";

interface ChatComposerProps {
    draft: string;
    setDraft: (value: string) => void;
    selectedFile: File | null;
    setSelectedFile: (file: File | null) => void;
    onSend: () => void;
    isLoadingSendMessage: boolean;
}

export default function ChatComposer({
    draft,
    setDraft,
    selectedFile,
    setSelectedFile,
    onSend,
    isLoadingSendMessage,
}: ChatComposerProps) {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const wrapSelection = (before: string, after: string = before) => {
        const el = textareaRef.current;
        if (!el) return;
        const { selectionStart, selectionEnd, value } = el;
        const selected = value.slice(selectionStart, selectionEnd);

        setDraft(
            `${value.slice(0, selectionStart)}${before}${selected}${after}${value.slice(selectionEnd)}`
        );

        requestAnimationFrame(() => {
            el.focus();
            el.selectionStart = selectionStart + before.length;
            el.selectionEnd = selectionStart + before.length + selected.length;
        });
    };

    return (
        <div className="p-5 pt-4 border-t border-outline-variant">
            <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        onSend();
                    }
                }}
                rows={2}
                placeholder="Type your message here… (Enter to send, Shift + Enter for new line)"
                className="w-full bg-surface-container-highest border border-outline rounded-lg px-4 py-3 text-body-md text-on-surface placeholder:text-on-surface-variant/70 focus:outline-none focus:border-primary resize-none transition-colors"
            />

            <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
                <div className="flex items-center gap-1">
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) setSelectedFile(file);
                            e.target.value = "";
                        }}
                        accept="image/*,.pdf,application/pdf"
                    />
                    <ToolButton
                        label="Attach file"
                        onClick={() => fileInputRef.current?.click()}
                        icon={Paperclip}
                    />
                    <ToolButton
                        label="Emoji"
                        onClick={() => setDraft(`${draft}🙂`)}
                        icon={Smile}
                    />
                    <span className="w-px h-5 bg-outline-variant mx-1" />
                    <ToolButton label="Bold" onClick={() => wrapSelection("**")} icon={Bold} />
                    <ToolButton label="Code" onClick={() => wrapSelection("`")} icon={Code} />
                    <ToolButton label="Link" onClick={() => wrapSelection("[", "](url)")} icon={Link2} />
                </div>

                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
                        <Lock size={12} />
                        End-to-end encrypted
                    </span>
                    <button
                        type="button"
                        onClick={onSend}
                        disabled={(!draft.trim() && !selectedFile) || isLoadingSendMessage}
                        className="flex items-center gap-2 bg-primary text-on-primary text-label-md rounded-lg px-6 py-2.5 hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isLoadingSendMessage ? "Sending..." : "Send"}
                        <Send size={15} />
                    </button>
                </div>
            </div>

            <p className="text-label-sm text-on-surface-variant mt-3">
                GigFlow Terms apply • Never share external banking details or unverified wire transfers.
            </p>
        </div>
    );
}

function ToolButton({
    icon: Icon,
    label,
    onClick,
}: {
    icon: LucideIcon;
    label: string;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            title={label}
            aria-label={label}
            onClick={onClick}
            className="w-9 h-9 flex items-center justify-center rounded-md text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface transition-colors cursor-pointer"
        >
            <Icon size={17} />
        </button>
    );
}
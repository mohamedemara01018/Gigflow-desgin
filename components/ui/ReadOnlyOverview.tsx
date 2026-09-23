"use client"

import { EditorContent, useEditor } from "@tiptap/react"
import { useEffect } from "react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- Tiptap Node ---
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"
import { useMediaQuery } from "@/hooks/useMediaQuery"

interface ReadOnlyOverviewProps {
    content: string
    tabletWidth?: string
    width?: string
    clampLines?: boolean
}

function ReadOnlyOverview({
    content,
    tabletWidth,
    width,
    clampLines = false,
}: ReadOnlyOverviewProps) {
    const editor = useEditor({
        immediatelyRender: false,
        editable: false,
        editorProps: {
            attributes: {
                class: `simple-editor max-w-none! w-full! min-h-full! outline-none focus:outline-none ${clampLines ? "line-clamp-3 overflow-hidden" : ""
                    }`,
            },
        },
        extensions: [
            StarterKit,
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Typography,
            Superscript,
            Subscript,
            Selection,
        ],
        content,
    })

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content)
        }
    }, [content, editor])

    const isTablet = useMediaQuery(`(max-width:1024px)`)

    return (
        <div className="w-full h-full flex flex-col flex-1 min-w-0">
            <EditorContent
                editor={editor}
                role="presentation"
                className="w-full h-full flex-1 p-4 bg-surface-container-highest border border-outline-variant rounded-md"
                style={{ maxWidth: isTablet ? tabletWidth : width }}
            />
        </div>
    )
}

export default ReadOnlyOverview
'use client'
import { TOC_ITEMS } from "./Cookie policy.data"

export default function TableOfContents() {
    return (
        <nav className="card !p-4 lg:sticky lg:top-6">
            <p className="text-label-sm text-on-surface-variant px-2 pb-2">Table of Contents</p>
            <ul className="flex flex-col gap-0.5">
                {TOC_ITEMS.map((item) => (
                    <li key={item.id}>
                        <a
                            href={`#${item.id}`}
                            className="flex items-center gap-2 text-body-sm text-on-surface-variant hover:text-on-surface hover:bg-surface-container-low rounded-md px-2 py-1.5 transition-colors"
                        >
                            <span className="text-label-sm text-on-surface-variant w-4 shrink-0">{item.number}</span>
                            {item.label}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    );
}
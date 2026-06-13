"use client";

import { DocumentsVM } from "./DocumentsVM";
import { DOCUMENT_TYPE_LABELS, DocumentType } from "@/types/document";
import { formatDateTime } from "@/lib/date";

const STATUS_TONE: Record<"info" | "error" | "success", string> = {
    info: "text-muted-foreground",
    error: "text-red-600",
    success: "text-emerald-600",
};

const TYPE_BADGE: Record<DocumentType, string> = {
    [DocumentType.WORK_ORDER]: "bg-indigo-50 text-indigo-700 ring-indigo-200",
    [DocumentType.CONTRACT]: "bg-amber-50 text-amber-700 ring-amber-200",
    [DocumentType.ISSUE_NOTE]: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

const inputClass =
    "rounded-lg border border-border bg-surface px-3 py-2 text-sm text-foreground outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30";

export const Documents = () => {
    const {
        rows,
        totalPages,
        page,
        isLoading,
        isError,
        isFetching,
        search,
        filterType,
        onSearchChange,
        onFilterTypeChange,
        issueType,
        onIssueTypeChange,
        onIssue,
        isIssuing,
        issueStatus,
        classifyText,
        onClassifyTextChange,
        onClassify,
        isClassifying,
        classifyResult,
        classifyError,
        canClassify,
        goPrev,
        goNext,
    } = DocumentsVM();

    return (
        <div className="mx-auto max-w-5xl px-6 py-8">
            {/* HEADER */}
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight text-foreground">
                        Documents
                    </h1>
                </div>

                {/* ISSUE NEW DOCUMENT */}
                <div className="flex items-center gap-2">
                    <select
                        value={issueType}
                        onChange={(e) =>
                            onIssueTypeChange(e.target.value as DocumentType)
                        }
                        className={inputClass}
                        disabled={isIssuing}
                    >
                        {Object.values(DocumentType).map((type) => (
                            <option key={type} value={type}>
                                {DOCUMENT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={onIssue}
                        disabled={isIssuing}
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            className="h-4 w-4"
                        >
                            <path d="M12 5v14M5 12h14" />
                        </svg>
                        New document
                    </button>
                </div>
            </div>

            {/* AI CLASSIFY */}
            <div className="mb-6 rounded-xl border border-border bg-surface p-4 shadow-sm">
                <div className="mb-2 flex items-center gap-2">
                    <span className="inline-flex h-6 items-center rounded-full bg-indigo-50 px-2 text-xs font-semibold text-indigo-700 ring-1 ring-inset ring-indigo-200">
                        AI
                    </span>
                    <h2 className="text-sm font-semibold text-foreground">
                        Classify &amp; issue from free text
                    </h2>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                    <textarea
                        value={classifyText}
                        onChange={(e) => onClassifyTextChange(e.target.value)}
                        rows={2}
                        placeholder="เช่น เครื่องปรับอากาศห้องผ่าตัด 3 เสีย ต้องแจ้งซ่อมด่วน"
                        className={`${inputClass} flex-1 resize-none`}
                    />
                    <button
                        onClick={onClassify}
                        disabled={!canClassify || isClassifying}
                        className="h-fit shrink-0 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary-hover disabled:opacity-50"
                    >
                        {isClassifying ? "Classifying…" : "Classify & issue"}
                    </button>
                </div>

                {/* RESULT */}
                <div className="mt-3 min-h-[1.5rem] text-sm">
                    {classifyError && (
                        <span className="text-red-600">
                            Classification failed. Please try again.
                        </span>
                    )}

                    {!classifyError && classifyResult && classifyResult.code && (
                        <span className="inline-flex flex-wrap items-center gap-2">
                            <span
                                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                    TYPE_BADGE[
                                        classifyResult.entityType as DocumentType
                                    ] ?? "bg-slate-100 text-slate-600 ring-slate-200"
                                }`}
                            >
                                {DOCUMENT_TYPE_LABELS[
                                    classifyResult.entityType as DocumentType
                                ] ?? classifyResult.entityType}
                            </span>
                            <span className="font-mono font-medium text-foreground">
                                {classifyResult.code}
                            </span>
                            {typeof classifyResult.confidence === "number" && (
                                <span className="text-muted-foreground">
                                    confidence{" "}
                                    {Math.round(classifyResult.confidence * 100)}%
                                </span>
                            )}
                        </span>
                    )}

                    {!classifyError &&
                        classifyResult &&
                        !classifyResult.code && (
                            <span className="text-amber-600">
                                Couldn&apos;t determine a type — please issue
                                manually above.
                            </span>
                        )}
                </div>
            </div>

            {/* CARD */}
            <div className="rounded-xl border border-border bg-surface shadow-sm">
                {/* TOOLBAR */}
                <div className="flex flex-wrap items-center gap-3 border-b border-border p-4">
                    <div className="relative flex-1 min-w-[220px]">
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={2}
                            strokeLinecap="round"
                            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                        >
                            <circle cx="11" cy="11" r="7" />
                            <path d="m21 21-4.3-4.3" />
                        </svg>
                        <input
                            value={search}
                            onChange={(e) => onSearchChange(e.target.value)}
                            placeholder="Search code…"
                            className={`${inputClass} w-full pl-9`}
                        />
                    </div>

                    <select
                        value={filterType}
                        onChange={(e) =>
                            onFilterTypeChange(
                                e.target.value as DocumentType | ""
                            )
                        }
                        className={inputClass}
                    >
                        <option value="">All Types</option>
                        {Object.values(DocumentType).map((type) => (
                            <option key={type} value={type}>
                                {DOCUMENT_TYPE_LABELS[type]}
                            </option>
                        ))}
                    </select>

                    <div className="ml-auto h-5 text-sm">
                        {issueStatus && (
                            <span className={STATUS_TONE[issueStatus.tone]}>
                                {issueStatus.text}
                            </span>
                        )}
                    </div>
                </div>

                {/* TABLE */}
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-surface-muted text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            <th className="px-5 py-3">Document Code</th>
                            <th className="px-5 py-3">Type</th>
                            <th className="px-5 py-3">Created At</th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-border">
                        {isLoading && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-5 py-10 text-center text-muted-foreground"
                                >
                                    Loading…
                                </td>
                            </tr>
                        )}

                        {isError && !isLoading && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-5 py-10 text-center text-red-600"
                                >
                                    Failed to load documents.
                                </td>
                            </tr>
                        )}

                        {!isLoading && !isError && rows.length === 0 && (
                            <tr>
                                <td
                                    colSpan={3}
                                    className="px-5 py-10 text-center text-muted-foreground"
                                >
                                    No documents found.
                                </td>
                            </tr>
                        )}

                        {!isError &&
                            rows.map((doc) => (
                                <tr
                                    key={doc.id}
                                    className="transition-colors hover:bg-surface-muted/60"
                                >
                                    <td className="px-5 py-3 font-mono font-medium text-foreground">
                                        {doc.code}
                                    </td>
                                    <td className="px-5 py-3">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                                                TYPE_BADGE[doc.entityType] ??
                                                "bg-slate-100 text-slate-600 ring-slate-200"
                                            }`}
                                        >
                                            {DOCUMENT_TYPE_LABELS[
                                                doc.entityType
                                            ] ?? doc.entityType}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-muted-foreground">
                                        {formatDateTime(doc.createdAt)}
                                    </td>
                                </tr>
                            ))}
                    </tbody>
                </table>

                {/* PAGINATION */}
                <div className="flex items-center justify-between border-t border-border px-5 py-3">
                    <button
                        onClick={goPrev}
                        disabled={page === 1}
                        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted disabled:opacity-40"
                    >
                        Prev
                    </button>

                    <div className="text-sm text-muted-foreground">
                        Page <span className="font-medium text-foreground">{page}</span> / {totalPages}
                        {isFetching && (
                            <span className="ml-2 text-muted-foreground/70">
                                updating…
                            </span>
                        )}
                    </div>

                    <button
                        onClick={goNext}
                        disabled={page >= totalPages}
                        className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm font-medium text-foreground transition hover:bg-surface-muted disabled:opacity-40"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

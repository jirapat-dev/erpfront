import { useEffect, useMemo, useState } from "react";

import {
    useDocuments,
    useCreateDocument,
    useClassifyDocument,
} from "@/hooks/useDocuments";

import { DocumentType, GetDocumentsQuery } from "@/types/document";

const PAGE_SIZE = 10;
const SEARCH_DEBOUNCE_MS = 500;

export const DocumentsVM = () => {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [filterType, setFilterType] = useState<DocumentType | "">("");
    const [issueType, setIssueType] = useState<DocumentType>(
        DocumentType.WORK_ORDER
    );
    const [classifyText, setClassifyText] = useState("");

    const query: GetDocumentsQuery = useMemo(
        () => ({
            page,
            pageSize: PAGE_SIZE,
            search: debouncedSearch,
            entityType: filterType,
        }),
        [page, debouncedSearch, filterType]
    );

    const documentsQuery = useDocuments(query);
    const createMutation = useCreateDocument(query);
    const classifyMutation = useClassifyDocument();

    const rows = documentsQuery.data?.data ?? [];
    const totalPages = documentsQuery.data?.meta.totalPages ?? 1;

    const onSearchChange = (value: string) => setSearch(value);

    const onFilterTypeChange = (value: DocumentType | "") => {
        setFilterType(value);
        setPage(1);
    };

    const onIssueTypeChange = (value: DocumentType) => setIssueType(value);

    const onIssue = () => createMutation.mutate({ entityType: issueType });

    const onClassifyTextChange = (value: string) => setClassifyText(value);

    const onClassify = () => {
        const text = classifyText.trim();
        if (text.length < 5) { 
            return; 
        }

        classifyMutation.mutate({ text });
    };

    const goPrev = () => setPage((page) => Math.max(page - 1, 1));
    const goNext = () => setPage((page) => Math.min(page + 1, totalPages));

    const issueStatus: { tone: "info" | "error" | "success"; text: string } | null =
        createMutation.isPending
            ? { tone: "info", text: "Issuing…" }
            : createMutation.isError
              ? { tone: "error", text: "Failed to issue. Please try again." }
              : createMutation.isSuccess
                ? {
                      tone: "success",
                      text: `Issued ${createMutation.data.data.code}`,
                  }
                : null;
      
    // Debounce the search box; reset to page 1 when the term changes.
    useEffect(() => {
        const t = setTimeout(() => {
            setDebouncedSearch(search);
            setPage(1);
        }, SEARCH_DEBOUNCE_MS);

        return () => clearTimeout(t);
    }, [search]);

    return {
        rows,
        totalPages,
        page,
        isLoading: documentsQuery.isLoading,
        isError: documentsQuery.isError,
        isFetching: documentsQuery.isFetching,
        search,
        filterType,
        onSearchChange,
        onFilterTypeChange,
        issueType,
        onIssueTypeChange,
        onIssue,
        isIssuing: createMutation.isPending,
        issueStatus,
        classifyText,
        onClassifyTextChange,
        onClassify,
        isClassifying: classifyMutation.isPending,
        classifyResult: classifyMutation.data?.data ?? null,
        classifyError: classifyMutation.isError,
        canClassify: classifyText.trim().length >= 5,
        goPrev,
        goNext,
    };
};

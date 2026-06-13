import {
    keepPreviousData,
    useMutation,
    useQuery,
    useQueryClient,
} from "@tanstack/react-query";

import { documentService } from "@/services/document/document.service";
import {
    ClassifyDocumentRequest,
    CreateDocumentRequest,
    Document,
    DocumentListResponse,
    GetDocumentsQuery,
} from "@/types/document";

const DOCUMENTS_KEY = "documents";

export const useDocuments = (query: GetDocumentsQuery) => {
    return useQuery({
        queryKey: [DOCUMENTS_KEY, query],
        queryFn: () => documentService.getDocuments(query),
        // Keep showing the previous page while the next one loads (smoother
        // pagination / search than a full loading flash).
        placeholderData: keepPreviousData,
    });
};

export const useCreateDocument = (currentQuery: GetDocumentsQuery) => {
    const queryClient = useQueryClient();
    const key = [DOCUMENTS_KEY, currentQuery];

    return useMutation({
        mutationFn: (payload: CreateDocumentRequest) =>
            documentService.createDocument(payload),

        onMutate: async (payload) => {
            await queryClient.cancelQueries({ queryKey: [DOCUMENTS_KEY] });

            const previous =
                queryClient.getQueryData<DocumentListResponse>(key);

            // Only show the optimistic row where it would genuinely appear:
            // first page, no search filter, and the type filter allows it.
            const belongsInView =
                currentQuery.page === 1 &&
                currentQuery.search.trim() === "" &&
                (currentQuery.entityType === "" ||
                    currentQuery.entityType === payload.entityType);

            if (previous && belongsInView) {
                const tempRow: Document = {
                    id: `tmp-${crypto.randomUUID()}`,
                    code: "Issuing…",
                    entityType: payload.entityType,
                    createdAt: new Date().toISOString(),
                };

                queryClient.setQueryData<DocumentListResponse>(key, {
                    ...previous,
                    data: [tempRow, ...previous.data].slice(
                        0,
                        currentQuery.pageSize
                    ),
                    meta: { ...previous.meta, total: previous.meta.total + 1 },
                });
            }

            return { previous };
        },

        onError: (_err, _payload, context) => {
            // Roll back to the snapshot taken in onMutate.
            if (context?.previous) {
                queryClient.setQueryData(key, context.previous);
            }
        },

        onSettled: () => {
            // Pull the real row (server code + id) regardless of outcome.
            queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
        },
    });
};

/**
 * AI classify free-text into a document type and (when resolved) issue a code.
 * If a code came back, a new document exists — refresh the list.
 */
export const useClassifyDocument = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (payload: ClassifyDocumentRequest) =>
            documentService.classifyDocument(payload),

        onSuccess: (response) => {
            if (response.data.code) {
                queryClient.invalidateQueries({ queryKey: [DOCUMENTS_KEY] });
            }
        },
    });
};

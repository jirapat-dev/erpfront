import { api } from "@/lib/axios";
import {
    ClassifyDocumentRequest,
    ClassifyDocumentResponse,
    CreateDocumentRequest,
    CreateDocumentResponse,
    DocumentListResponse,
    GetDocumentsQuery,
} from "@/types/document";

export const documentService = {
    getDocuments: async (
        query: GetDocumentsQuery
    ): Promise<DocumentListResponse> => {
        // Only send params the backend accepts; empty entityType/search would
        // fail server-side validation (@IsEnum / partial-match noise).
        const params: Record<string, string | number> = {
            page: query.page,
            pageSize: query.pageSize,
        };

        if (query.search.trim()) {
            params.search = query.search.trim();
        }

        if (query.entityType) {
            params.entityType = query.entityType;
        }

        const response = await api.get<DocumentListResponse>("/documents", {
            params,
        });

        return response.data;
    },

    createDocument: async (
        payload: CreateDocumentRequest
    ): Promise<CreateDocumentResponse> => {
        const response = await api.post<CreateDocumentResponse>(
            "/documents",
            payload
        );

        return response.data;
    },

    classifyDocument: async (
        payload: ClassifyDocumentRequest
    ): Promise<ClassifyDocumentResponse> => {
        const response = await api.post<ClassifyDocumentResponse>(
            "/documents/classify",
            payload
        );

        return response.data;
    },
};

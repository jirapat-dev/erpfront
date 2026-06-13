export enum DocumentType {
    WORK_ORDER = "work_order",
    CONTRACT = "contract",
    ISSUE_NOTE = "issue_note",
}

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
    [DocumentType.WORK_ORDER]: "Work Order",
    [DocumentType.CONTRACT]: "Contract",
    [DocumentType.ISSUE_NOTE]: "Issue Note",
};

export interface Document {
    id: string;
    code: string;
    entityType: DocumentType;
    createdAt: string;
}

export interface DocumentListMeta {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

/** Server response shape for GET /documents (kept as {data, meta} per backend contract). */
export interface DocumentListResponse {
    data: Document[];
    meta: DocumentListMeta;
}

export interface GetDocumentsQuery {
    page: number;
    pageSize: number;
    /** Partial match on code. Empty string means "no search filter". */
    search: string;
    /** Empty string means "all types". */
    entityType: DocumentType | "";
}

export interface CreateDocumentRequest {
    entityType: DocumentType;
}

/** Server response shape for POST /documents ({ success, data }). */
export interface CreateDocumentResponse {
    success: boolean;
    data: Document;
}

export interface ClassifyDocumentRequest {
    text: string;
}

/** entityType may be "unknown" when the AI + keyword fallback can't decide. */
export interface ClassifyResult {
    entityType: DocumentType | "unknown";
    confidence?: number;
    /** Present only when a concrete type was resolved and a code was issued. */
    code?: string;
}

/** Server response shape for POST /documents/classify ({ success, data }). */
export interface ClassifyDocumentResponse {
    success: boolean;
    data: ClassifyResult;
}

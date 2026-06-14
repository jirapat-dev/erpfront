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

export interface DocumentListResponse {
    data: Document[];
    meta: DocumentListMeta;
}

export interface GetDocumentsQuery {
    page: number;
    pageSize: number;
    search: string;
    entityType: DocumentType | "";
}

export interface CreateDocumentRequest {
    entityType: DocumentType;
}

export interface CreateDocumentResponse {
    success: boolean;
    data: Document;
}

export interface ClassifyDocumentRequest {
    text: string;
}

export interface ClassifyResult {
    entityType: DocumentType | "unknown";
    confidence?: number;
    code?: string;
}

export interface ClassifyDocumentResponse {
    success: boolean;
    data: ClassifyResult;
}

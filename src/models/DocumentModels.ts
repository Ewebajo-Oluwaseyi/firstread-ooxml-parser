export interface DocumentSection {
  id: string;
  title: string;
  level: number;
  children: DocumentSection[];
}

export interface ParsedDocument {
  content: string;
  structure: DocumentSection[];
  title?: string;
  documentType: "xml" | "docx";
  messages?: any[];
}

export interface ParsingError {
  message: string;
  details?: any;
}

export interface ParsingProgress {
  status: "pending" | "processing" | "complete" | "error";
  progress: number;
  message?: string;
}

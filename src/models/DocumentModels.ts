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
  messages?: any[];
}

export interface ParsingError {
  message: string;
  details?: any;
}

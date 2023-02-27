export interface SnippetMetaData {
  tags: string[];
  timestampMili: number;
}

export interface SnippetData {
  title: string;
  body: string;
  metadata: SnippetMetaData;
}

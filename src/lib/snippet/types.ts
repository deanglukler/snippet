export interface SnippetMetaData {
  tags: string[];
  timestampMili: number;
}

export interface SnippetData {
  title: string;
  body: string;
  metadata: SnippetMetaData;
}

export interface SnippetDataSerialized {
  title: string;
  body: string;
  metadata: string;
}

export type TagList = string[];

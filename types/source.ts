export interface SourceItem {
  content: string;

  metadata: {
    fileName?: string;

    source?: string;

    chunkIndex?: number;
  };
}
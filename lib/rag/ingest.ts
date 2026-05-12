new Document({
  pageContent: chunk,

  metadata: {
    fileName,

    source: filePath,

    chunkIndex: index,
  },
});

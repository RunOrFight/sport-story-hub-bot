const getPreviewSrc = (previewUrl?: string) =>
  previewUrl ? `http://localhost:5555/api/${previewUrl}` : undefined;

export { getPreviewSrc };

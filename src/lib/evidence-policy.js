export const evidenceTypes = {
  jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", webp:"image/webp",
  pdf:"application/pdf", docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
};
export const defaultEvidenceLimits = {fileBytes:10*1024*1024, requestBytes:24*1024*1024, briefCount:10, revisionCount:5};

export function fileSize(bytes) {
  return bytes < 1024 ? bytes+" B" : bytes < 1048576 ? Math.ceil(bytes/1024)+" KB" : (bytes/1048576).toFixed(1)+" MB";
}

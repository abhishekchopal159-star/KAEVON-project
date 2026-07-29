export type VisualSearchCandidate = {
  file: File;
  dominantHints: string[];
};

// Provider-neutral boundary. A future buyer can connect Google Vision,
// Algolia NeuralSearch or another verified service without changing the UI.
export async function prepareVisualSearch(file: File): Promise<VisualSearchCandidate> {
  if (!file.type.startsWith("image/")) throw new Error("Choose a valid fashion image.");
  if (file.size > 8 * 1024 * 1024) throw new Error("Image must be under 8 MB.");
  return { file, dominantHints: [] };
}

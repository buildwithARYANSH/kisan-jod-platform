import { orders, searchResults } from "../data/mock";

export const mockService = {
  async getDashboard() { return { orders, updatedAt: "12 Sep 2026 · 08:42 IST" }; },
  async globalSearch(query: string) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return searchResults.filter((item) => `${item.id} ${item.title} ${item.meta} ${item.type}`.toLowerCase().includes(q));
  },
  async exportCsv(moduleName: string) {
    const blob = new Blob([`Module,Status,Generated\n${moduleName},Sample export,${new Date().toISOString()}\n`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${moduleName.toLowerCase().replace(/\s+/g, "-")}-sample.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  },
};

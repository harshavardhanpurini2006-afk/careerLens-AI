import { HistoryRecord } from "../types";
import { mockHistoryRecords } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const historyService = {
  async getHistory(): Promise<HistoryRecord[]> {
    if (USE_MOCK) {
      await simulateDelay(200);
      return mockHistoryRecords;
    }
    const res = await fetch(`${API_BASE_URL}/resumes/history`);
    if (!res.ok) throw new Error("Failed to load history");
    return res.json();
  },

  async deleteRecord(id: string): Promise<{ success: boolean }> {
    if (USE_MOCK) {
      await simulateDelay(150);
      return { success: true };
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete record");
    return res.json();
  },
};

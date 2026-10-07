export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === "true";
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

/**
 * Simulates a realistic network delay for mock services
 */
export async function simulateDelay(ms: number = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

import { JobRole, RoleFit, RoleCode } from "../types";
import { mockJobRoles, mockRoleFits } from "./mockData";
import { simulateDelay, USE_MOCK, API_BASE_URL } from "./api";

export const roleService = {
  async getAllRoles(): Promise<JobRole[]> {
    if (USE_MOCK) {
      await simulateDelay(150);
      return mockJobRoles;
    }
    const res = await fetch(`${API_BASE_URL}/roles`);
    if (!res.ok) throw new Error("Failed to load roles");
    return res.json();
  },

  async getRoleMatches(resumeId: string): Promise<RoleFit[]> {
    if (USE_MOCK) {
      await simulateDelay(250);
      return mockRoleFits;
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/roles`);
    if (!res.ok) throw new Error("Failed to load role matches");
    return res.json();
  },

  async getRoleFit(resumeId: string, roleCode: RoleCode | string): Promise<RoleFit | undefined> {
    if (USE_MOCK) {
      await simulateDelay(200);
      return mockRoleFits.find((r) => r.roleCode === roleCode) || mockRoleFits[0];
    }
    const res = await fetch(`${API_BASE_URL}/resumes/${resumeId}/roles/${roleCode}`);
    if (!res.ok) throw new Error("Failed to load role fit");
    return res.json();
  },
};

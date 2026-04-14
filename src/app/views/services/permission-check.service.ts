import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PermissionCheckService {
  constructor() {}

  /**
   * When `isAdmin` is set in localStorage, grant all permissions (no per-key checks).
   * Otherwise fall back to the `permissions` JSON array if present.
   */
  checkPermission(_permission: string): boolean {
    if (localStorage.getItem("isAdmin") === "true") {
      return true;
    }
    const raw = localStorage.getItem("permissions");
    if (raw == null || raw === "" || raw === "null") {
      return false;
    }
    try {
      const list = JSON.parse(raw);
      return Array.isArray(list) && list.includes(_permission);
    } catch {
      return false;
    }
  }
}

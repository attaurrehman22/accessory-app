import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class PermissionCheckService {
  constructor() {}

  checkPermission(permission: string): boolean {
    const permissions = sessionStorage.getItem("permissions");
    return permissions ? JSON.parse(permissions).includes(permission) : false;
  }
}

import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { forkJoin, of } from "rxjs";
import { catchError, finalize } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { AlertsServicesService } from "src/services/alerts-service/alerts-services.service";
import { HttpService } from "src/services/http/http.service";

@Component({
  selector: "app-accessory-cart-page",
  templateUrl: "./accessory-cart-page.component.html",
  styleUrls: ["./accessory-cart-page.component.css"],
})
export class AccessoryCartPageComponent implements OnInit {
  apiUrl = environment.apipath + "/";

  loading = true;
  cartItems: any[] = [];
  orderId: number | null = null;
  totalAmount = 0;
  orderStatus = "";

  selectedIds = new Set<number>();
  updatingItemId: number | null = null;

  constructor(
    private http: HttpService,
    private router: Router,
    private alertService: AlertsServicesService
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem("user_token") && localStorage.getItem("isLoggedIn") === "true") {
      this.loadCart();
    } else {
      this.loading = false;
      this.router.navigate(["/login"]);
    }
  }

  loadCart(): void {
    this.loading = true;
    this.http
      .getCartList()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (res: any) => {
          this.applyCartResponse(res);
        },
        error: () => {
          this.cartItems = [];
          this.alertService.showAlert("warning", "Could not load cart.");
        },
      });
  }

  private applyCartResponse(res: any): void {
    this.orderId = res?.order_id ?? null;
    this.totalAmount = Number(res?.total_amount) || 0;
    this.orderStatus = res?.order_status ?? "";
    const items = res?.items ?? [];
    this.cartItems = items.map((item: any) => {
      this.normalizeAccessoryImages(item);
      return item;
    });
    this.selectedIds.clear();
  }

  private normalizeAccessoryImages(item: any): void {
    if (item?.accessory?.main_image) {
      item.accessory.main_image = String(item.accessory.main_image).replace(
        /\\/g,
        ""
      );
    }
  }

  imageSrc(item: any): string {
    const p = item?.accessory?.main_image;
    if (!p) {
      return "";
    }
    return this.apiUrl + p;
  }

  formatMoney(v: any): string {
    if (v == null || v === "") {
      return "—";
    }
    const n = parseFloat(String(v));
    return Number.isFinite(n) ? n.toFixed(2) : "—";
  }

  /** Line under title: categories or attributes when present. */
  attributeLine(item: any): string {
    const acc = item?.accessory;
    if (!acc) {
      return "";
    }
    const parts: string[] = [];
    if (Array.isArray(acc.categories) && acc.categories.length) {
      for (const c of acc.categories) {
        const seg = [c.group, c.sub_group, c.name].filter(Boolean).join(" ");
        if (seg) {
          parts.push(seg);
        }
      }
    }
    if (Array.isArray(acc.attributes) && acc.attributes.length) {
      for (const a of acc.attributes) {
        if (typeof a === "string") {
          parts.push(a);
        } else if (a?.name && a?.value) {
          parts.push(`${a.name} ${a.value}`);
        }
      }
    }
    if (parts.length) {
      return parts.join(" | ");
    }
    if (acc.description) {
      return String(acc.description).slice(0, 120) + (acc.description.length > 120 ? "…" : "");
    }
    return "";
  }

  isSelected(itemId: number): boolean {
    return this.selectedIds.has(itemId);
  }

  toggleItem(itemId: number, checked: boolean): void {
    if (checked) {
      this.selectedIds.add(itemId);
    } else {
      this.selectedIds.delete(itemId);
    }
  }

  toggleSelectAll(checked: boolean): void {
    this.selectedIds.clear();
    if (checked) {
      for (const it of this.cartItems) {
        if (it?.item_id != null) {
          this.selectedIds.add(it.item_id);
        }
      }
    }
  }

  allSelected(): boolean {
    return (
      this.cartItems.length > 0 &&
      this.cartItems.every((it) => this.selectedIds.has(it.item_id))
    );
  }

  removeSelected(): void {
    this.http.deleteAllCart().subscribe({
      next: () => {
        this.selectedIds.clear();
        this.loadCart();
      },
      error: () => this.alertService.showAlert("warning", "Could not remove items."),
    });
  }

  removeLine(item: any): void {
    const id = item?.item_id;
    if (id == null) {
      return;
    }
    this.http.deleteCart(id).subscribe({
      next: () => this.loadCart(),
      error: () =>
        this.alertService.showAlert("warning", "Could not remove item."),
    });
  }

  changeQuantity(item: any, delta: number): void {
    const lineId = item?.item_id;
    const accessoryId = item?.accessory?.id;
    if (lineId == null || accessoryId == null || this.updatingItemId != null) {
      return;
    }
    const q = Number(item.quantity) || 1;
    const next = q + delta;
    if (next < 1) {
      return;
    }
    this.updatingItemId = lineId;
    const body = { accessory_id: accessoryId, quantity: next };
    this.http
      .updateCart(body)
      .pipe(
        finalize(() => {
          this.updatingItemId = null;
        })
      )
      .subscribe({
        next: (res: any) => {
          if (res?.items) {
            this.applyCartResponse(res);
          } else {
            this.loadCart();
          }
        },
        error: () => {
          this.alertService.showAlert("warning", "Could not update quantity.");
        },
      });
  }

  goCheckout(): void {
    this.router.navigate(["/myprofile/summary"]);
  }

  continueShopping(): void {
    this.router.navigate(["/"]);
  }

  trackByItemId(_: number, item: any): number {
    return item?.item_id;
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AlertsServicesService } from 'src/services/alerts-service/alerts-services.service';
import { HttpService } from 'src/services/http/http.service';

@Component({
  selector: 'app-accessory-summary',
  templateUrl: './accessory-summary.component.html',
  styleUrls: ['./accessory-summary.component.css']
})
export class AccessorySummaryComponent implements OnInit {
  apiUrl = environment.apipath + '/';
  /** From GET /api/me (gtUserDetails). */
  profileUser: any = null;

  order_id: any;
  totalAmount = 361.50;
  shippingCharges = 25.50;
  totalPayout = 386.00;
  lugWidth: string[] = [];
  Buckle: any[] = [];
  Length: any[] = [];
  Color: any[] = [];

  ngOnInit(): void {
    this.getCartList();
    this.loadProfile();
  }

  loadProfile(): void {
    this.http.gtUserDetails().subscribe({
      next: (res: any) => {
        this.profileUser = res?.user ?? null;
      },
      error: () => {
        this.profileUser = null;
      },
    });
  }

  displayName(): string {
    const u = this.profileUser;
    if (!u) {
      return "—";
    }
    if (u.name && String(u.name).trim()) {
      return String(u.name).trim();
    }
    const parts = [u.first_name, u.last_name].filter(
      (x: any) => x && String(x).trim()
    );
    return parts.length ? parts.join(" ") : "—";
  }

  cartItems: any[] = [];

  getCartList() {
    this.http.getCartList().subscribe((res) => {
      const items = res?.items ?? [];
      this.cartItems = items;
      this.totalAmount = res?.total_amount ?? 0;
      this.shippingCharges = res?.shipping_charges ?? 0;
      this.totalPayout = res?.total_amount ?? 0;

      this.cartItems = this.cartItems.map((item: any) => {
        if (item?.accessory?.main_image) {
          item.accessory.main_image = String(item.accessory.main_image).replace(
            /\\/g,
            ""
          );
        }
        return item;
      });

      this.lugWidth = [];
      const first = res?.items?.[0]?.accessory;
      const inv = first?.inventories;
      if (Array.isArray(inv) && inv.length > 0) {
        this.Buckle = inv[0]?.attribute_values ?? [];
        this.Length = inv;
        this.Color = inv[0]?.attribute_values ?? [];
        Object.values(first?.attributes || {}).forEach((attrObj: any) => {
          if (attrObj && typeof attrObj === "object") {
            this.lugWidth.push(...Object.keys(attrObj));
          }
        });
      } else {
        this.Buckle = [];
        this.Length = [];
        this.Color = [];
      }
    });
  }

  /** Categories / attributes / short description (flat accessory API). */
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
      const d = String(acc.description);
      return d.slice(0, 120) + (d.length > 120 ? "…" : "");
    }
    return "";
  }

  constructor(private http:HttpService,private alertService:AlertsServicesService,private router:Router){}

 
  goBack() {
    // Handle back navigation
    this.router.navigate(['/myprofile'], 
      { 
        state: {
          activeRouteType: 'cart'
        }
       });
  }

  payNow() {
    this.http.confirmCartOrder().subscribe({
      next: () => {
        this.alertService.showAlert("success", "Order confirmed");
        this.router.navigate(['/accessories/home']);
      },
      error: () => {
        this.alertService.showAlert("warning", "Something went wrong. Please try again.");
      },
    });
  }
}

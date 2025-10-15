import { Routes } from "@angular/router";
import { DashboardComponent } from "./pages/dashboard/dashboard.component";
import { CategoriesComponent } from "./pages/categories/categories.component";
import { ProductsComponent } from "./pages/products/products.component";
import { CustomersComponent } from "./pages/customers/customers.component";
import { MovementsComponent } from "./pages/movements/movements.component";
import { SalesComponent } from "./pages/sales/sales.component";
import { AlertsComponent } from "./pages/alerts/alerts.component";

export const routes: Routes = [
  { path: "", component: DashboardComponent },
  { path: "categories", component: CategoriesComponent },
  { path: "products", component: ProductsComponent },
  { path: "customers", component: CustomersComponent },
  { path: "movements", component: MovementsComponent },
  { path: "sales", component: SalesComponent },
  { path: "alerts", component: AlertsComponent }
];



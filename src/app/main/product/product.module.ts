import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { OrderComponent } from './order/order.component';
import { ProductComponent } from './product/product.component';
import { TypeComponent } from './type/type.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { HttpClientModule } from '@angular/common/http';
import { NewsComponent } from './news/news.component';
import { EditorModule } from 'primeng/editor';
@NgModule({
  declarations: [
    OrderComponent, ProductComponent, TypeComponent, NewsComponent
  ],
  imports: [
    CommonModule,
    EditorModule,
    SharedModule,
    HttpClientModule,
    RouterModule.forChild([
      {
        path: 'order',
        component: OrderComponent,
      },
      {
        path: 'product',
        component: ProductComponent,
      },
      {
        path: 'news',
        component: NewsComponent,
      },
      {
        path: 'type',
        component: TypeComponent,
      },
    ]),
  ]
})
export class ProductModule { }


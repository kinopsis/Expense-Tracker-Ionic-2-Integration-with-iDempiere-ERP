import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ExpenseDetailsPage } from '../pages/expense-details/expense-details';
import { ExpenseCreatePage } from '../pages/expense-create/expense-create';
import { ExpenseModifyPage } from '../pages/expense-modify/expense-modify';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ExpenseDetailsPage,
    ExpenseCreatePage,
    ExpenseModifyPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ExpenseDetailsPage,
    ExpenseCreatePage,
    ExpenseModifyPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}

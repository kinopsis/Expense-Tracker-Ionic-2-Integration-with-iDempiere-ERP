
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import * as $ from "jquery";
import X2JS from 'X2JS';



import { ExpenseDetailsPage } from '../expense-details/expense-details';
import { ExpenseCreatePage } from '../expense-create/expense-create';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public expenseList: any;

  constructor(public navCtrl: NavController, public platform: Platform) {
    platform.ready().then(() => {
    });
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad Expense List Page');
    this.platform.ready().then(() => {
      this.callRestServiceForExpenseListData();
    });
  }

refereshServiceAgain(){
 this.callRestServiceForExpenseListData();

}

callRestServiceForExpenseListData() {
    let url: string = this.getIdempiereRestServerUrl();
    let reqinputxml: string = this.getExpenseListRequestInputXml();
    var self = this;
    console.log(' call_rest_service - START ');


    $.ajax({
      method: 'POST', url: url, contentType: "application/xml", data: reqinputxml, dataType: 'text', timeout: 999999,
      success: function (result) {
        console.log(' ====> SUCCESS  ---> ' + result);
        self.processResponseOutputAndBindToView(result);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(' ====> FAIL --->' + XMLHttpRequest.status + ' ---> ' + XMLHttpRequest.statusText + ' ---> ' + errorThrown.toString());
      }
    });


    console.log(' call_rest_service - END ');
  }



  processResponseOutputAndBindToView(responseOutput) {
    responseOutput = responseOutput.toString();
    var cleanedResponse: string = responseOutput.split('_0:').join('');
    console.log('cleanresponse - ' + cleanedResponse);

    var parser: any = new X2JS();
    let json = parser.xml2js(cleanedResponse);
    console.log('json object ---> ' + json);
    console.log('json object stringify ---> ' + JSON.stringify(json));
    var obj = json["WindowTabData"]["DataSet"]["DataRow"];

    console.log('json filtered stringify ---> ' + JSON.stringify(obj));


  console.log('---------------------------');
 var item_status: string = '';

 for (var i in obj) {
      item_status = obj[i].field[5].val.toString();

  let actual_status = '';

  if (item_status.trim().toUpperCase() == 'I')
  {
    actual_status='Waiting For Approval';
  }else if (item_status.trim().toUpperCase() == 'C')
  {
    actual_status='Created';
  }else if (item_status.trim().toUpperCase() == 'A')
  {
    actual_status='Approved';
  }else if (item_status.trim().toUpperCase() == 'R')
  {
    actual_status='Rejected';
  }
      console.log(actual_status);
     obj[i].field[5].val = actual_status;
}

  console.log('---------------------------');


    //bind to the view
    this.expenseList = obj;

    //display it in console

    var item_documentid: string = '';
    var item_expenseamount: string = '';

    console.log('Raw output ---> ');
    for (var i in obj) {
      item_documentid = obj[i].field[8].val.toString();
      item_expenseamount = obj[i].field[2].val.toString();
      item_status = obj[i].field[5].val.toString();

      console.log(item_documentid);
      console.log(item_expenseamount);
      console.log(item_status);
      console.log('---------------------------');
    }

  }

  getExpenseListRequestInputXml(): string {
    let expenseListRequestInputXml: string = `<_0:ModelCRUDRequest xmlns:_0="http://idempiere.org/ADInterface/1_0">
            <_0:ModelCRUD>
              <_0:serviceType>ListExpense</_0:serviceType>
           <_0:TableName>TF_Expense</_0:TableName>
         </_0:ModelCRUD>
         <_0:ADLoginRequest>
           <_0:user>SuperUser</_0:user>
           <_0:pass>System</_0:pass>
           <_0:lang>en_US</_0:lang>
           <_0:ClientID>11</_0:ClientID>
           <_0:RoleID>102</_0:RoleID>
           <_0:OrgID>11</_0:OrgID>
           <_0:WarehouseID>103</_0:WarehouseID>
           <_0:stage>1</_0:stage>
         </_0:ADLoginRequest>
       </_0:ModelCRUDRequest>`;
    return expenseListRequestInputXml;
  }

  getIdempiereRestServerUrl(): string {
  //  let resturl: string = "http:///ADInterface/services/rest/model_adservice/query_data";
    let resturl: string = "http://23.239.5.32/ADInterface/services/rest/model_adservice/query_data";
    return resturl;
  }


  expenseDetailsSelected(item) {
    let item_documentid = item.field[8].val.toString();
    let item_desc = item.field[9].val.toString();
    let item_expenseamount = item.field[2].val.toString();
    let item_status = item.field[5].val.toString();

    console.log(item_documentid);
    console.log(item_desc);
    console.log(item_expenseamount);
    console.log(item_status);

    let alljson = JSON.stringify(item);
    console.log(alljson);
    this.navCtrl.push(ExpenseDetailsPage, alljson);


  }

  createExpense(){
  this.navCtrl.push(ExpenseCreatePage)
  }


}

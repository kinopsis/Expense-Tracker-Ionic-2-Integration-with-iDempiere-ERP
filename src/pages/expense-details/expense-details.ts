import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Platform } from 'ionic-angular';
import * as $ from "jquery";
import X2JS from 'X2JS';

import { ExpenseModifyPage } from '../expense-modify/expense-modify';

@Component({
  selector: 'page-expense-details',
  templateUrl: 'expense-details.html'
})
export class ExpenseDetailsPage {


  public ExpenseAmt: string;
  public ApprovedAmt: string;
  public ApprovedBy: string;
  public Status: string;
  public DocumentNo: string;
  public DateReport: string;


  public ExpenseTypeID: string;
  public expenseType: string;
  public Description: string;
  //public expenseDesc: string;



  constructor(public navCtrl: NavController, public navParams: NavParams, public platform: Platform) {
    console.log('ExpenseDetailsPage - constructor');
    this.bindParamValues(this.navParams.data.toString());
  }


  ionViewDidLoad() {
    console.log('ionViewDidLoad expense detail page ');
    this.platform.ready().then(() => {

      this.callRestServiceForExpenseTypeData();
    });
  }


  bindParamValues(param) {

    //  var param: string = this.navParams.data.toString();
    console.log('param -->> ' + param);


    var paramobj = JSON.parse(param);

    console.log('paramobj -->> ' + paramobj);


    this.ExpenseAmt = paramobj.field[2].val.toString();



    if (isNaN(paramobj.field[3]) == true) {
      if (JSON.stringify(paramobj.field[3].val).toString() == '{"_xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","_xsi:nil":"true"}') {
        this.ApprovedAmt = '';
      }
      else {
        this.ApprovedAmt = paramobj.field[3].val.toString();
      }
    }



    if (isNaN(paramobj.field[4]) == true) {
      if (JSON.stringify(paramobj.field[4].val).toString() == '{"_xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance","_xsi:nil":"true"}') {
        this.ApprovedBy = '';
      }
      else {
        this.ApprovedBy = paramobj.field[4].val.toString();
      }
    }

    this.Status = paramobj.field[5].val.toString();
    this.DocumentNo = paramobj.field[8].val.toString();
    this.DateReport = paramobj.field[6].val.toString();
    this.ExpenseTypeID = paramobj.field[7].val.toString();

    if (isNaN(paramobj.field[9]) == true) {

      console.log('isNaN == false');
      this.Description = paramobj.field[9].val.toString();
    }
    else {
      this.Description = '';
      console.log('isNaN == true' + this.Description);
    }

  }


  callRestServiceForExpenseTypeData() {
    let url: string = this.getIdempiereRestServerUrl();
    let reqinputxml: string = this.getExpenseTypeDescRequestInputXml();
    reqinputxml = reqinputxml.replace('[[ExpenseTypeID]]', this.ExpenseTypeID.toString())

    console.log(' expense id changed ****> ' + reqinputxml);
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
    //update status ExpenseDetailsPage



    this.expenseType = obj.field[1].val.toString();


    // if (isNaN(obj.field[3]) == true) {
    //   this.expenseDesc = '';
    // }
    // else {
    //   this.expenseDesc = obj.field[3].val.toString();
    // }

    //this.expenseDesc = obj.field[3].val.toString();


  }

  getExpenseTypeDescRequestInputXml(): string {
    let businessPartnerRequestInputXml: string = `<_0:ModelCRUDRequest xmlns:_0="http://idempiere.org/ADInterface/1_0">
          <_0:ModelCRUD>
                <_0:serviceType>ReadExpenseType</_0:serviceType>
                <_0:TableName>S_ExpenseType</_0:TableName>
                <_0:RecordID>[[ExpenseTypeID]]</_0:RecordID>
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
    return businessPartnerRequestInputXml;
  }


  getExpenseRequestInputXml(): string {
    let businessPartnerRequestInputXml: string = `<_0:ModelCRUDRequest xmlns:_0="http://idempiere.org/ADInterface/1_0">
          <_0:ModelCRUD>
                <_0:serviceType>ReadExpense</_0:serviceType>
                <_0:TableName>TF_Expense</_0:TableName>
                <_0:RecordID>[[DocumentId]]</_0:RecordID>
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
    return businessPartnerRequestInputXml;
  }

  getIdempiereRestServerUrl(): string {
    let resturl: string = "http://45.79.96.174/ADInterface/services/rest/model_adservice/read_data";
    return resturl;
  }

  deleteExpense() {
    console.log('deleteExpense');
  }

  modifyExpense() {

    console.log('modifyExpense');
    var param: string = this.navParams.data.toString();
    console.log('param -->> ' + param);

    this.navCtrl.push(ExpenseModifyPage, param)
  }





  /* ------------------------- REFRESH RECORD -------------------------- */
  refereshServiceAgain() {
    let url: string = this.getIdempiereRestServerUrl();
    let reqinputxml: string = this.getExpenseRequestInputXml();
    reqinputxml = reqinputxml.replace('[[DocumentId]]', this.DocumentNo.toString())

    console.log(' refereshServiceAgain - DocumentId id changed ****> ' + reqinputxml);
    var self = this;
    console.log(' call_rest_service - START ');


    $.ajax({
      method: 'POST', url: url, contentType: "application/xml", data: reqinputxml, dataType: 'text', timeout: 999999,
      success: function (result) {
        console.log(' ====> SUCCESS  ---> ' + result);
        self.refreshView(result);
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(' ====> FAIL --->' + XMLHttpRequest.status + ' ---> ' + XMLHttpRequest.statusText + ' ---> ' + errorThrown.toString());
      }
    });
    console.log(' call_rest_service - END ');
  }

  /* ------------------------- REFRESH VIEW -------------------------- */
  refreshView(result) {
    console.log('refreshView ' + JSON.stringify(result));



    let responseOutput = result.toString();
    var cleanedResponse: string = responseOutput.split('_0:').join('');
    console.log('cleanresponse - ' + cleanedResponse);

    var parser: any = new X2JS();
    let json = parser.xml2js(cleanedResponse);
    console.log('json object ---> ' + json);
    console.log('json object stringify ---> ' + JSON.stringify(json));
    var obj = json["WindowTabData"]["DataSet"]["DataRow"];

    console.log('json filtered stringify ---> ' + JSON.stringify(obj));
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



    var param = JSON.stringify(obj);
    console.log('---------------------------');
    this.bindParamValues(param);

  }

}

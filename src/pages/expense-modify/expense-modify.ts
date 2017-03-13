import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as $ from "jquery";
import X2JS from 'X2JS';

@Component({
  selector: 'page-expense-modify',
  templateUrl: 'expense-modify.html'
})
export class ExpenseModifyPage {


  frmGrp: FormGroup;
  paramData: any;
  spinnersearching: boolean;

  public ExpenseAmt: string;
  public ExpenseType: string;
  public Description: string;
  public ExpenseTypeID: string;
  public DocumentId: string;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    public toastCtrl: ToastController,
    public formBuilder: FormBuilder) {

    this.bindParamValues();
    this.spinnersearching = false;





  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ExpenseModifyPage');
  }


  modifyExpense() {

    console.log('modifyExpense()');

      if (this.frmGrp.value.ExpenseType.length == 0) {
      this.presentToast('The ExpenseType must be entered');
    }
    else if (this.frmGrp.value.ExpenseAmt.length == 0) {
      this.presentToast('The ExpenseAmt must be entered');
    }
    else if (this.frmGrp.value.Description.length == 0) {
      this.presentToast('The Description must be entered');
    }
    else {


    let ExpenseType = this.frmGrp.value.ExpenseType;
    let ExpenseAmt = this.frmGrp.value.ExpenseAmt;
    let Description = this.frmGrp.value.Description;

    console.log('-------------------------');
    console.log('ExpenseType' + ' - ' + ExpenseType);
    console.log('ExpenseAmt' + ' - ' + ExpenseAmt);
    console.log('Description' + ' - ' + Description);
    console.log('-------------------------');


    let url: string = this.getIdempiereRestServerUrl();
    let reqinputxml: string = this.getExpenseTypeDescRequestInputXml();
    reqinputxml = reqinputxml.replace('[[ExpenseType]]', ExpenseType.toString())
    reqinputxml = reqinputxml.replace('[[ExpenseAmt]]', ExpenseAmt.toString())
    reqinputxml = reqinputxml.replace('[[Description]]', Description.toString())
    reqinputxml = reqinputxml.replace('[[DocumentId]]', this.DocumentId.toString())



    console.log(' expense id changed ****> ' + reqinputxml);
    var self = this;
    console.log(' call_rest_service - START ');

    $.ajax({
      method: 'POST', url: url, contentType: "application/xml", data: reqinputxml, dataType: 'text', timeout: 999999,
      success: function (result) {
        console.log(' ====> SUCCESS  ---> ' + result);
        self.presentToast('Updated successfully');
        self.navCtrl.pop();
      },
      error: function (XMLHttpRequest, textStatus, errorThrown) {
        console.log(' ====> FAIL --->' + XMLHttpRequest.status + ' ---> ' + XMLHttpRequest.statusText + ' ---> ' + errorThrown.toString());
        self.presentToast('Updation failed ' + errorThrown.toString());
      }
    });
    console.log(' call_rest_service - END ');
    }
  }



  getExpenseTypeDescRequestInputXml(): string {
    let businessPartnerRequestInputXml: string = `<_0:ModelCRUDRequest xmlns:_0="http://idempiere.org/ADInterface/1_0">
	<_0:ModelCRUD>
	  <_0:serviceType>UpdateExpense</_0:serviceType>
	  <_0:TableName>TF_Expense</_0:TableName>
	  <_0:RecordID>[[DocumentId]]</_0:RecordID>
	  <_0:Action>Update</_0:Action>
	  <_0:DataRow>
		<_0:field column="S_ExpenseType_ID">
			<_0:val>[[ExpenseType]]</_0:val>
		</_0:field>
		<_0:field column="ExpenseAmt">
			<_0:val>[[ExpenseAmt]]</_0:val>
		</_0:field>
		<_0:field column="Status">
			<_0:val>C</_0:val>
		</_0:field>
		<_0:field column="Description">
			<_0:val>[[Description]]</_0:val>
		</_0:field>
	  </_0:DataRow>
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
    let resturl: string = "http://23.239.5.32/ADInterface/services/rest/model_adservice/update_data";
    return resturl;
  }

  /* ------------------------------------- TOAST ------------------------------------------------------- */

  presentToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 2000
    });
    toast.present();
  }


  /* ----------------------- BIND PARAM VALUES ---------------------------------- */
  bindParamValues() {

    var param: string = this.navParams.data.toString();
    console.log('param -->> ' + param);
    var paramobj = JSON.parse(param);
    console.log('paramobj -->> ' + paramobj);

    this.ExpenseAmt = paramobj.field[2].val.toString();
    this.ExpenseTypeID = paramobj.field[7].val.toString();

    if (isNaN(paramobj.field[9]) == true) {
      console.log('isNaN == false');
      this.Description = paramobj.field[9].val.toString();
    }
    else {
      this.Description = '';
      console.log('isNaN == true' + this.Description);
    }

  this.DocumentId = paramobj.field[8].val.toString();

console.log(' this.ExpenseAmt '+ this.ExpenseAmt);
console.log('this.ExpenseTypeID '+ this.ExpenseTypeID);
console.log(' this.Description '+ this.Description);

  console.log(' this.DocumentId '+ this.DocumentId);

    this.frmGrp = this.formBuilder.group({
      ExpenseType: [this.ExpenseTypeID],
      ExpenseAmt: [this.ExpenseAmt],
      Description: [this.Description]

    });

  }
}

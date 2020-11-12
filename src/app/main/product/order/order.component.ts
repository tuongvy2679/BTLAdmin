import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent extends BaseComponent implements OnInit {
  public items: any;
  public item: any;
  public totalRecords: any;
  public pageSize = 3;
  public page = 1;
  public uploadedFiles: any[] = [];
  public formsearch: any;
  public formdata: any;
  public doneSetupForm: any;
  public showUpdateModal: any;
  public isCreate: any;
  submitted = false;
  @ViewChild(FileUpload, { static: false }) file_image: FileUpload;
  constructor(private fb: FormBuilder, injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.formsearch = this.fb.group({
      'ho_ten': [''],
    });
    this.search();
  }

  loadPage(page) {
    //debugger;
    this._api.post('/api/hoadon/search1', { page: page, pageSize: this.pageSize }).takeUntil(this.unsubscribe).subscribe(res => {
      this.items = res.data;
      this.totalRecords = res.totalItems;
      this.pageSize = res.pageSize;
    });
  }

  search() {
    // debugger;
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/hoadon/search1', { page: this.page, pageSize: this.pageSize, ho_ten: this.formsearch.get('ho_ten').value }).takeUntil(this.unsubscribe).subscribe(res => {
      this.items = res.data;
      this.totalRecords = res.totalItems;
      this.pageSize = res.pageSize;
    });
  }

  pwdCheckValidator(control) {
    var filteredStrings = { search: control.value, select: '@#!$%&*' }
    var result = (filteredStrings.select.match(new RegExp('[' + filteredStrings.search + ']', 'g')) || []).join('');
    if (control.value.length < 6 || !result) {
      return { matkhau: true };
    }
  }

  get f() { return this.formdata.controls; }

  // onSubmit(value) {
  //   this.submitted = true;
  //   if (this.formdata.invalid) {
  //     return;
  //   }
  //   if (this.isCreate) {
  //     this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
  //       let data_image = data == '' ? null : data;
  //       let tmp = {
  //         item_group_id: value.item_group_id,
  //         tt_image: data_image,
  //         ho_ten: value.ho_ten,
  //         tt_description: value.tt_description,
  //       };
  //       this._api.post('/api/hoadon/create-hoadon', tmp).takeUntil(this.unsubscribe).subscribe(res => {
  //         alert('Thêm thành công');
  //         this.search();
  //         this.closeModal();
  //       });
  //     });
  //   } else {
  //     this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
  //       let data_image = data == '' ? null : data;
  //       let tmp = {
  //         tt_image: data_image,
  //         ho_ten: value.ho_ten,
  //         tt_description: value.tt_description,
  //         tt_id: this.item.tt_id,
  //       };
  //       this._api.post('/api/hoadon/update-hoadon', tmp).takeUntil(this.unsubscribe).subscribe(res => {
  //         alert('Cập nhật thành công');
  //         this.search();
  //         this.closeModal();
  //       });
  //     });
  //   }
  // }

  // onDelete(row) {
  //   this._api.post('/api/hoadon/delete-hoadon', { tt_id: row.tt_id }).takeUntil(this.unsubscribe).subscribe(res => {
  //     alert('Xóa thành công');
  //     this.search();
  //   });
  // }

  // Reset() {
  //   this.item = null;
  //   this.formdata = this.fb.group({
  //     'ho_ten': ['', Validators.required],
 
  //     'tt_description': [''],
  //   }, {
  //   });
  // }

  // createModal() {
  //   this.doneSetupForm = false;
  //   this.showUpdateModal = true;
  //   this.isCreate = true;
  //   this.item = null;
  //   setTimeout(() => {
  //     $('#createItemModal').modal('toggle');
  //     this.formdata = this.fb.group({
  //       'ho_ten': ['', Validators.required],
   
  //       'tt_description': [''],
  //     }, {
  //     });
  //     this.doneSetupForm = true;
  //   });
  // }

  // public openUpdateModal(row) {
  
  //   this.doneSetupForm = false;
  //   this.showUpdateModal = true;
  //   this.isCreate = false;
  //   setTimeout(() => {
  //     $('#createItemModal').modal('toggle');
  //     this._api.get('/api/hoadon/get_tintuc_new/' + row.tt_id).takeUntil(this.unsubscribe).subscribe((res: any) => {
  //       this.item = res;
  //       this.formdata = this.fb.group({
  //         'data_image': [this.item.tt_image, Validators.required],
  //         'tt_image': [this.item.tt_image, Validators.required],
  //         'ho_ten': [this.item.ho_ten],
 
  //         'tt_description': [this.item.tt_description],
  //       }, {
  //       });
  //       this.doneSetupForm = true;
  //     });
  //   }, 700);
  // }

  // closeModal() {
  //   $('#createItemModal').closest('.modal').modal('hide');
  // }
}
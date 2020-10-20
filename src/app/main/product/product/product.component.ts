import { MustMatch } from '../../../helpers/must-match.validator';
import { Component, Injector, OnInit, ViewChild } from '@angular/core';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;
@Component({
  selector: 'app-product',
  templateUrl: '../product/product.component.html',
  styleUrls: ['../product/product.component.css'],
})
export class ProductComponent extends BaseComponent implements OnInit {
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
      'item_name': [''],
    });

    this.search();
  }

  loadPage(page) {
    //debugger;
    this._api.post('/api/items/search', { page: page, pageSize: this.pageSize }).takeUntil(this.unsubscribe).subscribe(res => {
      this.items = res.data;
      this.totalRecords = res.totalItems;
      this.pageSize = res.pageSize;
    });
  }

  search() {
    debugger;
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/items/search', { page: this.page, pageSize: this.pageSize , item_name: this.formsearch.get('item_name').value }).takeUntil(this.unsubscribe).subscribe(res => {
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

  onSubmit(value) {
    this.submitted = true;
    if (this.formdata.invalid) {
      return;
    }
    if (this.isCreate) {
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          item_image: data_image,

          item_name: value.item_name,
          item_price: value.item_price,
          item_description: value.item_description

        };
        this._api.post('/api/items/create-item', tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
        });
      });
    } else {
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          item_image: data_image,

          item_name: value.item_name,
          item_price: value.item_price,
          item_description: value.item_description,
          item_id: this.item.item_id,
        };
        this._api.post('/api/items/update-item', tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
        });
      });
    }
  }

  onDelete(row) {
    this._api.post('/api/items/delete-item', { item_id: row.item_id }).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search();
    });
  }

  Reset() {
    this.item = null;
    this.formdata = this.fb.group({
      'item_name': ['', Validators.required],
      'item_price': ['', Validators.required],
      'item_description': [''],
    }, {

    });
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.item = null;
    setTimeout(() => {
      $('#createItemModal').modal('toggle');
      this.formdata = this.fb.group({
        'item_name': ['', Validators.required],
        'item_price': ['', Validators.required],
        'item_description': [''],
      }, {

      });

      this.doneSetupForm = true;
    });
  }

  public openUpdateModal(row) {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = false;
    setTimeout(() => {
      $('#createItemModal').modal('toggle');
      this._api.get('/api/items/get-by-id/' + row.item_id).takeUntil(this.unsubscribe).subscribe((res: any) => {
        this.item = res;
        this.formdata = this.fb.group({
          'item_name': ['', Validators.required],
          'item_price': ['', Validators.required],
          'item_description': [''],
        }, {

        });
        this.doneSetupForm = true;
      });
    }, 700);
  }

  closeModal() {
    $('#createItemModal').closest('.modal').modal('hide');
  }
}
import { Component, Injector, OnInit, ViewChild  } from '@angular/core';

import { MustMatch } from '../../../helpers/must-match.validator';
import { FileUpload } from 'primeng/fileupload';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '../../../lib/base-component';
import 'rxjs/add/operator/takeUntil';
declare var $: any;

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
  
})
export class ProductComponent extends BaseComponent implements OnInit {
  public news: any;
  public new: any;
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
      'tt_name': [''],
    });
    this.search();
  }

  loadPage(page) {
    //debugger;
    this._api.post('/api/news/search1', { page: page, pageSize: this.pageSize }).takeUntil(this.unsubscribe).subscribe(res => {
      this.news = res.data;
      this.totalRecords = res.totalnews;
      this.pageSize = res.pageSize;
    });
  }

  search() {
    // debugger;
    this.page = 1;
    this.pageSize = 5;
    this._api.post('/api/news/search1', { page: this.page, pageSize: this.pageSize, tt_name: this.formsearch.get('tt_name').value }).takeUntil(this.unsubscribe).subscribe(res => {
      this.news = res.data;
      this.totalRecords = res.totalnews;
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
          tt_image: data_image,
          tt_name: value.tt_name,
          tt_description: value.tt_description,
        };
        this._api.post('/api/news/create-new', tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Thêm thành công');
          this.search();
          this.closeModal();
        });
      });
    } else {
      this.getEncodeFromImage(this.file_image).subscribe((data: any): void => {
        let data_image = data == '' ? null : data;
        let tmp = {
          tt_image: data_image,
          tt_name: value.tt_name,
          tt_description: value.tt_description,
          tt_id: this.new.tt_id,
        };
        this._api.post('/api/news/update-new', tmp).takeUntil(this.unsubscribe).subscribe(res => {
          alert('Cập nhật thành công');
          this.search();
          this.closeModal();
        });
      });
    }
  }

  onDelete(row) {
    this._api.post('/api/news/delete-news', { new_id: row.new_id }).takeUntil(this.unsubscribe).subscribe(res => {
      alert('Xóa thành công');
      this.search();
    });
  }

  Reset() {
    this.new = null;
    this.formdata = this.fb.group({
      'tt_name': ['', Validators.required],
      'tt_description': [''],
    }, {
    });
  }

  createModal() {
    this.doneSetupForm = false;
    this.showUpdateModal = true;
    this.isCreate = true;
    this.new = null;
    setTimeout(() => {
      $('#createnewModal').modal('toggle');
      this.formdata = this.fb.group({
        'tt_name': ['', Validators.required],
        'tt_price': ['', Validators.required],
        'tt_description': [''],
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
      $('#createnewModal').modal('toggle');
      this._api.get('/api/news/get-by-id/' + row.new_id).takeUntil(this.unsubscribe).subscribe((res: any) => {
        this.new = res;
        this.formdata = this.fb.group({
          'data_image': [this.new.tt_image, Validators.required],
          'tt_name': [this.new.tt_name],
          'tt_description': [this.new.tt_description],
        }, {
        });
        this.doneSetupForm = true;
      });
    }, 700);
  }

  closeModal() {
    $('#createnewModal').closest('.modal').modal('hide');
  }
}
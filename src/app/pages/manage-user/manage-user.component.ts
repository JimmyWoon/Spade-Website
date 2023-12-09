import { Component, ElementRef, EventEmitter, Input, Output, Renderer2 } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PagingService } from 'service/paging-service';
import { IUser } from 'src/app/models/user.model';

@Component({
  selector: 'app-manage-user',
  templateUrl: './manage-user.component.html',
  styleUrls: ['./manage-user.component.scss']
})
export class ManageUserComponent{
  msg:string = "";
  formGroup: FormGroup;
  user_information:any = null;

  pageSize = 2; // Adjust as needed
  currentPage = 1;
  totalDocuments = 0;

  data:IUser[] = [];
  selectedUsers: any[] = [];

  constructor(private router: Router,private formBuilder:FormBuilder,private fireAuth: AngularFireAuth,private firestore: AngularFirestore,private pagingService: PagingService,private el: ElementRef, private renderer: Renderer2){
    if (sessionStorage.getItem('user') !== null){
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
    if(this.user_information.data.role == "Student" || this.user_information == null){
      window.location.href='/';
    }
    this.formGroup = this.formBuilder.group({
      username: [this.user_information.data?.username,[Validators.required]],
      old_password: [''],
      new_password: ['']
    })
  }

  ngOnInit() {
    this.loadData();
    this.getTotalDocumentCount();
  }


  loadData() {
    this.fireAuth.signInWithEmailAndPassword(
      this.user_information.data.email ,
      this.user_information.data.password
    ).then( () => {
      this.pagingService
      .getDataWithPagination('user', this.pageSize, this.currentPage, this.user_information.id)
      .subscribe({
        next:(data) =>{
            this.data = [];
            const startIndex = (this.currentPage-1)*this.pageSize;
            const endIndex = startIndex + this.pageSize;
            this.data = data.slice(startIndex, endIndex);
        },
        error: (error) => {
          console.error("Error",error);
        }
      });
    });
 
  }
  goToPage(pageNumber: number) {
    this.currentPage = pageNumber;
    this.loadData();
  }
  
  getTotalDocumentCount() {
    this.fireAuth.signInWithEmailAndPassword(
      this.user_information.data.email ,
      this.user_information.data.password
    ).then( () => {    
      this.pagingService.filterDocumentsWithId('user',this.user_information.id).subscribe((count) => {
      this.totalDocuments = count;
      });
    });

  
  }

  getPageNumbers(): number[] {
    const totalPages = Math.ceil(this.totalDocuments / this.pageSize);
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }


  async submit(){
    const checkboxes = this.el.nativeElement.querySelectorAll('.checkbox');
    var changes = false;
    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        changes = true;
        try {
          await this.fireAuth.signInWithEmailAndPassword(
            this.user_information.data.email ,
            this.user_information.data.password
          );
  
          const documentRef = this.firestore.collection('user').doc(checkbox.value);
          await documentRef.update({ 'date_deleted': new Date() });
        } catch (error) {
          console.error('Error updating document:', error);
        }
      }
    }
    if (changes){    
      window.location.href = '/manage-user';    
    }
  }

  editClick(){
    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    var delete_btn = document.getElementsByClassName('fa fa-trash');

    this.renderer.setStyle(saveBtn, 'display', 'inline-block');
    this.renderer.setStyle(cancelBtn, 'display', 'inline-block');
    this.renderer.setStyle(editBtn, 'display', 'none');

    for (var i = 0; i < delete_btn.length; i++) {
      delete_btn[i].classList.remove('hidden');
      delete_btn[i].classList.add('show');
    }
  }
  cancelClick(){
    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    var delete_btn = document.getElementsByClassName('fa fa-trash');

    this.renderer.setStyle(saveBtn, 'display', 'none');
    this.renderer.setStyle(cancelBtn, 'display', 'none');
    this.renderer.setStyle(editBtn, 'display', 'inline-block');
    for (var i = 0; i < delete_btn.length; i++) {
      delete_btn[i].classList.remove('show');
      delete_btn[i].classList.add('hidden');
    }
      var checkboxes = document.querySelectorAll('.checkbox');

      // Iterate through the checkboxes and uncheck them
      checkboxes.forEach((checkbox) => {
        if (checkbox instanceof HTMLInputElement) {
          checkbox.checked = false;
        }
      });
      var elements = document.querySelectorAll('.information');
  
      // Loop through the selected elements and remove the class
      elements.forEach(function (element) {
          element.classList.remove('selected-div');
      });
  }

  trashClick(){
    const trashButtons = this.el.nativeElement.querySelectorAll('i.fa.fa-trash');

    trashButtons.forEach((trashBtn: HTMLInputElement) => {
      trashBtn.addEventListener('click', (event:Event) => {
        // Find the parent div of the clicked trash button
        const targetElement = event.target as Element;

        // Use closest on the casted targetElement
        const parentDiv = targetElement.closest('.information');    

        if (parentDiv) {
          // Find the checkbox within the parent div
          const checkbox = parentDiv.querySelector('.checkbox')as HTMLInputElement;
    
          if (checkbox) {
            // Toggle the checkbox state
            checkbox.checked = true;
    
            // Add or remove the "selected-div" class based on the checkbox state
            if (checkbox.checked) {
              parentDiv.classList.add('selected-div');
            } else {
              parentDiv.classList.remove('selected-div');
            }
          }
        }
      });
    });
  }

  
}

import { Component, ElementRef, Renderer2 } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadService } from 'service/file-upload.service';
import { MaterialService } from 'service/teaching-material.service';
import { IMaterial } from 'src/app/models/material.model';

@Component({
  selector: 'app-material-edit-list',
  templateUrl: './material-edit-list.component.html',
  styleUrls: ['./material-edit-list.component.scss']
})
export class MaterialEditListComponent {
  msg:String = ''
  selectedFile: File | null = null;
  material_list:IMaterial[] = [];
  user_information: any = null;
  items: string[] | undefined;
  formGroup: FormGroup;
  materialParam :string | null = null;

  perPage: number = 5; 
  currentPage: number = 1;
  startIndex = (this.currentPage - 1) * this.perPage;
  endIndex = this.currentPage * this.perPage;
  displayedMaterials: IMaterial[] = [];

  constructor(private el: ElementRef, private renderer: Renderer2,private materialService: MaterialService,private fireAuth: AngularFireAuth,private formBuilder: FormBuilder,private fileUploadService: FileUploadService,private storage: AngularFireStorage,private firestore: AngularFirestore){
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
    if(this.user_information.data.role == "Student" || this.user_information == null){
      window.location.href='/';
      
    }
    this.formGroup = this.formBuilder.group({})
  }
  ngOnInit(): void {
    this.materialParam = this.user_information.id;
    if (this.materialParam === null){
      window.location.href='/material-list';
    }
    try{
      this.fireAuth.signInWithEmailAndPassword(
        this.user_information.data.email ,
        this.user_information.data.password
      );
    }catch{
      window.location.href="/material-list";
    }

    this.materialService.getSelfMaterials(this.materialParam!).subscribe((materials:IMaterial[]) => {
      this.material_list = materials;
      this.displayedMaterials = this.material_list.slice(this.startIndex, this.endIndex);
    })


  }
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateDisplayedMaterials();
    }
  }

  nextPage() {
    if (this.endIndex < this.material_list.length) {
      this.currentPage++;
      this.updateDisplayedMaterials();
    }
  }

  updateDisplayedMaterials() {
    this.startIndex = (this.currentPage - 1) * this.perPage;
    this.endIndex = this.currentPage * this.perPage;
    this.displayedMaterials = this.material_list.slice(this.startIndex, this.endIndex);
  }

  download(id:string){
    const index = this.displayedMaterials.findIndex((item) => item.id === id);

    const filePath = this.displayedMaterials[index].fullPath; // Replace with the actual path to your file in Firebase Storage
    const fileRef = this.storage.ref(filePath);
  
    fileRef.getDownloadURL().subscribe((url) => {
      // Create an invisible anchor element to trigger the download
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.target = '_blank'; // Open the link in a new tab
      anchor.download = this.displayedMaterials[index].material_file_name!; // Set the desired file name
      anchor.click();
    });
  }

  async submit(){
    const checkboxes = this.el.nativeElement.querySelectorAll('.checkbox');
    var changes = false;
    for (const checkbox of checkboxes) {
      if (checkbox.checked) {
        changes = true;
        try {
          const documentRef = this.firestore.collection('teaching-material').doc(checkbox.value);
          await documentRef.update({ 'date_deleted': new Date() });
        } catch (error) {
          console.error('Error updating document:', error);
        }
      }
    }
    if (changes){    
      window.location.href = '/material-edit-list';    
    }
  }

  redirectToAnotherPage(id:string){
    window.location.href = `/material-edit?id=${id}`;
  }

  editClick(){
    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    var delete_btn = document.getElementsByClassName('fa fa-trash');
    var pencil_btn = document.getElementsByClassName('fa fa-pencil');

    this.renderer.setStyle(saveBtn, 'display', 'inline-block');
    this.renderer.setStyle(cancelBtn, 'display', 'inline-block');
    this.renderer.setStyle(editBtn, 'display', 'none');

    for (var i = 0; i < delete_btn.length; i++) {
      delete_btn[i].classList.remove('hidden');
      delete_btn[i].classList.add('show');
      pencil_btn[i].classList.remove('hidden');
      pencil_btn[i].classList.add('show');
    }
  }
  cancelClick(){
    const saveBtn = this.el.nativeElement.querySelector('#saveBtn');
    const cancelBtn = this.el.nativeElement.querySelector('#cancelBtn');
    const editBtn = this.el.nativeElement.querySelector('#editBtn');
    var delete_btn = document.getElementsByClassName('fa fa-trash');
    var pencil_btn = document.getElementsByClassName('fa fa-pencil');

    this.renderer.setStyle(saveBtn, 'display', 'none');
    this.renderer.setStyle(cancelBtn, 'display', 'none');
    this.renderer.setStyle(editBtn, 'display', 'inline-block');
    for (var i = 0; i < delete_btn.length; i++) {
      delete_btn[i].classList.remove('show');
      delete_btn[i].classList.add('hidden');
      pencil_btn[i].classList.remove('show');
      pencil_btn[i].classList.add('hidden');
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

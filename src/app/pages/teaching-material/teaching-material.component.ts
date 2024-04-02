import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { ActivatedRoute } from '@angular/router';
import { MaterialService } from 'service/teaching-material.service';
import { IMaterial } from 'src/app/models/material.model';

@Component({
  selector: 'app-teaching-material',
  templateUrl: './teaching-material.component.html',
  styleUrls: ['./teaching-material.component.scss']
})
export class TeachingMaterialComponent implements OnInit {
  msg:String = ''
  material_list:IMaterial[] = [];
  user_information: any = null;
  subjectParam: string | null = null;

  perPage: number = 10; 
  currentPage: number = 1;
  startIndex = (this.currentPage - 1) * this.perPage;
  endIndex = this.currentPage * this.perPage;
  displayedMaterials: IMaterial[] = [];

  constructor(private materialService: MaterialService,private route: ActivatedRoute,private fireAuth: AngularFireAuth,private storage: AngularFireStorage,private firestore: AngularFirestore){
    if (sessionStorage.getItem('user') !== null) {
      const sessionData = JSON.parse(sessionStorage.getItem('user')!);
      this.user_information = sessionData;
    }
  }

  ngOnInit(): void {
    const queryParams = this.route.snapshot.queryParams;
    this.subjectParam = queryParams['subject'];
    if (this.subjectParam === null){
      window.location.href='/material-list';
    }

    this.fireAuth.signInWithEmailAndPassword(
      this.user_information.data.email ,
      this.user_information.data.password
    ).then(() => {
      this.materialService.getMaterials(this.subjectParam!).subscribe((materials:IMaterial[]) => {
        this.material_list = materials;
        this.displayedMaterials = this.material_list.slice(this.startIndex, this.endIndex);
      })
    })
    .catch((err)=>{
      console.error(err);
    });

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
}

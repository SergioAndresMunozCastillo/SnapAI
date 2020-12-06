import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NavparamService } from '../navparam.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  data: any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private navParamService: NavparamService,
    private http: HttpClient) { 
   /*
    this.activatedRoute.paramMap.subscribe(
      (data) =>{
        
        console.log(data)
      }
    )
      */
     this.data = this.navParamService.getNavData()
   }

  onFeedback(id, name, image){
    console.log(id);
    let postData = {
      id: id,
      nombre: name,
      image: image
    };
    let headers = new HttpHeaders();
    headers.append("Content-Type", "application/json")
    this.http.post('http://localhost:8080/update', postData).subscribe( data => {
      console.log(data)
    }, error =>{
      console.log("El error es: " + error);
    });
    
  }
  ngOnInit() {
  }

}

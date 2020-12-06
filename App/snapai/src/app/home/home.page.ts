import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { NavparamService } from '../navparam.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
    snapChunk: any = [];
  constructor(private http: HttpClient, 
    private router: Router, 
    private location: Location,
    private navParamService: NavparamService) {}

  bringName(round){
    //console.log(round);
    let d = {
      'hero' : 'thanos',
      'villain' : 'kronk'
    }
    //console.log(JSON.stringify(round))
    this.navParamService.setNavData(round);
    this.router.navigate(['details']);
  }

  checkName(){
    


    this.http.get('http://localhost:8080/checkname').
    subscribe(data => {
      //console.log(data);
      this.snapChunk = data;
    });
    /*
    this.http.post('http://localhost:8080/checkname', {}, {}).then(
      data => {
          console.log ("datos : " + data.data);
      }
    ).catch(error => {
      console.log(error.error);
    });

    this.http.get('http://localhost:8080/checkname', {}, {}).then(
      data => {
          console.log ("datos : " + data.data);
      }
    ).catch(error => {
      console.log(error.error);
    }); */
  }
}
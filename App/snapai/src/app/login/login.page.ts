import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userChunk: any = []
  constructor(private http: HttpClient,
    private toastController: ToastController) { }

  async checkUser(name, pass){
    var toast;
    for(var i in this.userChunk){
      console.log(this.userChunk[i].nombre);
      if(name == this.userChunk[i].nombre){
        if(pass != this.userChunk[i].contr){
          toast= await this.toastController.create({
            message: "Contraseña incorrecta",
            duration: 2000
          });
          toast.present();
          return "";
        }else{
        toast= await this.toastController.create({
          message: "Iniciando sesion",
          duration: 2000
        });
        toast.present();
        return "";
      }
      }
    }
    toast= await this.toastController.create({
      message: "No existe semejante usuario",
      duration: 2000
    });
    toast.present();
  }
  ngOnInit() {
    this.http.get('http://localhost:8080/checkusers').
    subscribe(data => {
      this.userChunk = data;
    });
  }

}

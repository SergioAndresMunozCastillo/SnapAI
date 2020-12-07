import { Component, OnInit } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  users: any = []
  constructor(public toastController: ToastController,
    private http: HttpClient) { }

  async checkPass(name, pass1, pass2){
    var toast;
    if (pass1 == pass2) {
      toast= await this.toastController.create({
        message: "Usuario creado",
        duration: 2000
      });
    this.http.get('http://localhost:8080/checkusers').
    subscribe(data => {
      //console.log(data);
      this.users = data;
    });
    for(var i in this.users){
      console.log('Llegamos hasta aqui')
      if(this.users[i] == name){
        toast= await this.toastController.create({
          message: "El nombre de usuario ya existe",
          duration: 4000
        });
        toast.present();
        return "Nothing to see";
      }else{

      }
    }
    this.sendData(name, pass1);
    }else{
      toast= await this.toastController.create({
        message: "Las contraseñas no coinciden",
        duration: 2000
      });
    }
    toast.present();
  }

    sendData(name, pass){
      console.log('Tambien llegamos al senddata')
      const id = Date.now().toString();
      let postData = {
        id: id,
        nombre: name,
        contr: pass
      };
      let headers = new HttpHeaders();
      headers.append("Content-Type", "application/json")
      this.http.post('http://localhost:8080/createuser', postData).subscribe( data => {
        console.log(data)
      }, error =>{
        console.log("El error es: " + error);
      });
    }

  ngOnInit() {
  }

}

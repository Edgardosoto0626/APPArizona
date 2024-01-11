import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController, ToastController } from '@ionic/angular';
import { APIService } from 'src/app/service/api.service';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  isAlertOpen = false;
  alertButtons = ['OK'];
  mensaje: string ='';

  name : string = '';
  username : string = '';
  email : string = '';
  password : string = '';
  confirPassword: string = '';


  constructor(private router: Router, 
              private apiservi: APIService, 
              private loadingController: LoadingController,
              private toastController: ToastController) { }

  ngOnInit() {
  }

  setOpen(isOpen: boolean) {
    this.isAlertOpen = isOpen;
  }
  async presentToast(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 1500,
      position: 'bottom'
    });

    await toast.present();
  }

  registrar() {
    let that= this;
    this.loadingController.create({
      message: 'Almacenando persona...',
      spinner: 'lines'
    }).then(async data => {
      data.present();
      try {
            // Obtén los valores de los campos del formulario
    const nombre = this.name;
    const nombreUsuario = this.username;
    const email = this.email;

    if(this.name == '' && this.username == '' && this.email == '' && this.password== '' && this.confirPassword == ''){
      this.mensaje = 'Debe ingresar valores';
      this.isAlertOpen = true;
    }else 
        if(this.password === this.confirPassword){
          let password = that.password
          this.apiservi.Registrar(nombre, nombreUsuario,email,password).subscribe(
            (respuesta: any) => {
              if(respuesta.status === 200){
                console.log('Usuario creado con éxito');
                this.router.navigate(['login']);
              }else{
                that.presentToast('nombre de usuario ya existe');
              }
            }
          );
        } else {
          that.presentToast('Password no es igual a la ingresada');
        }
      } catch (error) {
      (error: HttpErrorResponse) => {
        // Manejar errores en la verificación del usuario
        console.error('Error al verificar usuario:', error);
      }       
        //TODO INDICAR QUE OCURRIÓ UN ERROR CON LA API
      }
      
      data.dismiss();
    });
    
  }
}

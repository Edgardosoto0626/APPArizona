import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { LoadingController, ToastController,AlertController } from '@ionic/angular';
import { APIService } from 'src/app/service/api.service';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  
  

  constructor(private apiservi: APIService, private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController, 
    private authService: AuthService, // Inyecta el servicio AuthService
    private alertController: AlertController
    ) { }

    
    isAlertOpen = false;
    alertButtons = ['OK'];
    username : string = '';
    password : string = '';
    validador: boolean = false;
    mensaje: string = '';
   

    ngOnInit() {
      const Usuario = localStorage.getItem('token');
      const Constraseña =localStorage.getItem('token2');
      if (Usuario != null && Constraseña != null ){
        this.autoIngresar();
      }
    } 

    limpiar() {
      this.username = '';
      this.password = '';
    }
    
    autoIngresar(){
      const that= this;
      const parametros: NavigationExtras = {
        state: {
          username : localStorage.getItem('token'),
          password : localStorage.getItem('token2')
        }
      };
        that.loadingController.create({
        message: 'Validando Usuario...',
        spinner: 'lines'
      }).then(async data => {
        data.present();
        try {
          const token: string | null = localStorage.getItem('token');
          const token2: string | null = localStorage.getItem('token2'); 
          if (token !== null && token2 !== null) {
            // Ambos tokens no son nulos, por lo tanto, se pueden pasar a la función
            that.apiservi.ingresar(token, token2).subscribe(
              (respuesta:any) => {
                if(respuesta.status === 200){
                  that.validador = true;
                  that.apiservi.validarLogin(that.validador, parametros);
                  that.limpiar();
                } else {
                  that.validador = false;
                  that.presentToast('Error al volver sesion');
                }
              }              
            );
          } else {
            // Manejar el caso cuando uno o ambos tokens son nulos
            console.error('Uno o ambos tokens son nulos.');
          }         
            }catch (error) {
              //TODO INDICAR QUE OCURRIÓ UN ERROR CON LA API
            }
            data.dismiss();
            
          })
        }

        async presentToast(mensaje: string) {
          const toast = await this.toastController.create({
            message: 'error',
            duration: 1500,
            position: 'bottom'
          });
        }
         
    login() {
      const usuario = this.username;
      const contrasena = this.password;
      localStorage.setItem('token', this.username);
      localStorage.setItem('token2', this.password);
  
      const parametros: NavigationExtras = {
        state: {
          usuario: this.username,
          clave: this.password
        }
      };
      if (this.username == '' && this.password == '') {
        this.mensaje = 'Debe ingresar valores';
        this.isAlertOpen = true;
        this.mostrarMensajeError();
      } else {
        this.apiservi.ingresar(usuario, contrasena).subscribe(
          (respuesta: any) => {
            if (respuesta.status === 200) {
            
              // Inicio de sesión exitoso
              console.log(
                'Inicio de sesión exitoso. Respuesta de la API:',
                respuesta
              );
                // Almacena el token de sesión en AuthService
              this.authService.setSessionToken(respuesta.sessionToken);
              // Establece al usuario como autenticado
              this.authService.setAuthenticated(true);
              localStorage.setItem('username', usuario);
              // Redirige al usuario a la página de inicio o a donde sea necesario
              this.validador = true;
              this.apiservi.validarLogin(this.validador, parametros);
              // this.router.navigate(['menu']);
            } else if(respuesta.status === 401) {
              // Credenciales inválidas
              this.mostrarMensajeError();
              console.error(
                'Credenciales inválidas. Respuesta de la API:',
                respuesta
                
              );
              // Puedes mostrar un mensaje de error o realizar alguna otra acción aquí
              this.mostrarMensajeError();
              console.log(respuesta);
              this.mensaje = 'Credenciales Inválidas';
              this.isAlertOpen = true;
              this.username = '';
              this.password = '';
            }
          },
          (error: HttpErrorResponse) => {
            // Manejar errores aquí
            console.error('Error al iniciar sesión:', error);
            this.mostrarMensajeError();
          }
        );
      }
    }
  
    setOpen(isOpen: boolean) {
      this.isAlertOpen = isOpen;
    }
    async mostrarMensajeError() {
      const alert = await this.alertController.create({
        header: 'Error de inicio de sesión',
        message: 'Usuario o contraseña incorrectos. Inténtalo de nuevo.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }


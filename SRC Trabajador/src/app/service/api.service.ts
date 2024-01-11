import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpClient,
              private router: Router) { }

  
  ruta: string = 'https://proyectotitulo-production-7bb1.up.railway.app/api/'
  validador: boolean= false;

  canActivate() {

    if (this.validador) {
      return true;
    } else {
      // Redirige al usuario a la página de inicio de sesión si no tiene un token de acceso
      this.router.navigate(['login']);
      return false;
    }
  }

  ingresar(username: string, password: string): Observable<HttpResponse<any>> {
    const parametros = {
          username: username,
          password: password
        };
    return this.http.post(this.ruta + 'log/', parametros , { observe: 'response' });
  }

  validarLogin(validador: any, parametros: any){
    if (validador){
      console.log(parametros);
      this.validador= true;
      this.router.navigate(['menu'], parametros);
    }else{
      this.validador = false;
    }
  }

  MostrarUsuario(){
    let that = this ;
     return new Promise(resolve => {
       resolve(that.http.get(that.ruta 
         + 'list-user/').toPromise())
     });
   }

   logout() {
    // Realiza una solicitud GET a la URL de cierre de sesión de la API.
    this.http.get(this.ruta + 'out/')
      .subscribe(
        response => {
          // Manejar la respuesta exitosa, por ejemplo, redirigir a la página de inicio de sesión.
         
          localStorage.removeItem('token');
          localStorage.removeItem('token2');
          localStorage.clear();
          this.router.navigate(['login']);
        },
        error => {
          console.error('Error al cerrar sesión:', error);
        }
      );
  }

  async enviarDatosAPI(data: any): Promise<any> {
    try {
      const endpoint = 'reserva/codigo/'; // Reemplaza con el endpoint de tu API
      const url = `${this.ruta}${endpoint}`;

      // Realizar una solicitud POST a la API con los datos del código de barras
      const response = await this.http.post(url, data).toPromise();
      return response;
    } catch (error) {
      throw new Error('Error al enviar datos a la API');
    }
  }

}

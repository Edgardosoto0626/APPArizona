import { Component, OnInit, ViewChild,ElementRef  } from '@angular/core';
import { Router } from '@angular/router';
import { APIService } from 'src/app/service/api.service';
import { LoadingController} from '@ionic/angular';
import { HttpResponse } from '@angular/common/http';
import * as QRCode from 'qrcode';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private router: Router, 
              private apiservi: APIService, 
              private loadingController: LoadingController,) {   this.obtenerReserva();}


  
@ViewChild('qrcodes', { static: true }) qrcodes: ElementRef | any;
    qrCodesWithTitles: { title: string; qrCode: string }[] = [];
    qrCodesGenerated = false;
    

  token = localStorage.getItem("token")
  token2 = localStorage.getItem("token2")
  qrCodeImages: string[] = [];
  showModal = false;
  username: string = '';
  nombreUsuario: string | null = null;

  reserva: any;

  ngOnInit() {
    try{
    this.nombreUsuario = localStorage.getItem('username');
    console.log('Nombre de usuario recuperado:', this.nombreUsuario);
     this.Obtenerusuario();
    }catch(error){
       this.router.navigate(['login']);
 }
}  

doRefresh(event: { target: { complete: () => void; }; }) {
  // Aquí puedes realizar acciones para actualizar el contenido, por ejemplo, cargar datos nuevamente desde una API
  this.obtenerReserva();
  console.log('Comenzando el evento de refresco', event);

  // Simulando una operación asincrónica (puedes reemplazar esto con tu lógica real)
  setTimeout(() => {
    console.log('Async operación completada');
    // Finalizar el evento de refresco
    event.target.complete();
  }, 2000);
}

async Obtenerusuario() {

  let that = this;

  that.loadingController.create({
    message: 'Obteniendo Información...',
    spinner: 'lines'
  }).then(async data => {
    data.present();
    try{
      that.apiservi.MostrarUsuario().then((data: any) =>
      {
        const usuariodeseado = data.find((username: any) => username.username === this.token);

        if(usuariodeseado){
          that.username = usuariodeseado.username;
        }else{
          console.error('Usuario no encontrado');
        }
      })
    }catch(error){
    }
    data.dismiss();
  });
}

obtenerReserva() {
this.apiservi.ObtenerReserva(this.token)
.then(data => {
  this.reserva = data;
  console.log(this.reserva);
});
}

 logout() {

  this.apiservi.logout();
  (Response: HttpResponse<any>) => {

    if(Response.status === 200){

      if (this.token !== null) {
        localStorage.removeItem(this.token);
      } else {
        console.error('El valor de token es nulo.');
      }
      
      if (this.token2 !== null) {
        localStorage.removeItem(this.token2);
      } else {
        console.error('El valor de token2 es nulo.');
      }
      localStorage.removeItem('token');
      localStorage.removeItem('token2');
      localStorage.clear();
    }
  }
}

async generateQRCodesWithTitles() {
  // Información estática para generar códigos QR
  const qrData = [
    { title: '2023-11-08', data: '59656106ff' },
    { title: '2023-12-13', data: '4fa6cc0095' },
    { title: '2023-12-12', data: '9a4466f08f' },
    { title: '2023-12-14', data: '7b962b27de' },
  ];

  // Generar códigos QR
  for (const data of qrData) {
    const qrCode = await QRCode.toDataURL(data.data);
    this.qrCodesWithTitles.push({ title: data.title, qrCode: qrCode });
  }

  this.qrCodesGenerated = true; // Marcar que los códigos QR han sido generados
}

async toggleModal() {
  if (!this.showModal) {
    if (!this.qrCodesGenerated) {
      await this.generateQRCodesWithTitles(); // Generar códigos QR si no han sido generados
    }
  }
  this.showModal = !this.showModal; // Cambiar el estado de visualización del modal
}

}

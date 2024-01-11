import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/service/api.service';
import { Router } from '@angular/router';
import { LoadingController} from '@ionic/angular';
import { HttpResponse } from '@angular/common/http';
import { AlertController } from '@ionic/angular';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';



@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {

  constructor(private apiservi: APIService, 
              private router: Router,
              private loadingController: LoadingController,
              private alertController: AlertController,
              ) { }

              isSupported = false;
              barcodes: Barcode[] = [];
              token = localStorage.getItem("token")
              token2 = localStorage.getItem("token2")
              nombreUsuario: string | null = null;
              username: string = '';


  ngOnInit() {
    BarcodeScanner.isSupported().then((result) => {
    this.isSupported = result.supported;
    });

    try{
      this.nombreUsuario = localStorage.getItem('username');
      console.log('Nombre de usuario recuperado:', this.nombreUsuario);
       this.Obtenerusuario();
      }catch(error){
         this.router.navigate(['login']);
   }
  }

  handleRefresh(event: { target: { complete: () => void; }; }) {
    setTimeout(() => {
      // Any calls to load data go here
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

  
async scan(): Promise<void> {

  try{
    const res = await BarcodeScanner.isGoogleBarcodeScannerModuleAvailable();

    if (!res.available) {
      await BarcodeScanner.installGoogleBarcodeScannerModule();
    }
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
  }catch (error){
    console.error('Error al escanear:', error);
  }
 }

  async sendButtonClicked(): Promise<void> {
    // Verificar si hay códigos escaneados antes de enviar a la API
    if (this.barcodes.length > 0) {
      // Enviar los datos a la API
      for (const barcode of this.barcodes) {
        try {
          const dataToSend = {
            codigo: barcode.rawValue,
            tipo: barcode.format
          };
          // Envío de datos a la API utilizando tu lógica de servicio ApiService
          const response = await this.apiservi.enviarDatosAPI(dataToSend);
          console.log('Respuesta de la API:', response);
          // Manejo de la respuesta
        } catch (error) {
          console.error('Error al enviar datos a la API:', error);
          // Manejo de errores
          const alert = await this.alertController.create({
            header: 'Reserva no encontrada',
            message: 'Por favor, escanea códigos de QR validos.',
            buttons: ['OK'],
          });
          await alert.present();
        }
      }
    } else {
      // Mostrar un mensaje si no hay códigos escaneados para enviar
      const alert = await this.alertController.create({
        header: 'No hay códigos escaneados',
        message: 'Por favor, escanea códigos QR antes de enviar.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  limpiarEscaneos(): void {
    this.barcodes = []; // Vaciar la lista de escaneos
    this.error();
  }

  async error(){
    const alert = await this.alertController.create({
      header: 'LIMPIADO',
      message: 'Se borraron codigos escaneados.',
      buttons: ['OK'],
    });
    await alert.present();
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso denegado',
      message: 'Porfavor otorga permisos a la camara para usar scanner.',
      buttons: ['OK'],
    });
    await alert.present();
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
 

}

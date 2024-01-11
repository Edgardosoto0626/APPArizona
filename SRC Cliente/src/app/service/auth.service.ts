import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private storageKey = 'isAuthenticated';
  private tokenKey = 'sessionToken';
  private userKey = 'username'; // Clave para almacenar el nombre de usuario en Local Storage

  setAuthenticated(value: boolean) {
    localStorage.setItem(this.storageKey, value.toString());
  }

  isAuthenticatedUser(): boolean {
    const storedValue = localStorage.getItem(this.storageKey);
    return storedValue ? storedValue === 'true' : false;
  }

  setSessionToken(token: string) {
    localStorage.setItem(this.tokenKey, token);
  }

  getSessionToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  setUsuario(username: string) {
    console.log('SetUsuario llamado con:', username);
    localStorage.setItem(this.userKey, username);
  }

  getUsuario(): string | null {
    const username = localStorage.getItem(this.userKey);
    console.log('GetUsuario retorna:', username);
    return username;
  }

  logout() {
    this.setAuthenticated(false);
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userKey);
    localStorage.removeItem(this.storageKey);
  }

  // ... otros métodos
}

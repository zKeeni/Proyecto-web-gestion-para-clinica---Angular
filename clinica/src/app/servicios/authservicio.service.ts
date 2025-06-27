import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { InLogin } from '../modelos/InLogin';
import { InResposeToken } from '../modelos/InResposeToken';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private ServidorUrl = 'http://localhost:3000/login';
  private claveToken = 'token';
  private isBrowser = typeof window !== 'undefined';

  constructor(private http: HttpClient, private router: Router) { }

  login(usuarioLogin: InLogin): Observable<InResposeToken> {
    return this.http.post<InResposeToken>(this.ServidorUrl, usuarioLogin).pipe(
      tap(response => {
        if (response && response.token) {
          this.guardarToken(response.token);
        }
      })
    );
  }

  guardarToken(token: string): void {
    if (this.isBrowser) {
      sessionStorage.setItem(this.claveToken, token);
  
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        sessionStorage.setItem('rol', payload.rol);
        // Almacena el código del médico, si existe; de lo contrario, puede quedar null
        sessionStorage.setItem('nombreUsuario', payload.nombreUsuario ? payload.nombreUsuario.toString() : null);
        sessionStorage.setItem('codigoMedico', payload.codigoMedico ? payload.codigoMedico.toString() : null);
        sessionStorage.setItem('nombresMedico', payload.nombresMedico ? payload.nombresMedico.toString() : null);

      } catch (error) {
        console.error('Error al decodificar el token:', error);
      }
    }
  }

  obtenerRol(): string | null {
    return this.isBrowser ? sessionStorage.getItem('rol') : '';
  }

  obtenerCodigoMedico(): string | null {
    return this.isBrowser ? sessionStorage.getItem('codigoMedico') : null;
  }
  obtenerNombresMedico(): string | null {
    return this.isBrowser ? sessionStorage.getItem('nombresMedico') : null;
  }
  obtenerNombreUsuario(): string | null {
    return this.isBrowser ? sessionStorage.getItem('nombreUsuario') : null;
  }

  getToken(): string | null {
      return sessionStorage.getItem(this.claveToken);
    
  }

  verificarAutenticacion(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (this.isBrowser) {
      sessionStorage.removeItem(this.claveToken);
      sessionStorage.removeItem('rol');
      sessionStorage.removeItem('codigoMedico');
      this.router.navigate(['/login']);
    }
  }
  cargarInfoUsuario():string{
     
    if (this.obtenerCodigoMedico()=='null') {
      const aux = this.obtenerNombreUsuario();
        return aux??'';
      
    }else{
         const aux = this.obtenerNombresMedico();
       return aux??'';
    }
  }

  canActivate(): boolean {
    const isAutorizado = this.verificarAutenticacion();
    const rol = this.obtenerRol();

    if (!isAutorizado || !rol) {
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}

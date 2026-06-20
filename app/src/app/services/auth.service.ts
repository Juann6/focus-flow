import { Injectable, signal } from '@angular/core';
import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private app = initializeApp(environment.firebaseConfig);
  private auth = getAuth(this.app);

  // Exponemos el usuario actual como un Signal de Angular
  public currentUser = signal<User | null>(null);
  // Un Signal para saber cuándo terminó de cargar el estado de auth inicial
  public authLoading = signal<boolean>(true);

  constructor() {
    onAuthStateChanged(this.auth, (user) => {
      this.currentUser.set(user);
      this.authLoading.set(false);
    });
  }

  /**
   * Iniciar sesión con email y contraseña
   */
  login(email: string, pass: string) {
    return signInWithEmailAndPassword(this.auth, email, pass);
  }

  /**
   * Registrar un nuevo usuario y asignarle su nombre
   */
  async register(email: string, pass: string, name: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, pass);
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      // Forzar actualización del Signal con el usuario actualizado
      this.currentUser.set({ ...userCredential.user });
    }
    return userCredential;
  }

  /**
   * Cerrar sesión del usuario
   */
  logout() {
    return signOut(this.auth);
  }

  /**
   * Enviar un correo para restablecer la contraseña
   */
  resetPassword(email: string) {
    return sendPasswordResetEmail(this.auth, email);
  }

  /**
   * Actualizar el nombre del perfil
   */
  async updateProfileName(name: string) {
    const user = this.auth.currentUser;
    if (user) {
      await updateProfile(user, { displayName: name });
      this.currentUser.set({ ...user });
    }
  }

  /**
   * Actualizar la foto de perfil del usuario en Firebase
   */
  async updateProfilePhoto(photoURL: string) {
    const user = this.auth.currentUser;
    if (user) {
      await updateProfile(user, { photoURL });
      this.currentUser.set({ ...user });
    }
  }
}

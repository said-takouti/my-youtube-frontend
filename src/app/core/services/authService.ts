import { Injectable, inject, signal, computed } from '@angular/core';
import { User } from '../models/user.model';
import { StorageService } from './storageService';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private storage = inject(StorageService);
  private readonly STORAGE_KEY = 'currentUser';
  private readonly USERS_KEY = 'users';

  private _currentUser = signal<User | null>(null);
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this._currentUser() !== null);

  constructor() {
    const saved = this.storage.get<User>(this.STORAGE_KEY);
    if (saved) this._currentUser.set(saved);
  }

  register(user: User): boolean {
    const users = this.storage.get<User[]>(this.USERS_KEY) || [];
    if (users.find((u) => u.username === user.username || u.email === user.email)) {
      return false;
    }
    users.push(user);
    this.storage.set(this.USERS_KEY, users);
    this._currentUser.set(user);
    this.storage.set(this.STORAGE_KEY, user);
    return true;
  }

  login(username: string, password: string): boolean {
    const users = this.storage.get<User[]>(this.USERS_KEY) || [];
    const user = users.find((u) => u.username === username && u.password === password);
    if (!user) return false;
    this._currentUser.set(user);
    this.storage.set(this.STORAGE_KEY, user);
    return true;
  }

  logout(): void {
    this._currentUser.set(null);
    this.storage.remove(this.STORAGE_KEY);
  }
}

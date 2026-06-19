import { Injectable, signal, computed, effect } from '@angular/core';
import { Video } from '../models/video.model';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  currentUser = signal<User | null>(null);
  playlist = signal<Video[]>([]);
  isAuthenticated = computed(() => this.currentUser() !== null);

  constructor() {
    const savedUser = localStorage.getItem('yt_user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      this.currentUser.set(user);
      this.loadPlaylist(user.username);
    }

    effect(() => {
      const user = this.currentUser();
      if (user) {
        localStorage.setItem(`yt_playlist_${user.username}`, JSON.stringify(this.playlist()));
      }
    });
  }

  register(user: User): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('yt_registered_users') || '[]');
    if (users.find((u) => u.username === user.username)) return false;

    users.push(user);
    localStorage.setItem('yt_registered_users', JSON.stringify(users));

    return this.login(user.username, user.password!);
  }

  login(username: string, password?: string): boolean {
    const users: User[] = JSON.parse(localStorage.getItem('yt_registered_users') || '[]');

    const foundUser = users.find((u) => u.username === username && u.password === password);
    if (!foundUser) return false;

    const sessionUser = { username: foundUser.username, email: foundUser.email };
    this.currentUser.set(sessionUser);
    localStorage.setItem('yt_user', JSON.stringify(sessionUser));
    this.loadPlaylist(username);
    return true;
  }

  logout() {
    this.currentUser.set(null);
    this.playlist.set([]);
    localStorage.removeItem('yt_user');
  }

  private loadPlaylist(username: string) {
    const savedPlaylist = localStorage.getItem(`yt_playlist_${username}`);
    this.playlist.set(savedPlaylist ? JSON.parse(savedPlaylist) : []);
  }

  addToPlaylist(video: Video) {
    if (!this.isAuthenticated()) return;
    const current = this.playlist();
    if (!current.some((v) => v.id === video.id)) {
      this.playlist.set([...current, video]);
    }
  }

  removeFromPlaylist(videoId: string) {
    this.playlist.set(this.playlist().filter((v) => v.id !== videoId));
  }
}

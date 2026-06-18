import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent {
  auth = inject(AuthService);

  videos = this.auth.playlist;

  removeVideo(id: string, event: Event) {
    event.stopPropagation();
    this.auth.removeFromPlaylist(id);
  }
}

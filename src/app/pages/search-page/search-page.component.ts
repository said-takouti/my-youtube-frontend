import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AuthService,  } from '../../core/services/auth.service';
import { Video } from '../../core/models/video.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.css',
})
export class SearchPageComponent {
  auth = inject(AuthService);
  searchControl = new FormControl('');
  isLoading = signal(false);
  videos = signal<Video[]>([]);

  private allVideos = signal<Video[]>([
    {
      id: '1',
      title: 'Learn Angular 18 in 10 Minutes',
      thumbnail: 'https://picsum.photos/300/200?random=1',
    },
    {
      id: '2',
      title: 'Building a YouTube Clone with Signals',
      thumbnail: 'https://picsum.photos/300/200?random=2',
    },
    {
      id: '3',
      title: 'TypeScript Best Practices 2026',
      thumbnail: 'https://picsum.photos/300/200?random=3',
    },
    {
      id: '4',
      title: 'Mastering Angular Control Flow (@if, @for)',
      thumbnail: 'https://picsum.photos/300/200?random=4',
    },
  ]);

  private searchQuery = signal('');

  filteredVideos = computed(() => {
    const query = this.searchQuery().toLowerCase().trim();
    if (!query) return this.allVideos();
    return this.allVideos().filter((video) => video.title.toLowerCase().includes(query));
  });

  onSearch() {
    this.isLoading.set(true);

    setTimeout(() => {
      this.searchQuery.set(this.searchControl.value || '');
      this.isLoading.set(false);
    }, 500);
  }

  addToPlaylist(video: Video) {
    this.auth.addToPlaylist(video);
  }

  isInPlaylist(videoId: string): boolean {
    return this.auth.playlist().some((v) => v.id === videoId);
  }
}

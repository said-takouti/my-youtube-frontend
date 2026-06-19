import { Component, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-video-page',
  standalone: true,
  imports: [],
  templateUrl: './video-page.component.html',
  styleUrl: './video-page.component.css',
})
export class VideoPageComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private sanitizer = inject(DomSanitizer);

  videoUrl = signal<SafeResourceUrl | null>(null);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const videoId = params.get('id');
      if (videoId) {
        const rawUrl = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
        this.videoUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(rawUrl));
      }
    });
  }
}

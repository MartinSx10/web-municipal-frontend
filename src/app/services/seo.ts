import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SeoService {
  setTitle(title: string) {
    document.title = title;
  }

  setDescription(content: string) {
    let tag = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!tag) {
      tag = document.createElement('meta');
      tag.name = 'description';
      document.head.appendChild(tag);
    }
    tag.content = content;
  }
}
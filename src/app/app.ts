import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterModule, NavigationStart, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SeoService } from './services/seo';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class AppComponent {
  // --- Back to top ---
  showBackToTop = false;

  // --- Dropdown Gobierno (desktop) ---
  govMenuOpen = false;

  // --- Mobile menu ---
  mobileMenuOpen = false;
  govMenuMobileOpen = false;
  
  constructor(private router: Router, private seo: SeoService) {

    
    // Cerrar menús cuando cambia de ruta
    this.router.events
      .pipe(filter((e) => e instanceof NavigationStart))
      .subscribe(() => {
        this.govMenuOpen = false;
        this.closeMobileMenu();
      });

      this.router.events
  .pipe(filter((e) => e instanceof NavigationEnd))
  .subscribe((e: any) => {
    const url = (e.urlAfterRedirects || e.url || '').split('?')[0];

    let title = 'Municipalidad Dpto San Martín — Ulapes';
    let desc  = 'Portal oficial del municipio: noticias, turismo, gobierno y contacto.';

    if (url.startsWith('/noticias')) {
      title = 'Novedades | Municipalidad Dpto San Martín — Ulapes';
      desc  = 'Últimas noticias oficiales del municipio.';
    } else if (url.startsWith('/turismo')) {
      title = 'Turismo | Municipalidad Dpto San Martín — Ulapes';
      desc  = 'Lugares, actividades y puntos de interés en Ulapes.';
    } else if (url.startsWith('/contacto')) {
      title = 'Contacto | Municipalidad Dpto San Martín — Ulapes';
      desc  = 'Canales oficiales de contacto, WhatsApp y ubicación.';
    } else if (url.startsWith('/gobierno/')) {
      const slug = url.split('/')[2] || '';
      const nice = slug
  .replace(/-/g, ' ')
  .replace(/\b\w/g, (c: string) => c.toUpperCase());
      title = `${nice} | Gobierno | Municipalidad Dpto San Martín`;
      desc  = `Información de ${nice}: responsable, horarios y ubicación.`;
    } else if (url === '/' || url === '') {
      title = 'Municipalidad Dpto San Martín — Ulapes';
      desc  = 'Portal oficial de la Municipalidad del Departamento San Martín (Ulapes, La Rioja).';
    }

    this.seo.setTitle(title);
    this.seo.setDescription(desc);
  });
  }

  // --- Scroll ---
  @HostListener('window:scroll')
  onScroll() {
    this.showBackToTop = window.scrollY > 250;
  }

  scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // --- Helpers: lock scroll ---
  private setBodyScrollLocked(locked: boolean) {
    document.body.style.overflow = locked ? 'hidden' : '';
  }

  // --- Gobierno desktop ---
  toggleGovMenu() {
    this.govMenuOpen = !this.govMenuOpen;
  }

  closeGovMenu() {
    this.govMenuOpen = false;
  }

  // --- Mobile menu ---
  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;

    // al abrir mobile, cerramos dropdown desktop
    if (this.mobileMenuOpen) this.govMenuOpen = false;

    // si cerramos, también cerramos el submenú
    if (!this.mobileMenuOpen) this.govMenuMobileOpen = false;

    this.setBodyScrollLocked(this.mobileMenuOpen);
  }

  closeMobileMenu() {
    if (!this.mobileMenuOpen && !this.govMenuMobileOpen) return;
    this.mobileMenuOpen = false;
    this.govMenuMobileOpen = false;
    this.setBodyScrollLocked(false);
  }

  toggleGovMenuMobile() {
    this.govMenuMobileOpen = !this.govMenuMobileOpen;
  }

  // Cerrar al hacer click afuera del dropdown (solo desktop)
  @HostListener('document:click', ['$event'])
  onDocClick(ev: MouseEvent) {
    if (!this.govMenuOpen) return;

    const target = ev.target as HTMLElement | null;
    if (!target) return;

    const inside = target.closest('[data-gov="true"]');
    if (!inside) this.govMenuOpen = false;
  }

  // Cerrar con ESC
  @HostListener('document:keydown.escape')
  onEsc() {
    this.govMenuOpen = false;
    this.closeMobileMenu();
  }
}
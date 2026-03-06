import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { NewsListComponent } from './pages/news-list/news-list';
import { NewsDetailComponent } from './pages/news-detail/news-detail';
import { ContactComponent } from './pages/contact/contact';
import { TourismComponent } from './pages/tourism/tourism';
import { TourismDetail } from './pages/tourism-detail/tourism-detail';
import { SecretariaComponent } from './pages/secretaria/secretaria';



export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },

  { path: 'noticias', component: NewsListComponent },
  { path: 'noticias/:slug', component: NewsDetailComponent },

  { path: 'contacto', component: ContactComponent },
 

  { path: 'turismo', component: TourismComponent },
  { path: 'turismo/:slug', component: TourismDetail },

  
  { path: 'gobierno/:slug', component: SecretariaComponent },
   

  { path: '**', redirectTo: '' },
  
];
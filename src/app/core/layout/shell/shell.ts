import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  auth = inject(AuthService);

  menuOpen = signal(false);

  links = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/opportunities', label: 'Oportunidades' },
    { path: '/kanban', label: 'Kanban' },
    { path: '/customers', label: 'Clientes' },
  ];

  toggleMenu() {
    this.menuOpen.update((open) => !open);
  }
}

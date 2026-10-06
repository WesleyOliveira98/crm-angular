import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-shell',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
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

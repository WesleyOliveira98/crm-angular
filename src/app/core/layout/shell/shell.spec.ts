import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { Shell } from './shell';

describe('Shell', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [Shell],
      providers: [provideRouter([])],
    });
  });

  it('should render the menu links', async () => {
    const fixture = TestBed.createComponent(Shell);
    await fixture.whenStable();

    const links = fixture.nativeElement.querySelectorAll('nav a');
    expect(links.length).toBe(4);
  });

  it('should toggle the mobile menu', () => {
    const fixture = TestBed.createComponent(Shell);
    fixture.componentInstance.toggleMenu();
    expect(fixture.componentInstance.menuOpen()).toBe(true);
  });
});

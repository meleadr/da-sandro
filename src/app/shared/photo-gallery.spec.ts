import { TestBed } from '@angular/core/testing';
import type { Photo } from '../../data/types';
import { PhotoGallery } from './photo-gallery';

const photo: Photo = { src: '/photos/camion.jpg', alt: 'Le camion', width: 1200, height: 900 };

async function render(photos: readonly Photo[], placeholders: boolean): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(PhotoGallery);
  fixture.componentRef.setInput('photos', photos);
  fixture.componentRef.setInput('placeholders', placeholders);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('PhotoGallery', () => {
  it('renders nothing without photos in production', async () => {
    const element = await render([], false);

    expect(element.querySelector('section')).toBeNull();
  });

  it('shows labelled frames when placeholders are on', async () => {
    const element = await render([], true);

    expect(element.querySelectorAll('li').length).toBe(6);
    expect(element.textContent).toContain('Photo à venir');
  });

  it('shows real photos instead of placeholders', async () => {
    const element = await render([photo], true);

    expect(element.querySelector('img')?.getAttribute('alt')).toBe('Le camion');
    expect(element.textContent).not.toContain('Photo à venir');
  });
});

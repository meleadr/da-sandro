import { TestBed } from '@angular/core/testing';
import type { GoogleReviews } from '../../data/types';
import { ReviewsSection } from './reviews-section';

const review = { author: 'Jeanne D.', rating: 5, text: 'Excellent !' };

async function render(reviews: GoogleReviews): Promise<HTMLElement> {
  const fixture = TestBed.createComponent(ReviewsSection);
  fixture.componentRef.setInput('reviews', reviews);
  await fixture.whenStable();
  return fixture.nativeElement as HTMLElement;
}

describe('ReviewsSection', () => {
  it('renders nothing without real data', async () => {
    const element = await render({ writeUrl: '', readUrl: '', items: [] });

    expect(element.querySelector('section')).toBeNull();
  });

  it('shows the call to action alone before the first review', async () => {
    const element = await render({
      writeUrl: 'https://g.page/r/test/review',
      readUrl: '',
      items: [],
    });

    expect(element.querySelector('a')?.getAttribute('href')).toBe('https://g.page/r/test/review');
    expect(element.querySelector('li')).toBeNull();
    expect(element.textContent).not.toContain('sélection');
  });

  it('states that reviews are a selection and links to all of them', async () => {
    const element = await render({
      writeUrl: '',
      readUrl: 'https://maps.example/reviews',
      items: [review],
    });

    expect(element.textContent).toContain("Une sélection d'avis publiés sur Google");
    expect(element.textContent).toContain('Jeanne D.');
    expect(element.querySelector('a')?.getAttribute('href')).toBe('https://maps.example/reviews');
  });

  it('gives the rating to screen readers', async () => {
    const element = await render({ writeUrl: '', readUrl: '', items: [review] });

    expect(element.querySelector('[role="img"]')?.getAttribute('aria-label')).toBe(
      '5 étoiles sur 5',
    );
    expect(element.querySelectorAll('fa-icon').length).toBe(5);
  });
});

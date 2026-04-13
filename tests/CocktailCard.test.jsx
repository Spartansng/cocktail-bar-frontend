import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';
import CocktailCard from '../src/components/CocktailCard';

const mockCocktail = {
  id: 1,
  nom: 'Mojito',
  categorie: 'Classique',
  prix: 12.5,
  image: null,
};

function renderCard(cocktail = mockCocktail) {
  return render(
    <MemoryRouter>
      <CocktailCard cocktail={cocktail} />
    </MemoryRouter>
  );
}

describe('CocktailCard', () => {
  it('displays the cocktail name', () => {
    renderCard();
    expect(screen.getByText('Mojito')).toBeInTheDocument();
  });

  it('displays the category', () => {
    renderCard();
    expect(screen.getByText('Classique')).toBeInTheDocument();
  });

  it('displays the price', () => {
    renderCard();
    expect(screen.getByText(/12.5/)).toBeInTheDocument();
  });

  it('shows placeholder when no image', () => {
    renderCard();
    expect(screen.getByText('🍸')).toBeInTheDocument();
  });

  it('links to cocktail detail', () => {
    renderCard();
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/cocktails/1');
  });
});

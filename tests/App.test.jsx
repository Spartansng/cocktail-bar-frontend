import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import App from '../src/App';
import { AuthProvider } from '../src/context/AuthContext';

vi.mock('../src/api/client', () => ({
  getCocktails: vi.fn().mockResolvedValue([]),
  login: vi.fn(),
}));

function renderApp(route = '/') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>
  );
}

describe('App', () => {
  it('renders the navbar', () => {
    renderApp();
    expect(screen.getByText('Cocktail Bar')).toBeInTheDocument();
  });

  it('renders the home page by default', async () => {
    renderApp();
    await waitFor(() => {
      expect(screen.getByText('Notre Carte')).toBeInTheDocument();
    });
  });

  it('navigates to login page', () => {
    renderApp('/admin/login');
    expect(screen.getByText('Connexion Admin')).toBeInTheDocument();
  });
});

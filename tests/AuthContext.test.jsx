import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { AuthProvider, useAuth } from '../src/context/AuthContext';

vi.mock('../src/api/client', () => ({
  login: vi.fn().mockResolvedValue({
    token: 'fake-token',
    user: { id: 1, identifiant: 'testuser1', role: 'admin', nom: 'Test', prenom: 'User' },
  }),
}));

function TestComponent() {
  const { user, token, login, logout, isAdmin, isStaff } = useAuth();
  return (
    <div>
      <p data-testid="user">{user ? user.identifiant : 'none'}</p>
      <p data-testid="token">{token || 'none'}</p>
      <p data-testid="admin">{isAdmin ? 'yes' : 'no'}</p>
      <p data-testid="staff">{isStaff ? 'yes' : 'no'}</p>
      <button onClick={() => login('testuser1', 'Password123!xx')}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no user', () => {
    render(<AuthProvider><TestComponent /></AuthProvider>);
    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('token')).toHaveTextContent('none');
  });

  it('logs in and stores user', async () => {
    const user = userEvent.setup();
    render(<AuthProvider><TestComponent /></AuthProvider>);

    await user.click(screen.getByText('Login'));

    expect(screen.getByTestId('user')).toHaveTextContent('testuser1');
    expect(screen.getByTestId('token')).toHaveTextContent('fake-token');
    expect(screen.getByTestId('admin')).toHaveTextContent('yes');
    expect(screen.getByTestId('staff')).toHaveTextContent('yes');
  });

  it('logs out and clears state', async () => {
    const user = userEvent.setup();
    render(<AuthProvider><TestComponent /></AuthProvider>);

    await user.click(screen.getByText('Login'));
    await user.click(screen.getByText('Logout'));

    expect(screen.getByTestId('user')).toHaveTextContent('none');
    expect(screen.getByTestId('token')).toHaveTextContent('none');
  });
});

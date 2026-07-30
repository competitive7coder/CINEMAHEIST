import { render, screen } from '@testing-library/react';
import App from './App';

test('renders CinemaHeist branding on initial load', () => {
  render(<App />);
  const brandingElements = screen.getAllByText(/CinemaHeist/i);
  expect(brandingElements.length).toBeGreaterThan(0);
});

import { render, screen } from '@testing-library/react';
import App from './App';

test('renders streamhub branding on initial load', () => {
  render(<App />);
  const brandingElements = screen.getAllByText(/streamhub/i);
  expect(brandingElements.length).toBeGreaterThan(0);
});

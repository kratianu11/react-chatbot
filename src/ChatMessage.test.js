import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ChatMessage from './components/ChatMessage';

const mockMessage = {
  id: 1,
  text: 'Hello, world!',
  createdAt: Date.now(),
  ai: false,
};

const mockRetryMessage = jest.fn();

describe('ChatMessage', () => {
  test('renders message text', () => {
    render(<ChatMessage message={mockMessage} retryMessage={mockRetryMessage} />);
    expect(screen.getByText('Hello, world!')).toBeInTheDocument();
  });

  test('copy button works', async () => {
    // Mock clipboard API
    Object.assign(navigator, {
      clipboard: {
        writeText: jest.fn(() => Promise.resolve()),
      },
    });

    render(<ChatMessage message={mockMessage} retryMessage={mockRetryMessage} />);
    const copyButton = screen.getByTitle('Copy message');
    fireEvent.click(copyButton);

    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('Hello, world!');
    expect(await screen.findByText('Copied!')).toBeInTheDocument();
  });

  test('shows timestamp', () => {
    render(<ChatMessage message={mockMessage} retryMessage={mockRetryMessage} />);
    // Check if timestamp is rendered (exact format may vary)
    expect(screen.getByText(/ago|at/)).toBeInTheDocument();
  });
});

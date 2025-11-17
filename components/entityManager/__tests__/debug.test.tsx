import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';

describe('Debug RTL', () => {
  it('should find label with child span', () => {
    render(
      <div>
        <label htmlFor="test">
          Test Label
          <span aria-hidden="true">*</span>
        </label>
        <input id="test" type="text" />
      </div>
    );

    // Try different query methods
    // const byLabel = screen.getByLabelText('Test Label'); // This fails with child spans!
    
    const byRole = screen.getByRole('textbox', { name: /Test Label/i });
    expect(byRole).toBeInTheDocument();
  });
});

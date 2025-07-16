import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import CrashComponent from './CrashComponent';

describe('CrashComponent', () => {
  it('crashes on mount', () => {
    expect(() => render(<CrashComponent />)).toThrow('Simulated crash');
  });
});

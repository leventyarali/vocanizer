import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { WordForm } from '@/components/content/words/word-form';
import { WordFormData } from '@/lib/types/word';

describe('WordForm', () => {
  const mockOnSubmit = jest.fn();
  const defaultProps = {
    onSubmit: mockOnSubmit,
    isLoading: false,
  };

  beforeEach(() => {
    mockOnSubmit.mockClear();
  });

  it('renders all form fields correctly', () => {
    render(<WordForm {...defaultProps} />);

    // Base form fields
    expect(screen.getByLabelText(/kelime/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/kelime türü/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/cefr seviyesi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/aktif/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/herkese açık/i)).toBeInTheDocument();
  });

  it('submits form with correct data', async () => {
    render(<WordForm {...defaultProps} />);

    // Fill base form
    await userEvent.type(screen.getByLabelText(/kelime/i), 'test');
    await userEvent.click(screen.getByRole('button', { name: /kaydet/i }));

    // Move to types form
    await userEvent.type(screen.getByLabelText(/tür 1/i), 'noun');
    await userEvent.click(screen.getByRole('button', { name: /kaydet/i }));

    // Move to meanings form
    await userEvent.type(screen.getByLabelText(/anlam/i), 'test meaning');
    await userEvent.click(screen.getByRole('button', { name: /kaydet/i }));

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          base: expect.objectContaining({
            word: 'test',
          }),
          types: expect.objectContaining({
            types: [{ type: 'noun' }],
          }),
          meanings: expect.objectContaining({
            meanings: [
              expect.objectContaining({
                meaning: 'test meaning',
              }),
            ],
          }),
        })
      );
    });
  });

  it('shows validation errors for required fields', async () => {
    render(<WordForm {...defaultProps} />);

    // Try to submit without filling required fields
    await userEvent.click(screen.getByRole('button', { name: /kaydet/i }));

    expect(screen.getByText(/kelime alanı zorunludur/i)).toBeInTheDocument();
  });

  it('handles loading state correctly', () => {
    render(<WordForm {...defaultProps} isLoading={true} />);

    expect(screen.getByRole('button', { name: /kaydediliyor/i })).toBeDisabled();
  });

  it('pre-fills form with default values', () => {
    const defaultValues: Partial<WordFormData> = {
      base: {
        word: 'test',
        part_of_speech: 'noun',
        cefr_level: 'A1',
        is_active: true,
        is_public: false,
      },
    };

    render(<WordForm {...defaultProps} defaultValues={defaultValues} />);

    expect(screen.getByLabelText(/kelime/i)).toHaveValue('test');
  });
}); 
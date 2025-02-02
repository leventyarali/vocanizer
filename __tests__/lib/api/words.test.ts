import '@testing-library/jest-dom';
import { createClient } from '@/lib/supabase/server';
import { getWords, getWord, createWord, updateWord, deleteWord } from '@/lib/api/words';
import { WordFormData } from '@/lib/types/word';

type WordResponse = {
  id: string;
  word: string;
};

type MockResponse<T> = {
  data: T;
  error: Error | null;
};

type MockSupabaseClient = {
  from: jest.Mock<any>;
};

jest.mock('@/lib/supabase/server');

describe('Word API', () => {
  let mockSupabase: MockSupabaseClient;

  beforeEach(() => {
    mockSupabase = {
      from: jest.fn(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => ({
            data: [{ id: '1', word: 'test' }] as WordResponse[],
            error: null as Error | null,
          })),
          eq: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { id: '1', word: 'test' } as WordResponse,
              error: null as Error | null,
            })),
          })),
        })),
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => ({
              data: { id: '1', word: 'test' } as WordResponse,
              error: null as Error | null,
            })),
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: { id: '1', word: 'test' } as WordResponse,
            error: null as Error | null,
          })),
        })),
        delete: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: { id: '1', word: 'test' } as WordResponse,
            error: null as Error | null,
          })),
        })),
      })),
    };

    (createClient as jest.Mock).mockReturnValue(mockSupabase);
  });

  describe('getWords', () => {
    it('fetches words successfully', async () => {
      const words = await getWords();
      expect(words).toEqual([{ id: '1', word: 'test' }]);
      expect(mockSupabase.from).toHaveBeenCalledWith('v_word_list');
    });

    it('throws error when fetch fails', async () => {
      const mockResponse: MockResponse<WordResponse[]> = {
        data: [],
        error: new Error('Failed to fetch'),
      };

      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => ({
          order: jest.fn(() => mockResponse),
        })),
      }));

      mockSupabase.from = mockFrom;

      await expect(getWords()).rejects.toThrow('Failed to fetch');
    });
  });

  describe('getWord', () => {
    it('fetches single word successfully', async () => {
      const word = await getWord('1');
      expect(word).toEqual({ id: '1', word: 'test' });
      expect(mockSupabase.from).toHaveBeenCalledWith('words');
    });

    it('throws error when word not found', async () => {
      const mockResponse: MockResponse<WordResponse> = {
        data: {} as WordResponse,
        error: new Error('Word not found'),
      };

      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            single: jest.fn(() => mockResponse),
          })),
        })),
      }));

      mockSupabase.from = mockFrom;

      await expect(getWord('1')).rejects.toThrow('Word not found');
    });
  });

  describe('createWord', () => {
    const mockWordData: WordFormData = {
      base: {
        word: 'test',
        part_of_speech: 'noun',
        cefr_level: 'A1',
        is_active: true,
        is_public: false,
      },
      types: {
        types: [{ type: 'noun' }],
      },
      meanings: {
        meanings: [
          {
            meaning: 'test meaning',
            notes: 'test notes',
            definitions: [
              {
                language: 'tr',
                definition_type: 'general',
                definition: 'test definition',
              },
            ],
            examples: [
              {
                language: 'tr',
                text: 'test example',
                translation: 'test translation',
              },
            ],
          },
        ],
      },
    };

    it('creates word successfully', async () => {
      const word = await createWord(mockWordData);
      expect(word).toEqual({ id: '1', word: 'test' });
      expect(mockSupabase.from).toHaveBeenCalledWith('words');
    });

    it('throws error when creation fails', async () => {
      const mockResponse: MockResponse<WordResponse> = {
        data: {} as WordResponse,
        error: new Error('Failed to create'),
      };

      const mockFrom = jest.fn(() => ({
        insert: jest.fn(() => ({
          select: jest.fn(() => ({
            single: jest.fn(() => mockResponse),
          })),
        })),
      }));

      mockSupabase.from = mockFrom;

      await expect(createWord(mockWordData)).rejects.toThrow('Failed to create');
    });
  });

  describe('updateWord', () => {
    const mockWordData: WordFormData = {
      base: {
        word: 'updated',
        part_of_speech: 'noun',
        cefr_level: 'A1',
        is_active: true,
        is_public: false,
      },
      types: {
        types: [{ type: 'noun' }],
      },
      meanings: {
        meanings: [
          {
            meaning: 'updated meaning',
            notes: 'updated notes',
            definitions: [
              {
                language: 'tr',
                definition_type: 'general',
                definition: 'updated definition',
              },
            ],
            examples: [
              {
                language: 'tr',
                text: 'updated example',
                translation: 'updated translation',
              },
            ],
          },
        ],
      },
    };

    it('updates word successfully', async () => {
      const mockFrom = jest.fn(() => ({
        select: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: [],
            error: null,
          })),
        })),
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: { id: '1', word: 'test' } as WordResponse,
            error: null as Error | null,
          })),
        })),
      }));

      mockSupabase.from = mockFrom;

      await updateWord('1', mockWordData);
      expect(mockSupabase.from).toHaveBeenCalledWith('words');
    });

    it('throws error when update fails', async () => {
      const mockResponse: MockResponse<WordResponse> = {
        data: {} as WordResponse,
        error: new Error('Failed to update'),
      };

      const mockFrom = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => mockResponse),
        })),
      }));

      mockSupabase.from = mockFrom;

      await expect(updateWord('1', mockWordData)).rejects.toThrow('Failed to update');
    });
  });

  describe('deleteWord', () => {
    it('deletes word successfully', async () => {
      const mockFrom = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => ({
            data: { id: '1', word: 'test' } as WordResponse,
            error: null as Error | null,
          })),
        })),
      }));

      mockSupabase.from = mockFrom;

      await deleteWord('1');
      expect(mockSupabase.from).toHaveBeenCalledWith('words');
    });

    it('throws error when deletion fails', async () => {
      const mockResponse: MockResponse<WordResponse> = {
        data: {} as WordResponse,
        error: new Error('Failed to delete'),
      };

      const mockFrom = jest.fn(() => ({
        update: jest.fn(() => ({
          eq: jest.fn(() => mockResponse),
        })),
      }));

      mockSupabase.from = mockFrom;

      await expect(deleteWord('1')).rejects.toThrow('Failed to delete');
    });
  });
}); 
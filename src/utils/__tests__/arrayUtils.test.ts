import { shuffleArray } from '../arrayUtils';

describe('arrayUtils', () => {
  describe('shuffleArray', () => {
    it('should return an array with the same length', () => {
      const input = [1, 2, 3, 4, 5];
      const result = shuffleArray(input);
      expect(result).toHaveLength(input.length);
    });

    it('should contain all original elements', () => {
      const input = ['a', 'b', 'c', 'd', 'e'];
      const result = shuffleArray(input);
      
      input.forEach(item => {
        expect(result).toContain(item);
      });
    });

    it('should not modify the original array', () => {
      const input = [1, 2, 3, 4, 5];
      const original = [...input];
      shuffleArray(input);
      expect(input).toEqual(original);
    });

    it('should handle empty arrays', () => {
      const input: number[] = [];
      const result = shuffleArray(input);
      expect(result).toEqual([]);
    });

    it('should handle single-element arrays', () => {
      const input = [42];
      const result = shuffleArray(input);
      expect(result).toEqual([42]);
    });

    it('should produce different results over multiple calls (statistical test)', () => {
      const input = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      const results = [];
      
      // Run shuffle 10 times
      for (let i = 0; i < 10; i++) {
        results.push(shuffleArray(input).join(','));
      }
      
      // At least some results should be different (very high probability)
      const uniqueResults = new Set(results);
      expect(uniqueResults.size).toBeGreaterThan(1);
    });

    it('should work with objects', () => {
      const input = [
        { id: 1, name: 'Alice' },
        { id: 2, name: 'Bob' },
        { id: 3, name: 'Charlie' }
      ];
      const result = shuffleArray(input);
      
      expect(result).toHaveLength(3);
      expect(result).toContainEqual({ id: 1, name: 'Alice' });
      expect(result).toContainEqual({ id: 2, name: 'Bob' });
      expect(result).toContainEqual({ id: 3, name: 'Charlie' });
    });
  });
}); 
import { mapObjectArray } from './arrayUtilities';

describe('arrayUtilities', () => {
  describe('mapObjectArray', () => {
    test('should return correctly mapped array', () => {
      const targetArray = [{ id: 1, foo: 'test' }];
      const sourceArray = [{ id: 1, bar: 'test' }];

      expect(mapObjectArray(targetArray, sourceArray, 'id')).toEqual([
        [
          { id: 1, foo: 'test' },
          { id: 1, bar: 'test' },
        ],
      ]);
    });
  });
});

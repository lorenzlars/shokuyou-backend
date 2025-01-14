export function mapObjectArray<
  TTarget extends object | Record<string, unknown>,
  TSource extends object | Record<string, unknown>,
>(target: TTarget[], source: TSource[], key: string) {
  const targetMap = new Map<unknown, [TTarget, TSource | undefined]>(
    target.map((obj) => [obj[key], [obj, undefined]]),
  );

  source.forEach((obj) => {
    if (targetMap.has(obj[key])) {
      targetMap.set(obj[key], [targetMap.get(obj[key])[0], obj]);
    } else {
      targetMap.set(obj[key], [undefined, obj]);
    }
  });

  return Array.from(targetMap.values());
}

export function removeDuplicates(strings: string[]) {
  return [...new Set(strings)];
}

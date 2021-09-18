export const narrowingIncludes = <T>(
  array: ReadonlyArray<T>,
  searchElement: any
): searchElement is T => array.includes(searchElement as T)

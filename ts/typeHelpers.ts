export const narrowingIncludes = <U, T extends U>(
  array: T[],
  searchElement: U
): searchElement is T => array.includes(searchElement as T)

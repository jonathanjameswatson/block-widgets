import 'reflect-metadata'

export const collectMetadataArray = <T extends Object>(
  metadataKey: any,
  target: T
) => {
  const array = []
  let currentPrototype = Object.getPrototypeOf(target)
  while (currentPrototype !== Object.prototype) {
    const currentArray =
      Reflect.getOwnMetadata(metadataKey, currentPrototype) || []
    array.push(...currentArray)
    currentPrototype = Object.getPrototypeOf(currentPrototype)
  }
  return array
}

export const collectMetadataPropertyValue = <T extends Object>(
  metadataKey: any,
  target: T,
  propertyKey: keyof T
) => {
  if (typeof propertyKey === 'number') {
    return undefined
  }

  let currentPrototype = Object.getPrototypeOf(target)
  while (currentPrototype !== Object.prototype) {
    const current = Reflect.getOwnMetadata(
      metadataKey,
      currentPrototype,
      propertyKey
    )
    if (current !== undefined) {
      return current
    }
    currentPrototype = Object.getPrototypeOf(currentPrototype)
  }
  return undefined
}

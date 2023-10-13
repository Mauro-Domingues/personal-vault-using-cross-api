import { IObjectDTO } from '@dtos/IObjectDTO';

/**
 * PATCH OBJECT -> Takes as parameter an entity and an object, maps the object, and returns the entity with the patched properties. Empty or non-entity-type properties are discarded.
 * @param oldAttributes Entity
 * @param newAttributes Object
 * @returns Entity
 */
export function mapAndPatchAttribute<
  Entity extends object,
  DTO extends Partial<Entity>,
>(oldAttributes: Entity, newAttributes: DTO): Entity {
  const isValid = (field: unknown) => field && field !== '';
  Object.keys(newAttributes).forEach(attribute => {
    if (
      Object.prototype.hasOwnProperty.call(oldAttributes, attribute) &&
      (oldAttributes as IObjectDTO)[attribute]
    ) {
      let newValue = (newAttributes as IObjectDTO)[attribute];
      if (!isValid(newValue)) {
        return;
      }
      if (Array.isArray(newValue)) {
        newValue = newValue.map((item, index) => {
          let oldItem = (oldAttributes as { [key: string]: Array<IObjectDTO> })[
            attribute
          ][index];
          if ('id' in item && !isValid(item.id)) {
            const exists = (
              oldAttributes as { [key: string]: Array<IObjectDTO> }
            )[attribute].find(oldItem => oldItem.id === item.id);
            if (exists) oldItem = exists;
          }
          if (
            (typeof item === 'object' &&
              item !== null &&
              !Array.isArray(item)) ||
            (Array.isArray(item) && item.some(Array.isArray))
          ) {
            return mapAndPatchAttribute(oldItem, item as IObjectDTO);
          }
          if (!isValid(item)) {
            return oldItem;
          }
          return item;
        });
        Object.assign(oldAttributes, { [attribute]: newValue });
      } else if (typeof newValue === 'object' && newValue !== null) {
        (oldAttributes as IObjectDTO)[attribute] = mapAndPatchAttribute(
          (oldAttributes as IObjectDTO)[attribute] as IObjectDTO,
          newValue as IObjectDTO,
        );
      } else {
        Object.assign(oldAttributes, { [attribute]: newValue });
      }
    }
  });
  return oldAttributes;
}

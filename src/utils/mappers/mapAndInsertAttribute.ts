import { IObjectDTO } from '@dtos/IObjectDTO';

/**
 * PATCH AND INSERT -> Takes as a parameter an entity and an object, maps the object and returns the entity with the patched properties. Considers non-entity-type properties but empty values sent are discarded.
 * @param oldAttributes Entity
 * @param newAttributes Object
 * @returns Entity
 */
export function mapAndInsertAttribute<
  Entity extends object,
  DTO extends Partial<Entity>,
>(oldAttributes: Entity, newAttributes: DTO): Entity {
  const isValid = (field: unknown) => field && field !== '';
  Object.keys(newAttributes).forEach(attribute => {
    let newValue = (newAttributes as IObjectDTO)[attribute];
    if (!isValid(newValue)) {
      return;
    }
    if (Array.isArray(newValue)) {
      newValue = newValue.map((item, index) => {
        let oldItem = (oldAttributes as { [key: string]: Array<IObjectDTO> })[
          attribute
        ]
          ? (oldAttributes as { [key: string]: Array<IObjectDTO> })[attribute][
              index
            ]
          : undefined;
        if (
          !isValid(item.id) &&
          Array.isArray((oldAttributes as IObjectDTO)[attribute]) &&
          'id' in item
        ) {
          const exists = (
            oldAttributes as { [key: string]: Array<IObjectDTO> }
          )[attribute].find(oldItem => oldItem.id === item.id);
          if (exists) oldItem = exists;
        }
        if (
          (typeof item === 'object' && item !== null && !Array.isArray(item)) ||
          (Array.isArray(item) && item.some(Array.isArray))
        ) {
          return oldItem
            ? mapAndInsertAttribute(oldItem, item as IObjectDTO)
            : item;
        }
        if (!isValid(item)) {
          return oldItem;
        }
        return item;
      });
    } else if (typeof newValue === 'object' && newValue !== null) {
      newValue = (oldAttributes as IObjectDTO)[attribute]
        ? mapAndInsertAttribute(
            (oldAttributes as IObjectDTO)[attribute] as IObjectDTO,
            newValue as IObjectDTO,
          )
        : newValue;
    }
    oldAttributes = { ...oldAttributes, [attribute]: newValue };
  });
  return oldAttributes;
}

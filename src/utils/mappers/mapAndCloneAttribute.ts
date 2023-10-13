import { IObjectDTO } from '@dtos/IObjectDTO';

/**
 * CLONE VALUES -> Receives as parameter a string array and another object of type { [key: string]: string }, returns an array of objects with the same value, is useful for queries find WHERE + OR.
 * @param attribute IObjectDTO
 * @returns Promise: Array<IObjectDTO>
 * @param params Array<string>
 */
export function mapAndCloneAttribute(
  attribute: IObjectDTO,
  params: Array<string>,
): Array<IObjectDTO> {
  const objectArray: Array<IObjectDTO> = params.map((param: string) => {
    return {
      [param]: Object.values(attribute)[0],
    };
  });

  return objectArray;
}

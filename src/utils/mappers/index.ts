import { mapAndCloneAttribute } from './mapAndCloneAttribute';
import { mapAndInsertAttribute } from './mapAndInsertAttribute';
import { mapAndPatchAttribute } from './mapAndPatchAttribute';
import { mapAndPatchStringify } from './mapAndPatchString';
import { mapAndUpdateAttribute } from './mapAndUpdateAttribute';
import { mapAndUpdateStringify } from './mapAndUpdateString';

export {
  mapAndInsertAttribute as insertAttribute,
  mapAndUpdateAttribute as updateAttribute,
  mapAndUpdateStringify as updateStringify,
  mapAndCloneAttribute as cloneAttribute,
  mapAndPatchAttribute as patchAttribute,
  mapAndPatchStringify as patchStringify,
};

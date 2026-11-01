// Set by the `development` and `preview` configurations in angular.json. It stays undefined in a
// plain production build, so placeholders can never reach the live site by accident.
declare const PHOTO_PLACEHOLDERS: boolean | undefined;

export const showPhotoPlaceholders =
  typeof PHOTO_PLACEHOLDERS !== 'undefined' && PHOTO_PLACEHOLDERS === true;

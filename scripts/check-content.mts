import { business } from '../src/data/business.ts';
import { menu } from '../src/data/menu.ts';
import { places } from '../src/data/places.ts';
import { schedule } from '../src/data/schedule.ts';
import { findPublishErrors } from '../src/data/validate-content.ts';

const errors = findPublishErrors({ business, places, schedule, menu });

if (errors.length > 0) {
  console.error(`Content is not ready for production (${errors.length}):`);
  for (const error of errors) {
    console.error(`  - ${error}`);
  }
  process.exit(1);
}

console.log('Content is ready for production.');

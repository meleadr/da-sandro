import { business } from './business';
import { menu } from './menu';
import { places } from './places';
import { schedule } from './schedule';
import type { SiteContent } from './types';

export const siteContent: SiteContent = { business, places, schedule, menu };

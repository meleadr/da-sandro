/** Provisional content can be displayed in development but blocks production builds. */
export interface Draftable {
  readonly provisional: boolean;
}

export interface Business extends Draftable {
  readonly name: string;
  readonly legalName: string;
  /** International format, for example +32470123456. */
  readonly phone: string;
  readonly email: string;
  /** Displayed in the legal notice only: the business has no public address. */
  readonly legalAddress: string;
  readonly companyNumber: string;
  readonly areaServed: string;
  readonly socialLinks: readonly SocialLink[];
}

export interface SocialLink {
  readonly network: 'facebook' | 'instagram' | 'tiktok';
  readonly url: string;
}

export interface Place extends Draftable {
  /** Used in /emplacements/<slug>. */
  readonly slug: string;
  readonly name: string;
  readonly address: string;
  readonly postalCode: string;
  readonly city: string;
  /** Text specific to this stop, so its page is not a thin duplicate. */
  readonly description: string;
}

/** ISO weekday: 1 is Monday, 7 is Sunday. */
export type Weekday = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface WeeklyService {
  readonly weekday: Weekday;
  readonly placeSlug: string;
  /** Brussels local time, HH:MM. */
  readonly start: string;
  readonly end: string;
}

export interface CancelledDate {
  readonly kind: 'cancelled';
  /** YYYY-MM-DD */
  readonly date: string;
  readonly start?: string;
}

export interface OneOffService {
  readonly kind: 'one-off';
  /** YYYY-MM-DD */
  readonly date: string;
  readonly placeSlug: string;
  readonly start: string;
  readonly end: string;
}

export type ScheduleException = CancelledDate | OneOffService;

export interface Schedule extends Draftable {
  readonly weekly: readonly WeeklyService[];
  readonly exceptions: readonly ScheduleException[];
}

export interface MenuItem {
  readonly name: string;
  /** Empty for drinks. */
  readonly ingredients: readonly string[];
  /** Euro cents. Null until the real price is known. */
  readonly priceCents: number | null;
}

export interface MenuCategory {
  readonly name: string;
  readonly items: readonly MenuItem[];
}

export interface Menu extends Draftable {
  readonly categories: readonly MenuCategory[];
  readonly note: string;
}

export interface SiteContent {
  readonly business: Business;
  readonly places: readonly Place[];
  readonly schedule: Schedule;
  readonly menu: Menu;
}

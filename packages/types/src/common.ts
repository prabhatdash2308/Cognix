/**
 * Common primitive and utility types shared across the Cognix domain.
 */

/** Branded string identifier to avoid mixing ids of different entities. */
export type Id<TBrand extends string> = string & { readonly __brand: TBrand };

/** ISO-8601 timestamp string (UTC). */
export type ISODateString = string;

/** Fields attached to every persisted entity. */
export interface Timestamped {
  readonly createdAt: ISODateString;
  readonly updatedAt: ISODateString;
}

/** Make selected keys of `T` optional. */
export type WithOptional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

/** A value that may still be loading. */
export type Nullable<T> = T | null;

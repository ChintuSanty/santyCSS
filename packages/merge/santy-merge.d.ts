/**
 * @santycss/merge — conflict-aware class merging.
 *
 *   import { cn } from 'santycss/merge';
 *   cn('add-padding-24', 'add-padding-8')  // → 'add-padding-8'
 */

/** Anything clsx accepts: strings, arrays, and `{ 'class': condition }` maps. */
export type ClassValue =
  | string
  | number
  | null
  | undefined
  | false
  | ClassValue[]
  | { [className: string]: unknown };

/** A conflict rule: a pattern, and the group key it maps to (null = composes). */
export type ConflictGroup = [RegExp, string | null];

export interface SantyMerge {
  /**
   * Merge class names so the last argument wins whenever two classes set the
   * same property. Variants are scoped — `md:add-padding-4` never conflicts
   * with `add-padding-8`.
   */
  (...inputs: ClassValue[]): string;
  cn(...inputs: ClassValue[]): string;
  /** Join classes without resolving conflicts (plain clsx behaviour). */
  clsx(...inputs: ClassValue[]): string;
  /** The conflict-group key for a bare class, or null when it composes. */
  groupOf(baseClass: string): string | null;
  /** Split `md:on-hover:scale-110` into its variant prefix and base class. */
  splitVariants(className: string): { variants: string; base: string };
  /** Build a cn() that also knows your own conflict groups. */
  extend(groups: ConflictGroup[]): (...inputs: ClassValue[]) => string;
  default: SantyMerge;
}

declare const cn: SantyMerge;
export { cn };
export default cn;

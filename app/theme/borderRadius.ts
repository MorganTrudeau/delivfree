/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
export const borderRadius = {
  xs: 2,
  sm: 5,
  md: 10,
  lg: 15,
  xl: 20,
} as const;

export type BorderRadius = keyof typeof borderRadius;

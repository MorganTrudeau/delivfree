/**
  Use these spacings for margins/paddings and other whitespace throughout your app.
 */
export const sizing = {
  xxxs: 2,
  xxs: 5,
  xs: 10,
  sm: 15,
  md: 20,
  lg: 25,
  xl: 30,
  xxl: 40,
  xxxl: 60,
} as const;

export type Sizing = keyof typeof sizing;

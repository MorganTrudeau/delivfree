import { colors } from 'app/theme';
import * as React from 'react';

export function useLatest<T>(value: T) {
  const ref = React.useRef(value);
  ref.current = value;
  return ref;
}

export function useTextColorOnPrimary() {
  return colors.white;
}

export function range(start: number, end: number) {
  return Array(end - start + 1)
    .fill(null)
    .map((_, i) => start + i);
}

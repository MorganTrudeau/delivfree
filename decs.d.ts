declare module "*.svg" {
  import React from "react";
  import { SvgProps } from "react-native-svg";
  const content: React.FC<SvgProps>;
  export default content;
}

// type ObjectValues<T> = T[keyof T][];
// type ObjectKeys<T> = (keyof T)[];
// type ObjectEntries<T> = [keyof T, T[keyof T]][];

// interface ObjectConstructor {
//   keys<T>(o: T): ObjectKeys<T>;
//   values<T>(o: T): ObjectValues<T>;
//   entries<T>(o: T): ObjectEntries<T>;
// }

import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 15;

export const useDataListener = <T extends { id: string }>(
  query: (limit: number, onData: (data: T[]) => void) => () => void,
  cache?: DataCache<T>,
  cacheKey: string = "cache-key"
) => {
  const [data, setData] = useState<T[]>(cache?.listCache[cacheKey] || []);

  const page = useRef(0);
  const lastPage = useRef(false);

  const loadData = useCallback(() => {
    if (lastPage.current) {
      return;
    }
    page.current = page.current + 1;
    const limit = page.current * PAGE_SIZE;
    return query(limit, (_data) => {
      const length = _data.length;
      const rem = length % PAGE_SIZE;
      if (length === 0 || (rem > 0 && rem < PAGE_SIZE)) {
        lastPage.current = true;
      }
      setData(_data);
      cache?.updateCache(cacheKey, _data);
    });
  }, [query, cacheKey]);

  useEffect(() => {
    lastPage.current = false;
    page.current = 0;
    setData(cache?.listCache[cacheKey] || []);
    return loadData();
  }, [loadData, cacheKey]);

  return { data, loadData };
};

export class DataCache<T extends { id: string }> {
  cache: { [id: string]: T } = {};
  listCache: { [id: string]: T[] } = {};
  updateCache = (id: string, data: T[]) => {
    this.listCache[id] = data;
    this.cache = {
      ...this.cache,
      ...data.reduce((acc, data) => ({ ...acc, [data.id]: data }), {}),
    };
  };
}

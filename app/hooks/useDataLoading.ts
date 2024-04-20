import { useCallback, useEffect, useRef, useState } from "react";

const PAGE_SIZE = 15;

export const useDataLoading = <T>(
  query: (limit: number) => Promise<T[]>,
  cacheKey: string
) => {
  const cache = useRef(getDataCache());

  const [data, setData] = useState<T[]>(cache.current.listCache[cacheKey]);

  const page = useRef(0);

  const loadData = useCallback(async () => {
    page.current = page.current + 1;
    const limit = page.current * PAGE_SIZE;
    const _data = await query(limit);
    setData(_data);
    cache.current.updateCache(cacheKey, _data);
  }, [query, cacheKey]);

  const reload = useCallback(async () => {
    const limit = page.current * PAGE_SIZE;
    const _data = await query(limit);
    setData(_data);
    cache.current.updateCache(cacheKey, _data);
  }, [query, cacheKey]);

  useEffect(() => {
    setData(cache.current.listCache[cacheKey]);
    loadData();
  }, [loadData, cacheKey]);

  return { data, loadData, reload };
};

let _dataCache: DataCache<any>;
export const getDataCache = () => {
  if (!_dataCache) {
    _dataCache = new DataCache();
  }
  return _dataCache;
};
class DataCache<T extends { id: string }> {
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

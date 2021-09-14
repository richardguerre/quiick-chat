import { createStore, StoreStateHookType, useStore } from "react-hookstore";

/**
 * Custom createStore hook, works the same, but also fetches cache from sessionStorage else initial value is set to defaultValue.
 * Parses JSON by default.
 * @param {string} storeName
 * @param {T} defaultValue
 * @param {boolean} needsParsing
 */
export const createSessionStore = <T>(storeName: string, defaultValue?: T, needsParsing = true) => {
  const value = sessionStorage.getItem(storeName);
  createStore<T>(storeName, (needsParsing && value ? JSON.parse(value) : value) || defaultValue);
};

/**
 * Custom createStore hook, works the same, but also fetches cache from localStorage else initial value is set to defaultValue.
 * Parses JSON by default.
 * @param {string} storeName
 * @param {any} defaultValue
 * @param {boolean} needsParsing
 */
export const createLocalStore = <T>(storeName: string, defaultValue?: T, needsParsing = true) => {
  const value = localStorage.getItem(storeName);
  createStore<T>(storeName, (needsParsing && value ? JSON.parse(value) : value) || defaultValue);
};

/**
 * Custom useStore hook, works the same, but setStore() also caches to sessionStorage.
 * Uses JSON.stringify() by default
 * @param {string} storeName
 * @param {boolean} needStringify
 */
export const useSessionStore = <T>(storeName: string, needStringify = true): StoreStateHookType<T> => {
  const [store, setActualStore] = useStore<T>(storeName);
  const setStore = (value: T) => {
    setActualStore(value);
    const temp = needStringify ? JSON.stringify(value) : String(value);
    sessionStorage.setItem(storeName, temp);
  };
  return [store, setStore];
};

/**
 * Custom useStore hook, works the same, but setStore() also caches to localStorage.
 * Uses JSON.stringify() by default
 * @param {string} storeName
 * @param {boolean} needStringify
 */
export const useLocalStore = <T>(storeName: string, needStringify = true): StoreStateHookType<T> => {
  const [store, setActualStore] = useStore<T>(storeName);
  const setStore = (value: T) => {
    setActualStore(value);
    const temp = needStringify ? JSON.stringify(value) : String(value);
    localStorage.setItem(storeName, temp);
  };
  return [store, setStore];
};

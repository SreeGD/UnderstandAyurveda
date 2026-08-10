import { useCallback, useSyncExternalStore } from 'react'
import { getStore } from '../storage/store'
import type { StoredDocument } from '../storage/schema'

/** Subscribes to the local store. The only way components see persisted state. */
export function useStoredDocument(): StoredDocument {
  const store = getStore()
  return useSyncExternalStore(
    useCallback((listener) => store.subscribe(listener), [store]),
    useCallback(() => store.read(), [store])
  )
}

export function useStore() {
  return getStore()
}

export function useStorageAvailability(): { persistent: boolean; futureVersion: boolean } {
  const store = getStore()
  return { persistent: store.isPersistent(), futureVersion: store.isFutureVersion() }
}

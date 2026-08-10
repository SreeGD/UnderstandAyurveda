import '@testing-library/jest-dom/vitest'
import { afterEach, beforeEach } from 'vitest'

// Each test starts from a clean local store. Storage is the only ambient state
// this app has, so resetting it is enough to isolate tests.
beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  window.localStorage.clear()
})

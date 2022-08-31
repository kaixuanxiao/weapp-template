import { fetch } from '../fetch'

export const somePostMethod = fetch.wrap('post', '/somePostMethod')

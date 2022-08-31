/* eslint-disable no-extend-native */
// github.com/taylorhakes/promise-polyfill
/* eslint-disable no-undef */
/* eslint-disable no-use-before-define */
'use strict'
;(function () {
  /**
   * @this {Promise}
   */
  function finallyConstructor(callback) {
    const constructor = this.constructor
    return this.then(
      function (value) {
        // @ts-ignore
        return constructor.resolve(callback()).then(function () {
          return value
        })
      },
      function (reason) {
        // @ts-ignore
        return constructor.resolve(callback()).then(function () {
          // @ts-ignore
          return constructor.reject(reason)
        })
      },
    )
  }

  function allSettled(arr) {
    const P = this
    return new P(function (resolve, reject) {
      if (!(arr && typeof arr.length !== 'undefined')) {
        return reject(
          new TypeError(typeof arr + ' ' + arr + ' is not iterable(cannot read property Symbol(Symbol.iterator))'),
        )
      }
      const args = Array.prototype.slice.call(arr)
      if (args.length === 0) return resolve([])
      let remaining = args.length

      function res(i, val) {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          const then = val.then
          if (typeof then === 'function') {
            then.call(
              val,
              function (val) {
                res(i, val)
              },
              function (e) {
                args[i] = { status: 'rejected', reason: e }
                if (--remaining === 0) {
                  resolve(args)
                }
              },
            )
            return
          }
        }
        args[i] = { status: 'fulfilled', value: val }
        if (--remaining === 0) {
          resolve(args)
        }
      }

      for (let i = 0; i < args.length; i++) {
        res(i, args[i])
      }
    })
  }

  if (typeof Promise !== 'function') {
    return
  }
  if (!Promise.prototype['finally']) {
    Promise.prototype['finally'] = finallyConstructor
  }
  if (!Promise.allSettled) {
    Promise.allSettled = allSettled
    Promise.allSettled = allSettled
  }
})()

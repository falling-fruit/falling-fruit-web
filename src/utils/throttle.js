// source:
// https://github.com/sindresorhus/throttleit/blob/main/index.js
// it requires node 18 so paste it in
function throttle(function_, wait) {
  let timeoutId
  let lastCallTime = 0

  console.log(`Throttle function created with wait time: ${wait}ms`)

  return function throttled(...arguments_) {
    // eslint-disable-line func-names
    if (timeoutId) {
      console.log('Clearing timeout')
      clearTimeout(timeoutId)
      timeoutId = 0
    }

    const now = Date.now()
    const timeSinceLastCall = now - lastCallTime
    const delayForNextCall = wait - timeSinceLastCall

    console.log(`Time since last call: ${timeSinceLastCall}ms`)
    console.log(`Delay for next call: ${delayForNextCall}ms`)

    if (delayForNextCall <= 0) {
      console.log('Executing function immediately')
      lastCallTime = now
      function_.apply(this, arguments_)
    } else {
      console.log(`Scheduling function execution in ${delayForNextCall}ms`)
      timeoutId = setTimeout(() => {
        console.log('xxxxxxxxxxxxxxx Executing scheduled function')
        lastCallTime = Date.now()
        function_.apply(this, arguments_)
      }, delayForNextCall)
    }
  }
}

module.exports = throttle

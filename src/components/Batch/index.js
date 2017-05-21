import React, { Component } from 'react'
import { string, number, func, bool } from 'prop-types'

export default class Batch extends Component {

  /**
   * Properties:
   *
   * - `count`: the number of items available for rendering
   * - `flushCount`: render after a given number of items
   * - `flushInterval`: render after a given interval is exceeded
   * - `render`: render callback
   * - `debug`: enable debug logging
   */

  constructor({ flushCount, flushInterval, debug}) {
    super()
    this.lastFlushCount = 0
    this.lastFlushTime = Date.now()
    this.flushInterval = flushInterval
    this.flushCount = flushCount
    this.debug = debug
  }

  /**
   * Start interval check for forced updates.
   */

  componentDidMount() {
    this._interval = setInterval(_ => this.checkAge(), this.flushInterval)
  }

  /**
   * Clear interval.
   */

  componentWillUnmount() {
    clearInterval(this._interval)
  }

  /**
   * Log when debug is enabled.
   */

  log(msg, ...args) {
    if (!this.debug) return
    console.log('[batch]: ' + msg, ...args)
  }

  /**
   * Age of the buffer.
   */

  age() {
    return Date.now() - this.lastFlushTime
  }

  /**
   * Pending items.
   */

  pending() {
    const { props: { count = 0 } = {} } = this
    return count - this.lastFlushCount
  }

  /**
   * Interval has exceeded.
   */

  intervalExceeded() {
    return this.age() >= this.flushInterval
  }

  /**
   * Check age and force flush if the interval has been exceeded.
   */

  checkAge() {
    if (this.age() >= this.flushInterval && this.pending() != 0) {
      this.log('flush forced interval')
      this.forceUpdate()
    }
  }

  /**
   * Check if the buffer is full or the interval has been exceeded.
   */

  shouldComponentUpdate({ count }) {
    const pending = count - this.lastFlushCount

    if (pending >= this.flushCount) {
      this.log('flush count (age %dms)', this.age())
      return true
    }

    if (this.age() >= this.flushInterval) {
      this.log('flush interval (count %d)', pending)
      return true
    }

    return false
  }

  /**
   * Render the component.
   */

  render() {
    const { render, count } = this.props
    this.lastFlushCount = count
    this.lastFlushTime = Date.now()
    return render()
  }
}

Batch.propTypes = {
  count: number.isRequired,
  flushCount: number.isRequired,
  flushInterval: number.isRequired,
  render: func.isRequired,
  debug: bool
}

Batch.defaultProps = {
  debug: false
}
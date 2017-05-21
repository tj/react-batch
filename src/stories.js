import React, { Component } from 'react'
import { render } from 'react-dom'
import { Stories, Story, Props } from 'neutrino-preset-react-components/lib'
import Batch from './components/Batch'
import sleep from 'sleep-promise'

const root = document.getElementById('root')

class BatchExample extends Component {
  constructor() {
    super()
    this.list = this.list.bind(this)
    this.state = { items: [] }
    this.renders = 0
  }

  async componentDidMount() {
    while (1) {
      const prev = this.state.items
      const items = [`Hello World #${prev.length}`, ...prev]
      this.setState({ items })
      await sleep(Math.random() * 30)
    }
  }

  list() {
    const { items } = this.state

    return <div>
      <p>Count: {items.length}</p>
      <p>Renders: {this.renders++}</p>
      <ul>
        {items.map((v, i) => <li key={i}>{v}</li>)}
      </ul>
    </div>
  }

  render() {
    return <Batch
      flushCount={10}
      flushInterval={150}
      count={this.state.items.length}
      render={this.list}
      debug />
  }
}

render((
  <Stories>
    <Story component={BatchExample}>
      <Props name="Default" />
    </Story>
  </Stories>
), root)

# React Batch

Batches and flushes renders based on the number of items available. Useful for large lists of frequently updated which would otherwise cause performance problems with React's sync rendering.

## Installation

```
$ yarn add tj/react-batch
```

## Properties

- `count`: the number of items available for rendering __(required)__
- `flushCount`: render after a given number of items __(required)__
- `flushInterval`: render after a given interval is exceeded __(required)__
- `render`: render callback __(required)__
- `debug`: enable debug logging

## Example

```js
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
```

---

[![GoDoc](https://godoc.org/github.com/tj/react-batch?status.svg)](https://godoc.org/github.com/tj/react-batch)
![](https://img.shields.io/badge/license-MIT-blue.svg)
![](https://img.shields.io/badge/status-stable-green.svg)
[![](http://apex.sh/images/badge.svg)](https://apex.sh/ping/)

<a href="https://apex.sh"><img src="http://tjholowaychuk.com:6000/svg/sponsor"></a>

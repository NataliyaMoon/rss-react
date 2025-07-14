import React from 'react';

type CounterState = {
  count: number;
};

type DisplayProps = {
  count: number;
};

class Display extends React.Component<DisplayProps> {
  render() {
    return <span>{this.props.count}</span>;
  }
}

class Counter extends React.Component<unknown, CounterState> {
  state: CounterState = { count: 0 };

  componentDidMount() {
    console.log('Counter mounted');
  }

  componentDidUpdate(_: unknown, prevState: CounterState) {
    console.log('Counter updated', prevState.count, '→', this.state.count);
  }

  componentWillUnmount() {
    console.log('Counter will unmount');
  }

  increment = () => this.setState({ count: this.state.count + 1 });
  decrement = () => this.setState({ count: this.state.count - 1 });

  render() {
    return (
      <div>
        <button onClick={this.decrement}>−</button>
        <Display count={this.state.count} />
        <button onClick={this.increment}>+</button>
      </div>
    );
  }
}

export default Counter;

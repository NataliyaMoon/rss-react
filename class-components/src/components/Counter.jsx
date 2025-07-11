import React from "react";

class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = { count: 0 };
  }

  componentDidMount() {
    console.log("Counter mounted");
  }

  componentDidUpdate(prevProps, prevState) {
    console.log("Counter updated", prevState.count, "→", this.state.count);
  }

  componentWillUnmount() {
    console.log("Counter will unmount");
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

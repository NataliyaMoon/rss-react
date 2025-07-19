import React from 'react';

class CrashComponent extends React.Component {
  componentDidMount() {
    throw new Error('Simulated crash');
  }

  render() {
    return null;
  }
}

export default CrashComponent;

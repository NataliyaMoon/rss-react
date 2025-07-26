import { useEffect, useState } from 'react';

type DisplayProps = {
  count: number;
};

function Display({ count }: DisplayProps) {
  return <span>{count}</span>;
}

function Counter() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    console.log('Counter mounted');
    return () => {
      console.log('Counter will unmount');
    };
  }, []);

  useEffect(() => {
    console.log('Counter updated', count);
  }, [count]);

  const increment = () => setCount((prev) => prev + 1);
  const decrement = () => setCount((prev) => prev - 1);

  return (
    <div>
      <button onClick={decrement}>−</button>
      <Display count={count} />
      <button onClick={increment}>+</button>
    </div>
  );
}

export default Counter;

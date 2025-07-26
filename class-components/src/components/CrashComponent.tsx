import { useEffect } from 'react';

function CrashComponent() {
  useEffect(() => {
    throw new Error('Simulated crash');
  }, []);

  return null;
}

export default CrashComponent;

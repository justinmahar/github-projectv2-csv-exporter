import React from 'react';
import EventEmitter from 'events';

const eventEmitter = new EventEmitter();

export const useLocalStorageState = (
  initial: string | null,
  key: string,
): [string | null, (val: string | null) => void] => {
  const [state, setState] = React.useState(
    typeof localStorage !== 'undefined' ? localStorage[key] ?? initial : initial,
  );
  // Sync with all hook instances through an emitter
  React.useEffect(() => {
    const listener = (changedKey: string) => {
      if (key === changedKey) {
        setState(typeof localStorage !== 'undefined' ? localStorage[key] ?? initial : initial);
      }
    };
    eventEmitter.addListener('change', listener);
    return () => {
      eventEmitter.removeListener('change', listener);
    };
  }, [initial, key]);

  const setStateCombined = (value: string | null) => {
    setState(value);
    localStorage[key] = value;
    eventEmitter.emit('change', key);
  };
  return [state, setStateCombined];
};

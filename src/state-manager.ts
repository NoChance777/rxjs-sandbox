import { PlayerState } from './chaotic-player';

export default () => {
  let localStateCounter: number = 0;
  let localState: PlayerState | null;

  const setState = (newState: PlayerState | null) => {
    console.log(`${++localStateCounter} change state from ${localState} -> ${newState}`);
    localState = newState;
  };
  return {
    setState,
    getState: () => localState,
  };
};

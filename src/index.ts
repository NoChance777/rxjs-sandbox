import {
  fromEvent,
  Subject,
  Observable,
  tap,
  takeWhile,
  skipUntil,
  take,
  switchMap,
  map,
  concatMap,
  of,
  delayWhen,
} from 'rxjs';
import ChaoticPlayer, { PlayerState } from './chaotic-player';

let localStateCounter: number = 0;
let localState: PlayerState | null;

const setState = (newState: PlayerState | null) => {
  console.log(`${++localStateCounter} change state from ${localState} -> ${newState}`);
  localState = newState;
};

(async () => {
  console.log('starting player...');

  const player = new ChaoticPlayer();

  const playObservable = fromEvent(player, 'play');
  const readyObservable = fromEvent(player, 'ready');
  const loadObservable = fromEvent(player, 'load');

  loadObservable.subscribe(({ state }) => setState(state));
  readyObservable.subscribe(({ state }) => {
    console.log('+++ready observable got state=', state);
    setState(state);
  });
  playObservable.subscribe(({ state }) => {
    console.log('+++play observable got state=', state);
  });

  playObservable.pipe(delayWhen(() => readyObservable)).subscribe(({ state }) => setState(state));

  // player.addEventListener('seek', eventHandler);
  // player.addEventListener('ready', eventHandler);

  player.load();
  await player.play();
})().then(() => {
  console.log('+++all operations are done');
});

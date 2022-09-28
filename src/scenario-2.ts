import ChaoticPlayer, { PlayerState, PlayerEventHandler } from './chaotic-player';
import createStateManager from './state-manager';
import { Subject, concatMap, Observable, of, delayWhen, fromEvent, merge } from 'rxjs';

const createSeekCommand = <T>(player: ChaoticPlayer, ...unblockSeeking: Observable<T>[]) => {
  const seekSubject = new Subject<number>();
  const seekCall = (position: number) => seekSubject.next(position);

  const seekPipe = seekSubject.pipe(
    concatMap((position) => {
      player.seek(position);
      return of(position).pipe(delayWhen(() => merge(...unblockSeeking)));
    })
  );

  seekCall.observable = seekPipe;
  return seekCall;
};

const main = async () => {
  console.log('starting player...');
  const stateManager = createStateManager();
  stateManager.setState('play');

  const player = new ChaoticPlayer();
  const changeState: PlayerEventHandler = ({ state }) => stateManager.setState(state);

  const seekObservable = fromEvent(player, 'seek');
  seekObservable.subscribe(changeState);

  const playObservable = fromEvent(player, 'play');
  playObservable.subscribe(changeState);

  const readyObservable = fromEvent(player, 'ready');
  readyObservable.subscribe(changeState);
  // player.addEventListener('seek', () => {
  //   console.log(`We are seeking to ${player.getPosition()}`);
  //   changeState({ state: 'seek' });
  // });

  // player.addEventListener('play', () => {
  //   console.log(`We are playing at ${player.getPosition()}`);
  //   changeState({ state: 'play' });
  // });

  const seek = createSeekCommand(player, playObservable, readyObservable);
  seek.observable.subscribe((position) => {
    console.log(`completed seek to ${position}`);
  });
  seek(111);
  seek(222);
  seek(333);

  // player.seek(111);
  // player.seek(222);
  // player.seek(333);
};;;

export default main;

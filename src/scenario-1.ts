import ChaoticPlayer, { PlayerState, PlayerEventHandler } from './chaotic-player';
import createStateManager from './state-manager';
import { fromEvent, Subject, Observable, tap, delayWhen, mergeMap, from, map } from 'rxjs';

// const createPlayCommand = <T>(player: ChaoticPlayer, block: Observable<T>) => {
//   const playSubject = new Subject<void>();
//   const playCall = () => playSubject.next();

//   const playPipe = playSubject.pipe(
//     tap(() => console.log('attempt to play -->')),
//     delayWhen(() => block),
//     tap(() => console.log('--> calling play -->')),
//     mergeMap(() => {
//       // return from(player.play()).pipe(map(() => ({ state: 'play' as PlayerState | null })));
//       return fromEvent(player, 'play');
//     }),
//     tap(() => console.log('--> play is executing'))
//   );

//   playCall.observable = playPipe;
//   return playCall;
// };

const main = async () => {
  console.log('starting player...');
  const stateManager = createStateManager();
  const player = new ChaoticPlayer({ seekDelay: 500, loadDelay: 5000, playDelay: 500 });

  const changeState: PlayerEventHandler = ({ state }) => stateManager.setState(state);

  const readyObservable = fromEvent(player, 'ready');
  readyObservable.subscribe(changeState);

  player.addEventListener('ready', () => {
    console.log('We are ready to play');
    changeState({ state: 'ready' });
  });

  player.addEventListener('play', () => {
    console.log('We are finally playing...');
    changeState({ state: 'play' });
  });

  player.load();
  // const play = createPlayCommand(player, readyObservable);
  // play.observable.subscribe(changeState);
  // play();
  player.play();
};

export default main;
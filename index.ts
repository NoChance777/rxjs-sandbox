
import { fromEvent, Subject, Observable, tap, takeWhile, skipUntil, take, switchMap, map, concatMap, of, delayWhen } from 'rxjs';

type PlayerState =  'load' | 'ready' | 'play' | 'seek' | 'error';
type PlayerEventHandler = (event: { state: PlayerState | null }) => void;



let localStateCounter: number = 0;
let localState: PlayerState | null;

const setState = (newState: PlayerState | null) => {
  console.log(`${++localStateCounter} change state from ${localState} -> ${newState}`);
  localState = newState;
};

class ChaoticPlayer {
  private handlers: Partial<Record<PlayerState, Array<PlayerEventHandler | null>>>;
  position: number = 0;

  constructor() {
    this.handlers = {};
  }

  load() {
    this.emit("load");
      setTimeout(() => {
        this.emit("ready");
      }, 3000);
  }

  async play() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.emit("play");
        resolve();
      }, 1000);
    });
  }

  seek(position: number): void {
    this.emit("seek");
    setTimeout(() => {
      this.position = position;
      this.emit("seek");
    }, 1000);
  }

  private emit(state: PlayerState) {
    this.handlers[state]?.forEach((handler) => {
      handler?.({ state });
    });
  }

  addEventListener(event: PlayerState, listener: PlayerEventHandler | null) {
    if (!this.handlers[event]) {
      this.handlers[event] = [];
    }
    this.handlers[event]?.push(listener);
  }

  removeEventListener(event: PlayerState, listener: PlayerEventHandler | null): void {
    let idx: number;
    if (this.handlers[event] && (idx = (this.handlers[event] ?? []).indexOf(listener)) >= 0) {
      this.handlers[event]?.splice(idx, 1);
    }
  }
}

(async () => {
  console.log('starting player...');

  const player = new ChaoticPlayer();

 
  const playObservable = fromEvent(player, 'play');
  const readyObservable = fromEvent(player, 'ready');
  const loadObservable = fromEvent(player, 'load');

  loadObservable.subscribe(({ state }) => setState(state));
  readyObservable.subscribe(({ state }) => {
    console.log("+++ready observable got state+++", state);
    setState(state);
  });
  playObservable.subscribe(({ state }) => { console.log('+++play observable got state+++', state) });

  playObservable.pipe(delayWhen(()=> readyObservable)).subscribe(({ state }) => setState(state));
  
  
  // player.addEventListener('seek', eventHandler);
  // player.addEventListener('ready', eventHandler);

  player.load();
  await player.play();

})()
  .then(() => {
    console.log('+++all operations are done+++');
  });
export type PlayerState = 'load' | 'ready' | 'play' | 'seek' | 'error';
export type PlayerEventHandler = (event: { state: PlayerState | null }) => void;

export default class ChaoticPlayer {
  private handlers: Partial<Record<PlayerState, Array<PlayerEventHandler | null>>>;
  private position: number = 0;

  constructor(private options = { loadDelay: 3000, playDelay: 1000 }) {
    this.handlers = {};
  }

  load() {
    this.emit('load');
    setTimeout(() => {
      this.emit('ready');
    }, this.options.loadDelay);
  }

  async play() {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        this.emit('play');
        resolve();
      }, this.options.playDelay);
    });
  }

  seek(position: number): void {
    this.emit('seek');
    setTimeout(() => {
      this.position = position;
      this.emit('play');
    }, Math.random() * 5000);
  }

  public getPosition = () => this.position;

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

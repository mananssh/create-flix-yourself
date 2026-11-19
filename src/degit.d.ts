declare module 'degit' {
  export interface DegitOptions {
    cache?: boolean;
    force?: boolean;
    verbose?: boolean;
    mode?: 'tar' | 'git';
  }

  export interface DegitEmitter {
    clone(dest: string): Promise<void>;
    on(event: string, handler: (...args: any[]) => void): DegitEmitter;
  }

  export default function degit(src: string, opts?: DegitOptions): DegitEmitter;
}

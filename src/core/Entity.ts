import events from "events"

export type EntityList = Set<Entity>

export interface EntityEvents {
  beforeSetup: []
  beforeTeardown: []
  afterSetup: []
  afterTeardown: []
}

export interface Entity {
  setup?(): void
  update?(): void
  teardown?(): void
}

export abstract class Entity extends events.EventEmitter {
  static all: EntityList = new Set()

  public children: EntityList = new Set()

  public has(entity: Entity): boolean {
    return this.children.has(entity)
  }
  public add(entity: Entity): void {
    this.children.add(entity)
  }
  public remove(entity: Entity): void {
    this.children.delete(entity)
  }

  private _setup(): void {
    if (this.setup) {
      this.emit("beforeSetup")
      this.setup()
      this.emit("afterSetup")
    }
    this.children.forEach((entity) => {
      entity._setup()
    })
  }

  private _update(): void {
    this.update?.()
    this.children.forEach((entity) => {
      entity._update()
    })
  }

  private _teardown(): void {
    if (this.teardown) {
      this.emit("beforeTeardown")
      this.teardown()
      this.emit("afterTeardown")
    }
    this.children.forEach((entity) => {
      entity._teardown()
    })
  }

  public on<K extends keyof EntityEvents>(
    event: K,
    listener: (...args: EntityEvents[K]) => void
  ): this
  public on<S extends string | symbol>(
    event: Exclude<S, keyof EntityEvents>,
    listener: (...args: any[]) => void
  ): this {
    return super.on(event, listener)
  }

  public once<K extends keyof EntityEvents>(
    event: K,
    listener: (...args: EntityEvents[K]) => void
  ): this
  public once<S extends string | symbol>(
    event: Exclude<S, keyof EntityEvents>,
    listener: (...args: any[]) => void
  ): this {
    return super.once(event, listener)
  }

  public emit<K extends keyof EntityEvents>(
    event: K,
    ...args: EntityEvents[K]
  ): boolean
  public emit<S extends string | symbol>(
    event: Exclude<S, keyof EntityEvents>,
    ...args: any[]
  ): boolean {
    return super.emit(event, ...args)
  }

  public off<K extends keyof EntityEvents>(
    event: K,
    listener: (...args: EntityEvents[K]) => void
  ): this
  public off<S extends string | symbol>(
    event: Exclude<S, keyof EntityEvents>,
    listener: (...args: any[]) => void
  ): this {
    return super.off(event, listener)
  }

  public removeAllListeners<K extends keyof EntityEvents>(event?: K): this
  public removeAllListeners<S extends string | symbol>(
    event?: Exclude<S, keyof EntityEvents>
  ): this {
    return super.removeAllListeners(event)
  }
}

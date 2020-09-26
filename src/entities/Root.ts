import * as entity from "../core/Entity"

export class Root<Context> extends entity.Entity {
  constructor(public context: Context) {
    super()
  }
}

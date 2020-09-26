const sakamoto = require("./dist/index")

test("test Root entity", () => {
  const root = new sakamoto.Root("test")
  root.add(new sakamoto.Root(true))

  expect(typeof root.context).toBe("string")
  expect(root.children.size).toBe(1)
})

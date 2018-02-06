/* eslint-env jest */

const Tree = require('avl')
const compareSegments = require('../src/compare-segments')
const SweepEvent = require('../src/sweep-event')

describe('sweep line', () => {
  const s = [[[16, 282], [298, 359], [153, 203.5], [16, 282]]]
  const c = [[[56, 181], [153, 294.5], [241.5, 229.5], [108.5, 120], [56, 181]]]

  test('general', () => {
    const EF = SweepEvent.buildPair(s[0][0], s[0][2], true)[0]
    const EG = SweepEvent.buildPair(s[0][0], s[0][1], true)[0]

    const tree = new Tree(compareSegments)
    tree.insert(EF)
    tree.insert(EG)

    expect(tree.find(EF).key).toBe(EF)
    expect(tree.minNode().key).toBe(EF)
    expect(tree.maxNode().key).toBe(EG)

    let it = tree.find(EF)
    expect(tree.next(it).key).toBe(EG)
    it = tree.find(EG)
    expect(tree.prev(it).key).toBe(EF)

    const DA = SweepEvent.buildPair(c[0][0], c[0][2], true)[0]
    const DC = SweepEvent.buildPair(c[0][0], c[0][1], true)[0]

    tree.insert(DA)
    tree.insert(DC)

    let node = tree.minNode()
    expect(node.key).toBe(DA)
    node = tree.next(node)
    expect(node.key).toBe(DC)
    node = tree.next(node)
    expect(node.key).toBe(EF)
    node = tree.next(node)
    expect(node.key).toBe(EG)
  })
})

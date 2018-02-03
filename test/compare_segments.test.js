/* eslint-env jest */

const Tree = require('avl')
const compareSegments = require('../src/compare_segments')
const compareEvents = require('../src/compare_events')
const SweepEvent = require('../src/sweep_event')

describe('compare segments are not collinear', () => {
  test('shared left point - right point first', () => {
    const tree = new Tree(compareSegments)
    const pt = [0.0, 0.0]
    const se1 = new SweepEvent(pt, true, new SweepEvent([1, 1], false))
    const se2 = new SweepEvent(pt, true, new SweepEvent([2, 3], false))

    tree.insert(se1)
    tree.insert(se2)

    expect(tree.maxNode().key.otherEvent.point).toEqual([2, 3])
    expect(tree.minNode().key.otherEvent.point).toEqual([1, 1])
  })

  test('different left point - right point y coord to sort', () => {
    const tree = new Tree(compareSegments)
    const se1 = new SweepEvent([0, 1], true, new SweepEvent([1, 1], false))
    const se2 = new SweepEvent([0, 2], true, new SweepEvent([2, 3], false))

    tree.insert(se1)
    tree.insert(se2)

    expect(tree.minNode().key.otherEvent.point).toEqual([1, 1])
    expect(tree.maxNode().key.otherEvent.point).toEqual([2, 3])
  })

  test('events order in sweep line', () => {
    const se1 = new SweepEvent([0, 1], true, new SweepEvent([2, 1], false))
    const se2 = new SweepEvent([-1, 0], true, new SweepEvent([2, 3], false))

    const se3 = new SweepEvent([0, 1], true, new SweepEvent([3, 4], false))
    const se4 = new SweepEvent([-1, 0], true, new SweepEvent([3, 1], false))

    expect(compareEvents(se1, se2)).toBe(1)
    expect(se2.isBelow(se1.point)).toBeFalsy()
    expect(se2.isAbove(se1.point)).toBeTruthy()

    expect(compareSegments(se1, se2)).toBe(-1)
    expect(compareSegments(se2, se1)).toBe(1)

    expect(compareEvents(se3, se4)).toBe(1)
    expect(se4.isAbove(se3.point)).toBeFalsy()
  })

  test('first point is below', () => {
    const se2 = new SweepEvent([0, 1], true, new SweepEvent([2, 1], false))
    const se1 = new SweepEvent([-1, 0], true, new SweepEvent([2, 3], false))

    expect(se1.isBelow(se2.point)).toBeFalsy()
    expect(compareSegments(se1, se2)).toBe(1)
  })
})

describe('compare segments are collinear', () => {
  test('general', () => {
    const se1 = new SweepEvent(
      [1, 1],
      true,
      new SweepEvent([5, 1], false),
      true
    )
    const se2 = new SweepEvent(
      [2, 1],
      true,
      new SweepEvent([3, 1], false),
      false
    )

    expect(se1.isSubject).not.toBe(se2.isSubject)
    expect(compareSegments(se1, se2)).toBe(-1)
  })

  test('left point', () => {
    const pt = [0, 1]

    const se1 = new SweepEvent(pt, true, new SweepEvent([5, 1], false), false)
    const se2 = new SweepEvent(pt, true, new SweepEvent([3, 1], false), false)

    se1.contourId = 1
    se2.contourId = 2

    expect(se1.isSubject).toBe(se2.isSubject)
    expect(se1.point).toBe(se2.point)

    expect(compareSegments(se1, se2)).toBe(-1)

    se1.contourId = 2
    se2.contourId = 1

    expect(compareSegments(se1, se2)).toBe(1)
  })

  test('same polygon different left points', () => {
    const se1 = new SweepEvent(
      [1, 1],
      true,
      new SweepEvent([5, 1], false),
      true
    )
    const se2 = new SweepEvent(
      [2, 1],
      true,
      new SweepEvent([3, 1], false),
      true
    )

    expect(se1.isSubject).toBe(se2.isSubject)
    expect(se1.point).not.toEqual(se2.point)
    expect(compareSegments(se1, se2)).toBe(-1)
    expect(compareSegments(se2, se1)).toBe(1)
  })
})

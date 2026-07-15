'use strict';

const assert = require('node:assert/strict');
const test = require('node:test');
const colors = require('../static/js/colorUtils');

test('normalizes supported color syntax to canonical values', () => {
  const cases = new Map([
    [' red ', 'red'],
    ['#AbC', '#aabbcc'],
    ['336699', '#336699'],
    ['rgb(0, 127, 255)', '#007fff'],
    ['rgba(255, 0, 16, .5)', '#ff0010'],
  ]);
  for (const [input, expected] of cases) assert.equal(colors.normalizeColor(input), expected);
});

test('rejects malformed, out-of-range, and injection-like colors', () => {
  for (const input of [null, '', '#12', '#gggggg', 'rgb(256,0,0)', 'rgba(1,2,3,2)', 'red; background:url(javascript:alert(1))']) {
    assert.equal(colors.normalizeColor(input), '');
  }
});

test('color classes round-trip Unicode-safe URL encoding and fail closed', () => {
  assert.equal(colors.decodeColorClass(colors.encodeColorClass('#33AA99')), '#33aa99');
  assert.equal(colors.decodeColorClass('%E0%A4%A'), '');
  assert.equal(colors.colorToPickerValue('red'), '#ff0000');
  assert.equal(colors.colorToPickerValue('invalid'), '#000000');
});

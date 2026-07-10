'use strict';

const NAMED_COLORS = new Map([
  ['black', '#000000'],
  ['red', '#ff0000'],
  ['green', '#008000'],
  ['blue', '#0000ff'],
  ['yellow', '#ffff00'],
  ['orange', '#ffa500'],
]);

const toHexByte = (n) => Number(n).toString(16).padStart(2, '0');

const normalizeColor = (raw) => {
  if (raw == null) return '';
  const value = String(raw).trim().toLowerCase();
  if (!value) return '';
  if (NAMED_COLORS.has(value)) return value;

  const shortHex = /^#?([0-9a-f]{3})$/i.exec(value);
  if (shortHex) {
    return `#${shortHex[1].split('').map((c) => c + c).join('').toLowerCase()}`;
  }

  const longHex = /^#?([0-9a-f]{6})$/i.exec(value);
  if (longHex) return `#${longHex[1].toLowerCase()}`;

  const rgb = /^rgba?\(\s*(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})(?:\s*,\s*(?:0|1|0?\.\d+))?\s*\)$/i.exec(value);
  if (rgb) {
    const parts = rgb.slice(1, 4).map(Number);
    if (parts.every((n) => n >= 0 && n <= 255)) return `#${parts.map(toHexByte).join('')}`;
  }

  return '';
};

const colorToPickerValue = (raw) => {
  const color = normalizeColor(raw);
  if (!color) return '#000000';
  return NAMED_COLORS.get(color) || color;
};

const encodeColorClass = (raw) => encodeURIComponent(normalizeColor(raw));

const decodeColorClass = (encoded) => {
  try {
    return normalizeColor(decodeURIComponent(encoded));
  } catch (_) {
    return '';
  }
};

exports.NAMED_COLORS = NAMED_COLORS;
exports.normalizeColor = normalizeColor;
exports.colorToPickerValue = colorToPickerValue;
exports.encodeColorClass = encodeColorClass;
exports.decodeColorClass = decodeColorClass;

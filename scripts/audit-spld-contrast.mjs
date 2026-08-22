const pairs = [
  ['共用焦點環', '#145fa8', '#ffffff', 3],
  ['初中選項文字', '#276a62', '#ffffff', 4.5],
  ['初中主按鈕文字', '#ffffff', '#177d70', 4.5],
  ['初中提示文字', '#896313', '#fff7d5', 4.5],
  ['初中成功回饋', '#25714f', '#ffffff', 4.5],
  ['初中重試回饋', '#9b4d4d', '#ffffff', 4.5],
  ['高中選項文字', '#574489', '#ffffff', 4.5],
  ['高中主按鈕文字', '#ffffff', '#6c56b2', 4.5],
  ['高中提示文字', '#896313', '#fff7d5', 4.5],
  ['高中成功回饋', '#25714f', '#ffffff', 4.5],
  ['高中重試回饋', '#9b4d4d', '#ffffff', 4.5],
  ['高中低壓提示', '#5c4d83', '#f6f3ff', 4.5],
  ['模組說明文字', '#66738a', '#ffffff', 4.5]
];

const rgb = (hex) => hex.replace('#', '').match(/.{2}/g).map((part) => Number.parseInt(part, 16) / 255);
const luminance = (hex) => rgb(hex).map((channel) => channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4).reduce((sum, channel, index) => sum + channel * [0.2126, 0.7152, 0.0722][index], 0);
const ratio = (foreground, background) => { const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a); return (light + 0.05) / (dark + 0.05); };
const checks = pairs.map(([label, foreground, background, minimum]) => ({ label, foreground, background, minimum, ratio: Number(ratio(foreground, background).toFixed(2)), pass: ratio(foreground, background) >= minimum }));
console.table(checks);
if (checks.some((check) => !check.pass)) process.exitCode = 1;

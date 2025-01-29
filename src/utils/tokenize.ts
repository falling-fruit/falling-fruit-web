interface AsciiMap {
  [key: string]: string
}

const ASCII: { [key: string]: string } = {
  A: 'AⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ',
  AA: 'Ꜳ',
  AE: 'ÆǼǢ',
  AO: 'Ꜵ',
  AU: 'Ꜷ',
  AV: 'ꜸꜺ',
  AY: 'Ꜽ',
  B: 'BⒷＢḂḄḆɃƂƁ',
  C: 'CⒸＣĆĈĊČÇḈƇȻ',
  D: 'DⒹＤḊĎḌḐḒḎĐƋƊƉ',
  DZ: 'ǱǄ',
  Dz: 'ǲǅ',
  E: 'EⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎ',
  F: 'FⒻＦḞƑ',
  G: 'GⒼＧǴĜḠĞĠǦĢǤƓꞠ',
  H: 'HⒽＨĤḢḦȞḤḨḪĦⱧ',
  I: 'IⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ',
  J: 'JⒿＪĴ',
  K: 'KⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ',
  L: 'LⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈ',
  LJ: 'Ǉ',
  Lj: 'ǈ',
  M: 'MⓂＭḾṀṂƜ',
  N: 'NⓃＮǸŃÑṄŇṆŅṊṈȠƝꞐꞤ',
  NJ: 'Ǌ',
  Nj: 'ǋ',
  O: 'OⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ',
  OE: 'Œ',
  OI: 'Ƣ',
  OO: 'Ꝏ',
  OU: 'Ȣ',
  P: 'PⓅＰṔṖƤⱣꝐꝒꝔ',
  Q: 'QⓆＱꝖꝘ',
  R: 'RⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦ',
  S: 'SⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨ',
  T: 'TⓉＴṪŤṬȚŢṰṮŦƬƮȾ',
  TZ: 'Ꜩ',
  U: 'UⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ',
  V: 'VⓋＶṼṾƲꝞɅ',
  VY: 'Ꝡ',
  W: 'WⓌＷẀẂŴẆẄẈⱲ',
  X: 'XⓍＸẊẌ',
  Y: 'YⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ',
  Z: 'ZⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ',
  a: 'aⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐꜳ',
  ae: 'æǽǣ',
  ao: 'ꜵ',
  au: 'ꜷ',
  av: 'ꜹꜻ',
  ay: 'ꜽ',
  b: 'bⓑｂḃḅḇƀƃɓ',
  c: 'cⓒｃćĉċčçḉƈȼ',
  d: 'dⓓｄḋďḍḑḓḏđƌɖɗꝺð',
  dz: 'ǳǆ',
  e: 'eⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇɛǝ',
  f: 'fⓕｆḟƒ',
  g: 'gⓖｇǵĝḡğġǧģǥɠꞡᵹ',
  h: 'hⓗｈĥḣḧȟḥḩḫẖħⱨɥ',
  hv: 'ƕ',
  i: 'iⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı',
  j: 'jⓙｊĵǰɉ',
  k: 'kⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ',
  l: 'lⓛｌŀĺľḷḹļḽḻłƚɫ',
  lj: 'ǉ',
  m: 'mⓜｍḿṁṃɱɯᶆ',
  n: 'nⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥ',
  nj: 'ǌ',
  o: 'oⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿɔꝋꝍɵ',
  oe: 'œ',
  oi: 'ƣ',
  ou: 'ȣ',
  oo: 'ꝏ',
  p: 'pⓟｐṕṗƥᵽꝑꝓꝕ',
  q: 'qⓠｑɋꝗꝙ',
  r: 'rⓡｒŕṙřȑȓṛṝŗṟɍɽ',
  s: 'sⓢｓśṥŝṡšṧṣṩșşȿꞩẛſß',
  t: 'tⓣｔṫẗťṭțţṱṯŧƭʈⱦ',
  tz: 'ꜩ',
  u: 'uⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ',
  v: 'vⓥｖṽṿʋꝟʌ',
  w: 'wⓦｗẁẃŵẇẅẘẉⱳ',
  x: 'xⓧẋẍxᶍｘ',
  y: 'yⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ',
  z: 'zⓩｚźẑżžẓẕƶȥɀⱬ',
}

const ASCII_MAP: AsciiMap = {}
for (const key in ASCII) {
  for (const letter of ASCII[key]) {
    ASCII_MAP[letter] = key
  }
}

const TOKEN_START = '^'
const WORD_END = ' '

type Transform = (_input: string) => string

const pipe =
  (...fns: Transform[]): Transform =>
  (x) =>
    fns.reduce((v, f) => f(v), x)

const removeNonWordChars: Transform = (s) => s.replace(/[^\s\w]/g, '')

const convertToAscii: Transform = (s) =>
  s
    .split('')
    .map((c) => ASCII_MAP[c] || c)
    .join('')

const addTokenStart: Transform = (s) => `${TOKEN_START}${s}`

const addTokenStartEnd: Transform = (s) => `${TOKEN_START}${s}${WORD_END}`

const rightTrimWithWordEnd: Transform = (s) => s.replace(/\s+$/, WORD_END)

const tokenize = pipe(
  removeNonWordChars,
  (x) => x.toLowerCase(),
  convertToAscii,
)

export const tokenizeReference = (strings: string[]): string =>
  strings.map(pipe(tokenize, addTokenStartEnd)).join('')

export const tokenizeQuery = pipe(tokenize, addTokenStart, rightTrimWithWordEnd)

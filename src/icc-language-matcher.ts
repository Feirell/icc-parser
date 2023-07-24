import { positiveLookahead } from './reg-exp-helper';

const lineBreak = '(?:\\r?\\n)'

const frontOrBackKeywords = lineBreak + '\\s*{2}(Front|Back):\\s*' + lineBreak + '{2}';
const cardContentMatch = '((?:' + lineBreak + '|.)+?)';

const metaNameMatcher = '(\\w+)';
const metaFieldMatcher = '(.+)';

export const REGEXP_ICC_META_REGEXP_STRING = '(?:' + lineBreak + '|^)' + 'ICC-' + metaNameMatcher + ': ?' + metaFieldMatcher + positiveLookahead(lineBreak);
export const REGEXP_ICC_CARD_SIDE_REGEXP_STRING = frontOrBackKeywords + cardContentMatch + positiveLookahead('(:?' + frontOrBackKeywords + ')|$');

export const REGEXP_ICC_META_MATCHER = new RegExp(REGEXP_ICC_META_REGEXP_STRING, 'g');
export const REGEXP_ICC_CARD_SIDE_MATCHER = new RegExp(REGEXP_ICC_CARD_SIDE_REGEXP_STRING, 'g');
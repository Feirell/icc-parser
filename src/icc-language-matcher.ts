import { positiveLookahead } from './reg-exp-helper';

const lineBreak = '(?:\\r?\\n)'

const frontOrBackKeywords = lineBreak + '{2}(Front|Back):' + lineBreak + '{2}';
const cardContentMatch = '((?:' + lineBreak + '|.)+?)';

const metaNameMatcher = '(\\w+)';
const metaFieldMatcher = '(.+)';

const REGEXP_ICC_META_MATCHER = '(?:' + lineBreak + '|^)' + 'ICC-' + metaNameMatcher + ': ?' + metaFieldMatcher + positiveLookahead(lineBreak);
const REGEXP_ICC_CARD_SIDE_MATCHER = frontOrBackKeywords + cardContentMatch + positiveLookahead('(:?' + frontOrBackKeywords + ')|$');

export default Object.freeze({ REGEXP_ICC_META_MATCHER, REGEXP_ICC_CARD_SIDE_MATCHER });
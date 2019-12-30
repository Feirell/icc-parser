import ICCLanguageMatcher from './icc-language-matcher';
import { ICCDocument, ICCCard, ICCMeta } from './icc-types';
import { getAll } from './reg-exp-helper';

export default (() => {
    class ICCParserError extends Error {
        constructor(msg: string) { super(msg); }
    }

    const LineBreakMatcher = new RegExp('\r\n', 'g');
    const toNewLineOnly = (str: string) => (LineBreakMatcher.lastIndex = 0, str.replace(LineBreakMatcher, '\n'));

    const REGEXP_ICC_META = new RegExp(ICCLanguageMatcher.REGEXP_ICC_META_MATCHER, 'g');
    const REGEXP_ICC_CARD_SIDE = new RegExp(ICCLanguageMatcher.REGEXP_ICC_CARD_SIDE_MATCHER, 'g');

    return function parse(str: string) {
        REGEXP_ICC_META.lastIndex = 0;
        REGEXP_ICC_CARD_SIDE.lastIndex = 0;

        const metaMatchResult = (() => { try { return getAll(REGEXP_ICC_META, str) } catch (e) { throw new ICCParserError("could not parse the meta part of the document") } })();

        if (metaMatchResult.matches.length == 0 || metaMatchResult.matches[0][1] != 'Version')
            throw new ICCParserError('the first field present in the document needs to be ICC-Version');

        if (metaMatchResult.matches[0][2] != '1')
            throw new ICCParserError('can not parse other ICC-Versions than 1');

        REGEXP_ICC_CARD_SIDE.lastIndex = metaMatchResult.lastIndex;
        const cardsMatchResult = (() => { try { return getAll(REGEXP_ICC_CARD_SIDE, str) } catch (e) { throw new ICCParserError("could not parse the cards part of the document") } })();

        const metaObjects: ICCMeta[] = [];
        for (const [, field, value] of metaMatchResult.matches)
            metaObjects.push({ field, value })

        const cardsObjects: ICCCard[] = [];

        let bufferSide = true;
        let buffer: undefined | string;

        for (const [, sideIdentifier, cardContent] of cardsMatchResult.matches) {
            const side = sideIdentifier == 'Front';
            const formattedCC = side ? cardContent : toNewLineOnly(cardContent);

            if (buffer) {
                if (bufferSide == side) {
                    cardsObjects.push({
                        [bufferSide ? 'front' : 'back']: buffer
                    });

                    bufferSide = side;
                    buffer = formattedCC;
                } else {
                    cardsObjects.push({
                        [bufferSide ? 'front' : 'back']: buffer,
                        [side ? 'front' : 'back']: formattedCC,
                    });

                    buffer = undefined;
                }
            } else {
                bufferSide = side;
                buffer = formattedCC;
            }
        }

        if (buffer) {
            cardsObjects.push({
                [bufferSide ? 'front' : 'back']: buffer
            });
        }

        return { metaInformation: metaObjects, cards: cardsObjects } as ICCDocument;
    }
})();
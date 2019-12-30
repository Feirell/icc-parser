import { REGEXP_ICC_META_MATCHER, REGEXP_ICC_CARD_SIDE_MATCHER } from './icc-language-matcher';
import { ICCDocument, ICCCard, ICCMeta } from './icc-types';
import { getAll } from './reg-exp-helper';

class ICCParserError extends Error {
    constructor(msg: string) { super(msg); }
}

const toNewLineOnly = (str: string) => str.replace(/\r\n/g, '\n');

export default function parse(str: string) {
    // const metaMatchResult = (() => { try { return getAll(REGEXP_ICC_META, str) } catch (e) { throw new ICCParserError("could not parse the meta part of the document") } })();
    const metaMatchResult = getAll(REGEXP_ICC_META_MATCHER, str);

    if (metaMatchResult.length == 0 || metaMatchResult[0][1] != 'Version')
        throw new ICCParserError('the first field present in the document needs to be ICC-Version');

    if (metaMatchResult[0][2] != '1')
        throw new ICCParserError('can not parse other ICC-Versions than 1');

    const endOfMetaMatcher = metaMatchResult[metaMatchResult.length - 1].lastIndex;
    // const cardsMatchResult = (() => { try { return getAll(REGEXP_ICC_CARD_SIDE, str) } catch (e) { throw new ICCParserError("could not parse the cards part of the document") } })();
    const cardsMatchResult = getAll(REGEXP_ICC_CARD_SIDE_MATCHER, str, endOfMetaMatcher);

    const metaObjects: ICCMeta[] = [];
    for (const [, field, value] of metaMatchResult)
        metaObjects.push({ field, value })

    const cardsObjects: ICCCard[] = [];

    let bufferSide = true;
    let buffer: undefined | string;

    for (const [, sideIdentifier, cardContent] of cardsMatchResult) {
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
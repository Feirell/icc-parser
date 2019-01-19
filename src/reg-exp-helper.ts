type RealRegExpMatchArray = RegExpMatchArray & { groups: any };

export const getAll = (regexp: RegExp, str: string) => {
    const matches: RealRegExpMatchArray[] = [];
    let lastIndex = NaN;

    let match;
    while (match = regexp.exec(str), match != null) {
        lastIndex = regexp.lastIndex;
        matches.push(<RealRegExpMatchArray>match);
    }

    return { matches, lastIndex };
}

export const positiveLookahead = (str: string) => '(?=' + str + ')';
//export const positiveLookbehind = (str: string) => '(?<=' + str + ')';
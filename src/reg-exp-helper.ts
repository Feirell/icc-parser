interface FullRegExpMatchArray extends RegExpExecArray {
    lastIndex: number,
    groups: undefined | { [key: string]: undefined | string }
}

export const regexIterator = (regexp: RegExp, str: string, startIndex = 0) => {
    const copy = new RegExp(regexp);
    copy.lastIndex = startIndex;

    let done = false;

    const ite = {} as IterableIterator<FullRegExpMatchArray>

    ite.next = () => {
        if (done)
            return { done: true, value: undefined };

        const match = copy.exec(str) as FullRegExpMatchArray;
        match.lastIndex = copy.lastIndex;

        //we are done since we either did not match or can only match once
        done = match === null || !copy.global;

        if (match === null)
            return ite.next();

        // this prevent an infinite loop on zero width matches
        if (match.index == copy.lastIndex)
            copy.lastIndex++;

        return { done: false, value: match };
    }

    ite[Symbol.iterator] = () => ite;

    return ite;
}

export const getAll = (regexp: RegExp, str: string, startIndex?: number) => Array.from(regexIterator(regexp, str, startIndex));

export const positiveLookahead = (str: string) => '(?=' + str + ')';
//export const positiveLookbehind = (str: string) => '(?<=' + str + ')';
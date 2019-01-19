export class ICCDocument {
    constructor(
        public metaInformation: ICCMeta[],
        public cards: ICCCard[]
    ) { }
}

export class ICCMeta {
    constructor(
        public field: string,
        public value: string
    ) { }
}

export class ICCCard {
    front: string | null;
    back: string | null;

    constructor(front: string | null = null, back: string | null = null) {
        this.front = typeof front == 'string' ? '' + front : null;
        this.back = typeof back == 'string' ? '' + back : null;
    }
}
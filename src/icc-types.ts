export interface ICCDocument {
    metaInformation: ICCMeta[];
    cards: ICCCard[];
}

export interface ICCMeta {
    field: string;
    value: string;
}

export interface ICCCard {
    front?: string;
    back?: string;
}
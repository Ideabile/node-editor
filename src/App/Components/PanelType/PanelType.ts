import { observable } from "mobx";

export enum EPanelTypeOptionInputType {

    inputText,
    inputSelect,
    inputMultiSelect,
    inputBoolean,

}

export interface IPanelTypeOption {

    name: string;

    input: EPanelTypeOptionInputType;

}

export class PanelType {

    @observable public name: string;

    @observable public options: IPanelTypeOption[];

    constructor(name: string = "", options: IPanelTypeOption[] = []) {

        this.name = name;
        this.options = options;

    }

    public toJSON() {

        const {name, options} = this;

        return {
            name,
            options,
        };

    }

}

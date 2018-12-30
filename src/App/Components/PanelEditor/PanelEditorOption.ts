import { CustomElementDecorator } from "../../../Shared/CustomElement/CustomeElement";
import { observable, action } from "mobx";
import { EPanelTypeOptionInputType, IPanelTypeOption } from "../PanelType/PanelType";

@CustomElementDecorator({
    selector: 'panel-editor-option',
    template: `
<div>
<label for="name">Name</label>
<input type="text" name="name" />
<label for="type">Type</label>
<select name="type">
    <option value="inputText">text</option>
    <option value="inputSelect">select</option>
    <option value="inputMultiSelect">multy select</option>
    <option value="inputBoolean">boolean</option>
</select>
</div>
`,
    style: `
`,
    useShadow: true
})
export class PanelEditorOption extends HTMLElement {

    @observable option: IPanelTypeOption = { name: '', input: EPanelTypeOptionInputType.inputText };

    connectedCallback() {

        this.$type.addEventListener('change', () => this.setType());
        this.$name.addEventListener('keyup', () => this.setName());

    }

    get $name(): HTMLInputElement {

        return this.shadowRoot.querySelector('input');

    }

    get $type(): HTMLSelectElement {

        return this.shadowRoot.querySelector('select');

    }

    @action.bound
    private setName() {

        const { value } = this.$name;
        this.option.name = value;

    }

    @action.bound
    private setType() {
        const { value } = this.$type;
        switch (value) {
            case 'inputText':
                this.option.input = EPanelTypeOptionInputType.inputText;
                break;
            case 'inputSelect':
                this.option.input = EPanelTypeOptionInputType.inputSelect;
                break;
            case 'inputMultiSelect':
                this.option.input = EPanelTypeOptionInputType.inputMultiSelect;
                break;
            case 'inputBoolean':
                this.option.input = EPanelTypeOptionInputType.inputBoolean;
                break;
        }
    }
}

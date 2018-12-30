import { CustomElementDecorator } from "../../../Shared/CustomElement/CustomeElement";
import { PanelEditorOption } from "./PanelEditorOption";
import { observable, observe, action } from "mobx";
import { PanelType, IPanelTypeOption } from "../PanelType/PanelType";

@CustomElementDecorator({
    selector: 'panel-editor',
    template: `
    <h1>Panel Type Editor</h1>
    <p>Create new type of panels that are availabe on the node-editor.</p>
    <hr/>
    <form>
        <label for="panel-name">Panel Type Name:</label>
        <input name="panel-name" type="text" />
        <div class="options"></div>
        <hr/>
        <div class="controls">
            <button class="addPanelEditorOption">Add option <i class="fa fa-plus"></i></button>
            <button class="createPanel">Create Panel</button>
        </div>
    </form>
`,
    style: `
`,
    useShadow: true
})
export class PanelEditor extends HTMLElement {

    @observable name: string = '';

    @observable options: PanelEditorOption[] = [new PanelEditorOption()];

    connectedCallback() {

        this.renderPanelEditorOptions();
        observe(this.options, () => this.renderPanelEditorOptions());

        this.$addPanelEditorOption.addEventListener('click', (event: MouseEvent) => {

            event.preventDefault();
            this.addPanelEditorOption();

        });

        this.$panelName.addEventListener('keyup', () => this.setPanelName());

    }

    @action.bound
    private setPanelName() {

        this.name = this.$panelName.value;

    }

    private get $panelName(): HTMLInputElement {

        return this.shadowRoot.querySelector('input[name="panel-name"]');

    }

    private renderPanelEditorOptions() {

        this.$options.innerHTML = '';

        this.options.forEach((panel: PanelEditorOption) => {
            this.$options.appendChild(panel);
        });

    }

    @action.bound
    private addPanelEditorOption() {

        this.options.push(new PanelEditorOption());

    }

    get $createPannel(): HTMLElement {

        return this.shadowRoot.querySelector('.createPanel');

    }

    get $addPanelEditorOption(): HTMLElement {

        return this.shadowRoot.querySelector('.addPanelEditorOption');

    }

    get $options(): HTMLElement {

        return this.shadowRoot.querySelector('.options');

    }

    get $form(): HTMLFormElement {

        return this.shadowRoot.querySelector('form');

    }

    getPanelType(): PanelType {

        const { name } = this;
        const options: IPanelTypeOption[] = this.options.map(el => el.option);
        return new PanelType(name, options);

    }
}

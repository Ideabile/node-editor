import { CustomElementDecorator } from "../../../Shared/CustomElement/CustomeElement";
import { PanelEditorOption } from "./PanelEditorOption.tsx";
import { observable, observe, action } from "mobx";
import { PanelType, IPanelTypeOption } from "../PanelType/PanelType";
import { Component } from "../../../Shared/Component/Component";

@Component({
    selector: 'panel-editor',
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

    render(h) {

        return (
            <div className="panel-editor">
                <h1>Panel Type Editor</h1>
                <p>Create new type of panels that are availabe on the node-editor.</p>
                <hr/>
                <form>
                    <label for="panel-name">Panel Type Name:</label>
                    <input name="panel-name" type="text" />
                    <div className="options"></div>
                    <hr/>
                    <div className="controls">
                        <button className="addPanelEditorOption">Add option <i className="fa fa-plus"></i></button>
                        <button className="createPanel">Create Panel</button>
                    </div>
                </form>
            </div>
        );

    }

    @action.bound
    private setPanelName() {

        this.name = this.$panelName.value;

    }

    private get $panelName(): HTMLInputElement {

        return this.querySelector('input[name="panel-name"]');

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

        return this.querySelector('.createPanel');

    }

    get $addPanelEditorOption(): HTMLElement {

        return this.querySelector('.addPanelEditorOption');

    }

    get $options(): HTMLElement {

        return this.querySelector('.options');

    }

    get $form(): HTMLFormElement {

        return this.querySelector('form');

    }

    getPanelType(): PanelType {

        const { name } = this;
        const options: IPanelTypeOption[] = this.options.map(el => el.option);
        return new PanelType(name, options);

    }
}

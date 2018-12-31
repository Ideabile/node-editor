import { observable, observe, action } from "mobx";
import { IPanelType } from "../Panel/IPanelType";
import { SideBarPanelType } from "./SideBarPanelType.tsx";
import { PanelType } from "../PanelType/PanelType";
import { Panel } from "../Panel/Panel";
import { Component } from "../../../Shared/Component/Component";

@Component({
    selector: 'side-bar',
})
export class SideBar extends HTMLElement {


    @observable panelTypes: IPanelType[] = [];

    style() {
        return `
            .visually-hidden {
                position: absolute;
                left: -9999em;
            }

            .controls {
                position: absolute;
                top: 0;
                right: -42px;
                width: 40px;
                border: 1px solid #ccc;
            }

            .controls button {
                width: 40px;
                height: 40px;
            }

            button {
                background: white;
                border: 1px solid #ccc;
                font-size: 20px;
            }

            div {
                margin: 0;
                padding: 0;
                position: fixed;
                height: calc(100vh - 20px);
                border-right: 2px solid #ccc;
                background: white;
                width: 180px;
                padding: 10px;
                top: 0;
                left: -200px;
            }

            div.active {
                left: 0;
            }
        `;
    }

    render(h) {

        return (<div>
            <section className="controls">
                <button className="toggleSideBar">
                    <i className="fa fa-angle-left"></i>
                    <span className="visually-hidden">Toggle SideBar</span>
                </button>
                <button className="addPanelType">
                    <i className="fa fa-plus"></i>
                    <span className="visually-hidden">Add Panel Type</span>
                </button>
            </section>
            <h3>Panels</h3>
            <ul></ul>
        </div>);

    }

    get $toggleSidebar(): HTMLElement {

        return this.shadowRoot.querySelector('.toggleSidebar');

    }

    get $addPanelType(): HTMLElement {

        return this.shadowRoot.querySelector('.addPanelType');

    }

    get $sidebar(): HTMLElement {

        return this.shadowRoot.querySelector('div');

    }

    get $panelTypes(): HTMLElement {

        return this.shadowRoot.querySelector('ul');

    }

    connectedCallback() {

        this.$toggleSidebar.addEventListener('click', () => this.toggleSidebar());
        this.renderPanelTypes();

        observe(this.panelTypes, () => this.renderPanelTypes());

    }

    private toggleSidebar() {

        this.$sidebar.classList.toggle('active');

    }

    renderPanelTypes() {

        this.$panelTypes.innerHTML = '';

        this.panelTypes.forEach(panel => {

            const li = document.createElement('li');
            this.$panelTypes.appendChild(li);
            const panelType = new SideBarPanelType();

            panelType.setPanel(panel);
            li.appendChild(panelType);

        });

    }

    @action.bound
    addPanelType(panel: IPanelType) {

        this.panelTypes.push(panel);

    }

}

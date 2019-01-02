import { observable, observe, action } from "mobx";
import { IPanelType } from "../Panel/IPanelType";
import { SideBarPanelType } from "./SideBarPanelType.tsx";
import { PanelType } from "../PanelType/PanelType";
import { Panel } from "../Panel/Panel";
import { Component } from "../../../Shared/Component/Component";
import style from "./style.scss";

@Component({
    selector: 'side-bar',
})
export class SideBar extends HTMLElement {


    @observable panelTypes: IPanelType[] = [];

    render(h) {

        return (<div className="sidebar">
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

        return this.querySelector('.toggleSidebar');

    }

    get $addPanelType(): HTMLElement {

        return this.querySelector('.addPanelType');

    }

    get $sidebar(): HTMLElement {

        return this.querySelector('div.sidebar');

    }

    get $panelTypes(): HTMLElement {

        return this.querySelector('ul');

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

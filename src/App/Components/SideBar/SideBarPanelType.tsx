import { observable, action, observe } from "mobx";
import { PanelType } from "../PanelType/PanelType";
import { Component } from "../../../Shared/Component/Component";

@Component({
    selector: 'sidebar-panel-type',
})
export class SideBarPanelType extends HTMLElement {

    @observable panelType: PanelType = new PanelType();

    style() {
       return `
            div {
                width: 100%;
                height: 20px;
            }
       `;
    }

    render(h) {

        return <div draggable></div>;

    }

    get $el() {

        return this.shadowRoot.querySelector('div');

    }

    connectedCallback(){

        this.setPanelName();
        observe(this.panelType, () => this.setPanelName());
        this.$el.addEventListener('mousedown', (event) => this.onMouseDown(event));

    }

    private handleMouseUp = (event: MouseEvent) => {

        const { clientX, clientY } = event;
        const { panelType } = this;
        const detail = { panelType, x: clientX, y: clientY };
        const newPanelEvent = new CustomEvent('new-panel', {
            detail
        });

        window.dispatchEvent(newPanelEvent);
        window.removeEventListener('mouseup', this.handleMouseUp);

    }

    onMouseDown(event: MouseEvent) {

        event.preventDefault();
        window.addEventListener('mouseup', this.handleMouseUp);

    }

    @action.bound
    public setPanel(panel: PanelType) {

        this.panelType = panel;

    }

    private setPanelName() {

        this.$el.innerHTML = this.panelType.name;

    }
}

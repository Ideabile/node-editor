import { CustomElementDecorator } from "../../../Shared/CustomElement/CustomeElement";
import { observable, observe, action } from "mobx";
import { IPanelType } from "../Panel/IPanelType";
import { SideBarPanelType } from "./SideBarPanelType";
import { PanelType } from "../PanelType/PanelType";
import { Panel } from "../Panel/Panel";

@CustomElementDecorator({
    selector: 'side-bar',
    template: `
<div>
<section class="controls">
<button class="toggleSideBar">
<i class="fa fa-angle-left"></i>
<span class="visually-hidden">Toggle SideBar</span>
</button>
<button class="addPanelType">
<i class="fa fa-plus"></i>
<span class="visually-hidden">Add Panel Type</span>
</button>
</section>
<h3>Panels</h3>
<ul></ul>
</div>
`,
    style: `

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

`,
    useShadow: true
})
export class SideBar extends HTMLElement {

    @observable panelTypes: IPanelType[] = [];

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

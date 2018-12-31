import { observable, observe, action, autorun } from "mobx";
import { Panel } from "./Components/Panel/Panel.tsx";
import { Render } from "../Shared/Render/Render";
import { Grid } from "../Shared/Drawing/Grid";
import { ISize } from "../Shared/Drawing/ISize";
import { CustomElementDecorator } from "../Shared/CustomElement/CustomeElement";
import { SideBar } from "./Components/SideBar/SideBar";
import { PanelEditor } from "./Components/PanelEditor/PanelEditor";
import { PanelType } from "./Components/PanelType/PanelType";

interface ILayer {

    name: string;

    render: Render;

    size: ISize;

}


@CustomElementDecorator({
    selector: 'node-editor',
    template: `
<div class="app-layers"></div>
<div class="app-panels"></div>
<div class="app-side-bar"></div>
<div class="app-panel-editor">
<div class="body"></div>
</div>
`,
    style: `
canvas {
position: absolute;
min-width: 100vw;
min-height: 100vh;
}

.app-panel-editor {
display: none;
justify-content: center;
align-items: center;
position: fixed;
top: 0;
left: 0;
right: 0;
bottom: 0;
background: rgba(0,0,0,0.5);
z-index: 0;
}

.app-panel-editor .body {
position: fixed;
margin: 0 20px;
width: calc(60% - 20px);
max-height: calc(94% - 20px);
overflow: scroll;
padding: 10px;
background: #fff;
border: 2px solid #ccc;
}

.app-panel-editor.active {
display: flex;
}
`,
    useShadow: true
})
export default class App extends HTMLElement {

    @observable panels: Panel[] = [];

    @observable panelTypes: PanelType[] = [];

    private layers: ILayer[] = [];

    private sidebar: SideBar = new SideBar;

    private panelEditor: PanelEditor = new PanelEditor;

    get layerContainer(): HTMLElement {

        return this.shadowRoot.querySelector('.app-layers');

    }

    get panelContainers(): HTMLElement {

        return this.shadowRoot.querySelector('.app-panels');

    }

    get panelEditorContainer(): HTMLElement {

        return this.shadowRoot.querySelector('.app-panel-editor');

    }

    get sideBarContainer(): HTMLElement {

        return this.shadowRoot.querySelector('.app-side-bar');

    }

    connectedCallback() {

        this.addBackground();

        this.loadFromLocalStorage();

        this.addMainUI();

        // When pannel are add or remove
        autorun(() => this.saveToLocalStorage());

    }

    saveToLocalStorage() {

        const { panels, panelTypes } = this;

        const _panels = JSON.stringify(panels.map(p => p.toJSON()));
        const _panelsTypes = JSON.stringify(panelTypes.map(p => p.toJSON()));

        localStorage.setItem('panels', _panels);
        localStorage.setItem('panelsTypes', _panelsTypes);

    }

    @action.bound
    loadFromLocalStorage() {

        const  [panels, panelTypes] = [ localStorage.getItem('panels'), localStorage.getItem('panelsTypes') ];

        if (!!panels) {

            const arrPanels: { position: {x: number, y: number}, panelType: PanelType } [] = JSON.parse(panels);

            arrPanels.forEach((obj)=> {
                let {position, panelType } = obj;
                const {x, y} = position;
                panelType = new PanelType(panelType.name, panelType.options);

                this.addPanel({ panelType, x, y });

            });

        }

        if (!!panelTypes) {

            const arrPanelsTypes = JSON.parse(panelTypes);

            arrPanelsTypes.forEach((obj: PanelType) => {

                this.addPanelType(new PanelType(obj.name, obj.options));

            });

        }


    }

    addMainUI() {

        this.sideBarContainer.appendChild(this.sidebar);
        this.panelEditorContainer.querySelector('.body').appendChild(this.panelEditor);
        this.sidebar.$addPanelType.addEventListener('click', () => {

            this.panelEditorContainer.classList.toggle('active');

        });
        this.panelEditor.$createPannel.addEventListener('click', (e) => {

            e.preventDefault();
            const panelType: PanelType = this.panelEditor.getPanelType();
            this.addPanelType(panelType);
            this.panelEditorContainer.classList.toggle('active');

        });

        window.addEventListener('new-panel', (event: CustomEvent) => {
            this.addPanel(event.detail)
        });

    }

    @action.bound
    addPanelType(panelType: panelType) {

        this.sidebar.addPanelType(panelType);
        this.panelTypes.push(panelType);

    }

    @action.bound
    addPanel(panelConfig: { panelType: PanelType, x: number, y: number }) {

        const panel = new Panel();

        panel.setPanelType(panelConfig.panelType);
        this.panelContainers.appendChild(panel);

        panel.setPosition(panelConfig.x, panelConfig.y);

        this.panels.push(panel);

    }

    addLayer(name: string) {

        const render = this.createCanvas();
        this.layers.push({ name, render: new Render(render) });

        this.layerContainer.appendChild(render);

    }

    createCanvas(): HTMLCanvasElement {

        return document.createElement('canvas');

    }

    addBackground() {

        const canvas = this.createCanvas();
        const width = 200;
        const height = 200;
        const cellSize = 10;

        const render = new Render(canvas);
        render.setSize({ width, height });

        const grid = new Grid();
        grid.setSize({ width, height, cellSize });

        render.shapes.push(grid);
        render.draw();

        document.body.style['background'] = `url(${render.dataUrl}) repeat`;

    }


}

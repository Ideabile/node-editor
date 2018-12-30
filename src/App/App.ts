import { observable, observe } from "mobx";
import { Panel } from "./Components/Panel/Panel";
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
        this.addPanel();
        this.addMainUI();

        // When pannel are add or remove
        observe(this.panels, () => {});

    }

    addMainUI() {

        this.sideBarContainer.appendChild(this.sidebar);
        this.panelEditorContainer.querySelector('.body').appendChild(this.panelEditor);
        this.sidebar.$addPanelType.addEventListener('click', () => {

            this.panelEditorContainer.classList.toggle('active');

        });
        this.panelEditor.$createPannel.addEventListener('click', (e) => {

            e.preventDefault();
            const panelType = this.panelEditor.getPanelType();
            this.sidebar.addPanelType(panelType);
            this.panelEditorContainer.classList.toggle('active');

        });

    }

    addPanel() {

        const panel = new Panel();
        this.panelContainers.appendChild(panel);

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

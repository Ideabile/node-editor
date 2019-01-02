import { observable, observe, action, autorun } from "mobx";
import { Panel } from "./Components/Panel/Panel.tsx";
import { Render } from "../Shared/Render/Render";
import { Grid } from "../Shared/Drawing/Grid";
import { ISize } from "../Shared/Drawing/ISize";
import { CustomElementDecorator } from "../Shared/CustomElement/CustomeElement";
import { SideBar } from "./Components/SideBar/SideBar.tsx";
import { PanelEditor } from "./Components/PanelEditor/PanelEditor.tsx";
import { PanelType } from "./Components/PanelType/PanelType";
import { Component } from "../Shared/Component/Component";
import style from './style.scss';

interface ILayer {

    name: string;

    render: Render;

    size: ISize;

}

@Component({
    selector: 'node-editor'
})
export default class App extends HTMLElement {

    @observable panels: Panel[] = [];

    @observable panelTypes: PanelType[] = [];

    private layers: ILayer[] = [];

    private sidebar: SideBar = new SideBar;

    private panelEditor: PanelEditor = new PanelEditor;

    render(h) {

        return (
            <div>
                <div className="app-layers"></div>
                <div className="app-panels">{ this.panels.map(el => <div>{el}</div>) }</div>
                <div className="app-side-bar">{ this.sidebar }</div>
                <div className="app-panel-editor">
                    <div className="body">{ this.panelEditor }</div>
                </div>
            </div>
        );

    }

    get layerContainer(): HTMLElement {

        return this.querySelector('.app-layers');

    }

    get panelContainers(): HTMLElement {

        return this.querySelector('.app-panels');

    }

    get panelEditorContainer(): HTMLElement {

        return this.querySelector('.app-panel-editor');

    }

    get sideBarContainer(): HTMLElement {

        return this.querySelector('.app-side-bar');

    }

    connectedCallback() {

        this.addBackground();

        this.loadFromLocalStorage();

        this.addMainUI();

        // When pannel are add or remove
        autorun(() => {

            this.render();
            this.saveToLocalStorage();

        });

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

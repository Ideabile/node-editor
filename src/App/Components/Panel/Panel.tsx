import { observable, action, observe } from "mobx";
import { CustomElementDecorator } from "../../../Shared/CustomElement/CustomeElement";
import { PanelType } from "../PanelType/PanelType";
import { Component } from "../../../Shared/Component/Component";
import { ComponentRender } from "../../../Shared/Component/ComponentRender";
import style from './style.scss';


interface PanelPosition {

    x: number;

    y: number;

}

@Component({
    selector: 'node-panel'
})
export class Panel extends HTMLElement {

    @observable position: PanelPosition = { x: 0, y: 0};

    @observable panelType: PanelType = new PanelType;

    private initialPosition: PanelPosition = { x: 0, y: 0 };

    private handler: any = null;

    public toJSON() {

        const { position, panelType } = this;
        const {x, y} = position;

        return {
            position: {x, y},
            panelType: panelType.toJSON(),
        };

    }

    render(h: ComponentRender.h) {

        const stylePanel = {
            top: this.position.y,
            left: this.position.x
        };

        return (<div className="panel" style={stylePanel} id="02">
            <h3 className="panel__title">{this.panelType.name}</h3>
        </div>);

    }

    get $el() {

        return this.querySelector('.panel');

    }

    connectedCallback() {

        this.bindEvents();

    }

    @action
    public setPanelType(panelType: PanelType) {

        this.panelType = panelType;

    }

    @action.bound
    public setPosition(x: number, y: number) {

        this.position = { x, y };

    }

    private handleMouseMove = (event: MouseEvent) => {

        this.setPosition(
            event.clientX - this.initialPosition.x,
            event.clientY - this.initialPosition.y
        );

    }

    private handleMouseUp = () => {

        window.removeEventListener('mousemove', this.handleMouseMove, true);
        window.removeEventListener('mouseup', this.handleMouseUp);

        if (!this.handler) return;

        this.handler();

    }

    get $title(): HTMLElement {

        return this.querySelector('h3');

    }

    private onMouseDown(event: MouseEvent) {

        event.preventDefault();
        this.initialPosition.x = event.clientX - this.$el.offsetLeft;
        this.initialPosition.y = event.clientY - this.$el.offsetTop;

        if (this.handler) this.handler();

        this.handler = observe(this, 'position', () => this.render());
        window.addEventListener('mousemove', this.handleMouseMove, true);
        window.addEventListener('mouseup', this.handleMouseUp);

    }

    private bindEvents() {

        this.handler = observe(this, 'position', () => this.render());
        this.addEventListener('mousedown', (event) => this.onMouseDown(event));

    }

};

import { observable, action, observe } from "mobx";
import { CustomElementDecorator } from "../../../Shared/CustomElement/CustomeElement";


interface PanelPosition {

    x: number;

    y: number;

}

@CustomElementDecorator({
    selector: 'node-panel',
    template: `
<div class="panel" id="02" draggable>
    <h3 class="panel__title">Element one</h3>
</div>
`,
    style: `
.panel {
    min-width: 200px;
    position: absolute;
    border-radius: 2px;
    min-height: 200px;
    border: 1px solid #000;
    background-color: #333;
}
.panel__title {
    font-size: 12px;
    line-height: 20px;
    padding: 4px;
    min-height: 20px;
    font-weight: bold;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5) 0%, #333 50%);
    margin: 0;
    border-bottom: 1px solid #cacaca;
    color: #FFF;
}
`,
    useShadow: true
})
export class Panel extends HTMLElement {

    @observable position: object = { x: 0, y: 0};

    private initialPosition: PanelPosition = { x: 0, y: 0 };

    private handler: any = null;

    get $el() {

        return this.shadowRoot.querySelector('.panel');

    }

    connectedCallback() {

        this.bindEvents();

    }

    private move() {

        this.$el.style.left = this.position.x;
        this.$el.style.top = this.position.y;

        if (this.hasAttribute('data-connect')) {
            // paintLine(node, document.getElementById(node.getAttribute('data-connect')));
        }

    }

    @action
    private handleMouseMove = (event: MouseEvent) => {

        this.position = {
            x: event.clientX - this.initialPosition.x,
            y: event.clientY - this.initialPosition.y
        };

    }

    private handleMouseUp = () => {

        window.removeEventListener('mousemove', this.handleMouseMove, true);
        window.removeEventListener('mouseup', this.handleMouseUp);

        if (!this.handler) return;

        this.handler();

    }

    private onMouseDown(event: MouseEvent) {

        this.initialPosition.x = event.clientX - this.$el.offsetLeft;
        this.initialPosition.y = event.clientY - this.$el.offsetTop;

        this.handler = observe(this, 'position', () => this.move());
        window.addEventListener('mousemove', this.handleMouseMove, true);
        window.addEventListener('mouseup', this.handleMouseUp);

    }

    private bindEvents() {

        this.shadowRoot.addEventListener('mousedown', (event) => this.onMouseDown(event));

    }

};

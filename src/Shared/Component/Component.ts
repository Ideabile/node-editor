import { h, diff, patch, create } from 'virtual-dom';

interface ComponentConfig {
    selector:string;
    useShadow?: boolean;
}

const noop = () => {};

const validateSelector = (selector: string) => {
    if (selector.indexOf('-') <= 0) {
        throw new Error('You need at least 1 dash in the custom element name!');
    }
};

export interface IComponent {

    render: (h: h) => any;
    style: ?() => string;

}

export const Component = (config: ComponentConfig) => (cls: IComponent) => {

    validateSelector(config.selector);

    if (!cls.prototype.render) {
        throw new Error('You need a render method in you Component class');
    }

    const connectedCallback = cls.prototype.connectedCallback || noop;
    const disconnectedCallback = cls.prototype.disconnectedCallback || noop;
    const styleCallback = cls.prototype.style || noop;
    const renderCallback = cls.prototype.render || noop;

    const render = function (tag = '', attr = {}) {

        const content = Array.from(arguments).slice(2);
        return h(tag, attr, content);

    }

    cls.prototype.style = function(): HTMLElement {

        const style = styleCallback.call(this);

        if (!style) return false;

        if (style typeof 'string') {

            const tag = document.createElement('style');
            tag.innerHTML = `
@import "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.css";
${style}`;
            return tag;

        }

        return style;

    }

    cls.prototype._lastRender = null;

    cls.prototype.template = function() {

        return renderCallback.call(this, render);

    };

    cls.prototype.render = function() {

        const style = this.style();
        const content = this.template();

        const { _lastRender } = this;

        if (this.shadowRoot) {

            const patches = diff(_lastRender, content);
            this.rootNode = patch(this.rootNode, patches);
            this._lastRender = content;

            return;
        }

        this.rootNode = create(content);
        this._lastRender = content;
        this.attachShadow({mode: 'open'});

        if (style) {
            this.shadowRoot.appendChild(style);
        }

        this.shadowRoot.appendChild(this.rootNode);

    };

    cls.prototype.connectedCallback = function() {

        if (this.componentWillMount) {
            this.componentWillMount();
        }

        this.render();
        connectedCallback.call(this);

        if (this.componentDidMount) {
            this.componentDidMount();
        }

    };

    cls.prototype.disconnectedCallback = function() {
        if (this.componentWillUnmount) {
            this.componentWillUnmount();
        }
        disconnectedCallback.call(this);
        if (this.componentDidUnmount) {
            this.componentDidUnmount();
        }
    };

    window.customElements.define(config.selector, cls);
};

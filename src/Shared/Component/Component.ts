import { h, diff, patch, create } from 'virtual-dom';
import uuid from 'uuid';

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

}

export const Component = (config: ComponentConfig) => (cls: IComponent) => {

    validateSelector(config.selector);

    if (!cls.prototype.render) {
        throw new Error('You need a render method in you Component class');
    }

    const connectedCallback = cls.prototype.connectedCallback || noop;
    const disconnectedCallback = cls.prototype.disconnectedCallback || noop;
    const renderCallback = cls.prototype.render || noop;
    let partials = {};

    const render = function (tag = '', attr = {}) {

        const content = Array.from(arguments).slice(2).map(el => {

            if(typeof el.template !== 'function') return el;
            const id = uuid();
            partials[id] = el;

            return h('div', {attributes: { component: id }}, '');

        });

        return h(tag, attr, content);

    }

    cls.prototype._lastRender = null;

    cls.prototype.template = function() {

        return renderCallback.call(this, render);

    };

    cls.prototype.renderPartials = function() {

        Object.keys(partials).forEach((id) => {

            const child = partials[id];

            if (Array.isArray(child)) {

                child.forEach(el => {
                    this.querySelector(`[component="${id}"]`).appendChild(el);
                });

                return;

            }

            this.querySelector(`[component="${id}"]`).appendChild(child);

        });
        partials = {};

    }

    cls.prototype.render = function() {

        const content = this.template();

        const { _lastRender } = this;

        if (_lastRender) {

            const patches = diff(_lastRender, content);
            this.rootNode = patch(this.rootNode, patches);
            this._lastRender = content;
            this.renderPartials();

            return;
        }

        this.rootNode = create(content);
        this._lastRender = content;
        this.appendChild(this.rootNode);
        this.renderPartials();
        connectedCallback.call(this);

    };

    cls.prototype.connectedCallback = function() {

        if (this.componentWillMount) {
            this.componentWillMount();
        }

        this.render();

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

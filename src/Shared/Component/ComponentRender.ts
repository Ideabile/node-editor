export interface IComponentRenderHProps {

    (node: string, attributes: {} = {}, content: string | HTMLElement | []): HTMLElement;

}

export class ComponentRender {

    static h:IComponentRenderHProps = (node, attributes = {}, content = '') => {

        return ComponentRender.createElement(node, attributes, content);

    }

    static createElement:IComponentRenderHProps = (node, attributes, content) => {

        const $el = document.createElement(node);
        Object.keys(attributes).forEach(key => $el.setAttribute(key, attributes[key]));

        if (Array.isArray(content)) {
            content.map(el => $el.appendChild(el));
        } else if (content instanceof HTMLElement) {
            $el.appendChild(content);
        } else {
            $el.textContent = content;
        }

        return $el;
    }

}

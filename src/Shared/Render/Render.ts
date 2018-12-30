import { observable, observe, action, autorun } from "mobx";
import { IDraw } from "../Drawing/IDraw";

export interface IRenderSize {

    width: number;

    height: number;

}

export class Render {

    private canvas: HTMLCanvasElement;

    public shapes: IDraw[] = [];

    @observable size: IRenderSize = { width: 0, height: 0 };

    @action.bound
    public setSize(size: IRenderSize) {

        this.size = size;

    }

    get ctx(): CanvasRenderingContext2D {

        return this.canvas.getContext('2d');

    }

    get dataUrl() {

        return this.canvas.toDataURL();

    }

    constructor(canvas: HTMLCanvasElement) {

        this.canvas = canvas;
        observe(this, 'size', () => this.resize());

    }

    resize(): void {

        const { width, height } = this.size;
        this.canvas.width = width;
        this.canvas.height = height;

    }


    public clear() {

        const { ctx, size } = this;
        ctx.clearRect(0, 0, size.width, size.height);

    }

    public draw() {

        const { ctx, shapes } = this;
        shapes.forEach(shape => shape.draw(ctx));

    }

}

import { IDraw } from "./IDraw";

export interface IGridProps {

    cellSize: number;

    width: number;

    height: number;

};

export class Grid implements IDraw {

    private sizes: IGridProps = { cellSize: 0, width: 0, height: 0 };

    public setSize(sizes: IGridProps) {

        this.sizes = sizes;

    }

    public draw(ctx: CanvasRenderingContext2D) {

        const { sizes } = this;

        const gridCellWidth = Math.ceil(sizes.width / sizes.cellSize);
        const gridCellHeight = Math.ceil(sizes.height / sizes.cellSize);

        ctx.lineWidth = 0.1;

        const arr = new Array(gridCellHeight)
            .fill(new Array(gridCellWidth).fill().map((x, i) => i));

        arr.forEach((columns, row) => {

            columns.forEach((c, column: number) => {

                ctx.strokeRect(column * sizes.cellSize, row * sizes.cellSize, sizes.cellSize, sizes.cellSize);

            });

        });

    }

};

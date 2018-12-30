class Line implements IDraw {

    draw(ctx) {

        ctx.beginPath();
        ctx.moveTo(parseInt(boxOne.offsetLeft), parseInt(boxOne.offsetTop));
        ctx.lineTo(parseInt(boxTwo.style.left), parseInt(boxTwo.style.top));
        ctx.stroke();

    }

}

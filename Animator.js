class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, repeat = true) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration, repeat});
        this.scale = params.scale;
        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
        this.done = false;
    }

    drawFrame(tick, ctx, x, y, width = this.width, height = this.height, inverted = false) {
        if (this.repeat || !this.done)
        {
            const frame = this.currentFrame();
            this.elapsedTime += tick;
            if (this.elapsedTime > this.totalTime) {
                this.elapsedTime -= this.totalTime;
                if (!this.repeat) { this.done = true; }
            }

            if(inverted){ ctx.filter = 'invert(1)'; }
            else { ctx.filter = 'none'; }
            ctx.drawImage(this.spritesheet, 
                this.xStart + this.width*frame, this.yStart, 
                this.width, this.height, 
                (x - screenX() - width / 2) * params.scale, (y - screenY() - height / 2) * params.scale, 
                width * this.scale, height * this.scale);

        }
    }

    drawRotatedFrame(tick, ctx, x, y, angle)
    {
        ctx.save();

        ctx.translate(x, y);

        ctx.rotate(angle);

        this.drawFrame(tick, ctx, -(this.width/2), -(this.height/2))
    
        ctx.restore();
    }

    currentFrame() {
        return Math.floor(this.elapsedTime /  this.frameDuration);
    }
}

function drawCircle(ctx, x, y, radius, fill, stroke, strokeWidth) {
    ctx.beginPath();
    ctx.arc((x - screenX()) * params.scale, (y - screenY()) * params.scale, radius * params.scale, 0, 2 * Math.PI, false);
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth * params.scale;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}

function draw_rect(ctx, x, y, width, height, fill, stroke, strokeWidth)
{
    ctx.beginPath();
        ctx.rect((x - screenX() - width/2) * params.scale, (y - screenY() - height/2) * params.scale, width * params.scale, height * params.scale);
        ctx.stroke();
    if (fill) {
        ctx.fillStyle = fill;
        ctx.fill();
    }
    if (stroke) {
        ctx.lineWidth = strokeWidth;
        ctx.strokeStyle = stroke;
        ctx.stroke();
    }
}
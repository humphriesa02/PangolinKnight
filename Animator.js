class Animator {
    constructor(spritesheet, xStart, yStart, width, height, frameCount, frameDuration, repeat = true) {
        Object.assign(this, {spritesheet, xStart, yStart, width, height, frameCount, frameDuration, repeat});
        this.elapsedTime = 0;
        this.totalTime = frameCount * frameDuration;
        this.done = false;
    }

    drawFrame(tick, ctx, x, y, width = this.width, height = this.height) {
        if (this.repeat || !this.done)
        {
            this.elapsedTime += tick;
            if (this.elapsedTime > this.totalTime) {
                this.elapsedTime -= this.totalTime;
                if (!this.repeat) { this.done = true; }
            }
            const frame = this.currentFrame();

            ctx.drawImage(this.spritesheet, 
                this.xStart + this.width*frame, this.yStart, 
                this.width, this.height, 
                x, y, 
                width, height);
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
// This game shell was happily modified from Googler Seth Ladd's "Bad Aliens" game and his Google IO talk in 2011

class GameEngine {
    constructor(options) {
        // What you will use to draw
        // Documentation: https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
        this.ctx = null;

        // Everything that will be updated and drawn each frame
        this.entities = [];
        this.entity_map = new Map([
            ["player", []],
            ["enemy", []],
            ["sword", []],
            ["prop", []],
            ["tile", []]
        ]);

        // Information on the input
        this.click = null;
        this.mouse = null;
        this.wheel = null;
        this.keys = {};

        // Options and the Details
        this.options = options || {
            debugging: false,
        };

        this.gravity = false;
        this.paused = false;
        this.hud = null;
    };

    init(ctx) {
        this.ctx = ctx;
        this.startInput();
        this.timer = new Timer();
        this.menu = new Menu();
    };

    start() {
        console.log("Started")
        this.running = true;
        const gameLoop = () => {
            this.loop();
            requestAnimFrame(gameLoop, this.ctx.canvas);
        };
        gameLoop();
    };

    startInput() {
        const getXandY = e => ({
            x: e.clientX - this.ctx.canvas.getBoundingClientRect().left,
            y: e.clientY - this.ctx.canvas.getBoundingClientRect().top
        });
        
        this.ctx.canvas.addEventListener("mousemove", e => {
            if (this.options.debugging) {
                console.log("MOUSE_MOVE", getXandY(e));
            }
            this.mouse = getXandY(e);
        });

        this.ctx.canvas.addEventListener("click", e => {
            if (this.options.debugging) {
                console.log("CLICK", getXandY(e));
            }
            this.click = getXandY(e);
        });

        this.ctx.canvas.addEventListener("wheel", e => {
            if (this.options.debugging) {
                console.log("WHEEL", getXandY(e), e.wheelDelta);
            }
            e.preventDefault(); // Prevent Scrolling
            this.wheel = e;
        });

        this.ctx.canvas.addEventListener("contextmenu", e => {
            if (this.options.debugging) {
                console.log("RIGHT_CLICK", getXandY(e));
            }
            e.preventDefault(); // Prevent Context Menu
            this.rightclick = getXandY(e);
        });

        this.ctx.canvas.addEventListener("keydown", event => this.keys[event.key] = true);
        this.ctx.canvas.addEventListener("keyup", event => this.keys[event.key] = false);
    };

    addEntity(entity) {
        this.entities.push(entity);

        if (entity.tag !== undefined) {
            if (this.entity_map.get(entity.tag) === undefined) {
                this.entity_map.set(entity.tag, [entity]);
            }
            else {
                this.entity_map.get(entity.tag).push(entity);
            }
        }
    };

    draw() {
        // Clear the whole canvas with transparent color (rgba(0, 0, 0, 0))
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        // Draw latest things first
        for (let i =  0; i < this.entities.length; i++) {
            this.entities[i].draw(this.ctx, this);
            if(document.getElementById("debug").checked){
                if (this.entities[i].collider !== undefined) {
                    if (this.entities[i].collider.area instanceof AABB) {
                        draw_rect(this.ctx, this.entities[i].transform.pos.x, this.entities[i].transform.pos.y, 
                            this.entities[i].collider.area.half.x * 2, this.entities[i].collider.area.half.y * 2, false, true, 1);
                    }
                    else if (this.entities[i].collider.area instanceof Circle) {
                        draw_circle(this.ctx, this.entities[i].transform.pos.x, this.entities[i].transform.pos.y,
                             this.entities[i].collider.area.radius, false, true, 1);
                    }
                    else if (this.entities[i].collider.area instanceof Qtr_Pipe ||
                        this.entities[i].collider.area instanceof Ramp) {
                        let points = this.entities[i].collider.area.polygon;
                        this.ctx.beginPath();
                        for (let i = 0; i < points.length - 1; i++) {
                            this.ctx.moveTo((points[i].x - screenX()) * params.scale, (points[i].y - screenY()) * params.scale);
                            this.ctx.lineTo((points[i+1].x - screenX()) * params.scale, (points[i+1].y - screenY()) * params.scale);
                        }
                        this.ctx.stroke();
                    }
                }
                if (this.entities[i].colliders !== undefined) {
                    for (let collider of this.entities[i].colliders) {
                        if (collider.area instanceof AABB) {
                            draw_rect(this.ctx, collider.area.center.x, collider.area.center.y, 
                                collider.area.half.x * 2, collider.area.half.y * 2, false, true, 1);
                        }
                        else if (collider.area instanceof Circle) {
                            draw_circle(this.ctx, collider.area.center.x, collider.area.center.y,
                                 collider.area.radius, false, true, 1);
                        }
                    }
                }
            }
        }
        if(this.hud !== null){
            this.hud.draw(this.ctx);
        }
        

        if(this.paused){
            this.menu.draw(this.ctx);
        }

        if(document.getElementById("debug").checked){
            let fps = Math.round(1 / this.clockTick);
            let text = "fps: " + fps.toString();
            this.ctx.font = "15px Arial";
            this.ctx.fillStyle = "white";
            this.ctx.fillText(text, 600, 40);
            this.ctx.stroke();
        }
        
    };

    update() {
        let entitiesCount = this.entities.length;
        this.updateAuidio();
        if(!this.paused){
            for (let i = 0; i < entitiesCount; i++) {
                let entity = this.entities[i];
    
                if (!entity.removeFromWorld && entity.updatable) {
                    entity.update();
                }
            }
    
            for (let i = this.entities.length - 1; i >= 0; --i) {
                if (this.entities[i].removeFromWorld) {
                    if(this.entities[i].tag != undefined){
                        let index = this.entity_map.get(this.entities[i].tag).indexOf(this.entities[i]);
                        this.entity_map.get(this.entities[i].tag).splice(index, 1);
                    }
                    this.entities.splice(i, 1);
                }
            }
            if(this.hud !== null){
                this.hud.update();
            }
            if(this.gravity){
                physics(this.entities, this.entity_map);
            }
            
        }
        else{
            this.menu.update();
        }
    };

    loop() {
        this.clockTick = this.timer.tick();
        this.update();
        this.draw();

        this.click = null;
        this.rightclick = null;
        this.wheel = null;
    };
    updateAuidio() {
        var mute = document.getElementById("mute").checked;
        var volume = document.getElementById("volume").value;

        ASSET_MANAGER.muteAudio(mute);
        ASSET_MANAGER.adjustVolume(volume);
    }
};

// KV Le was here :)
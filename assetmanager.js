class AssetManager {
    constructor() {
        this.successCount = 0;
        this.errorCount = 0;
        this.cache = [];
        this.downloadQueue = [];
    };

    queueDownload(path) {
        console.log("Queueing " + path);
        this.downloadQueue.push(path);
    };

    isDone() {
        return this.downloadQueue.length === this.successCount + this.errorCount;
    };

    downloadAll(callback) {
        if (this.downloadQueue.length === 0) setTimeout(callback, 10);
        for (let i = 0; i < this.downloadQueue.length; i++) {
            var that = this;

            var path = this.downloadQueue[i];
            console.log(path);
            var ext = path.substring(path.length-3);

            switch(ext) {
                case 'png' :
                case 'jpg' :
                    const img = new Image();
                    img.addEventListener("load", () => {
                        console.log("Loaded " + this.src);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });

                    img.addEventListener("error", () => {
                        console.log("Error loading " + this.src);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    img.src = path;
                    this.cache[path] = img;
                    break;
                case 'wav' :
                case 'mp3' :
                    const aud = new Audio();
                    aud.addEventListener("loadeddata", () => {
                        console.log("Loaded " + this.src);
                        this.successCount++;
                        if (this.isDone()) callback();
                    });

                    aud.addEventListener("error", () => {
                        console.log("Error loading " + this.src);
                        this.errorCount++;
                        if (this.isDone()) callback();
                    });

                    aud.addEventListener("ended", function () {
                        aud.pause();
                        aud.currentTime = 0;
                    });

                    aud.src = path;
                    aud.load();
                    this.cache[path] = aud;
                    break;
            }
        }
    };
    
    getAsset(path) {
        return this.cache[path];
    };
    
    playAsset(path) {
        let aud = this.cache[path];
        aud.currentTime = 0;
        aud.play();
    }

    pauseAsset(path) {
        var aud = this.cache[path];
        aud.currentTime = 0;
        aud.pause();
    }

    muteAudio(mute){
        for(var key in this.cache){
            let asset = this.cache[key];
            if(asset instanceof Audio){
                asset.muted = mute;
            }
        }
    }

    adjustVolume(volume){
        for(var key in this.cache){
            let asset = this.cache[key];
            if(asset instanceof Audio){
                asset.volume = volume;
            }
        }
    }

    pauseBackgroundMusic(){
        for(var key in this.cache){
            let asset = this.cache[key];
            if(asset instanceof Audio){
                asset.pause();
                asset.currentTime = 0;
            }
        }
    }

    autoRepeat(path) {
        var aud = this.cache[path];
        aud.addEventListener("ended", function () {
            aud.play();
        });
    }
};


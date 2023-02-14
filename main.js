const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/pangolin_sheet.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_slash_sheet.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_sword_anim.png");
ASSET_MANAGER.queueDownload("./sprites/map.png");
ASSET_MANAGER.queueDownload("./sprites/Entities.png")
ASSET_MANAGER.queueDownload("./sprites/pangolin_shadow.png");
ASSET_MANAGER.queueDownload("./sprites/frog_enemy.png");
ASSET_MANAGER.queueDownload("./sprites/Level1map.png");
ASSET_MANAGER.queueDownload("./sprites/explosion.png");
ASSET_MANAGER.queueDownload("./sprites/Items.png");
ASSET_MANAGER.queueDownload("./sprites/PangolinPauseScreen.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_inventory.png");
ASSET_MANAGER.queueDownload("./sprites/Pangolin_upclose.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	params.scale = document.getElementById("scale").value;
	const setScale = document.getElementById("reset");

	gameEngine.init(ctx);

	const manager = new sceneManager(gameEngine);

	gameEngine.start();

	setScale.addEventListener('click', function(e) {
		params.scale = document.getElementById("scale").value;
		clearEntities();
		ctx.canvas.width =  roomWidth * params.scale;
		ctx.canvas.height = roomHeight * params.scale;
		ctx.imageSmoothingEnabled = false;
		manager.loadLevel(1);
	});
});

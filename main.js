const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/pangolin_sheet.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_slash_sheet.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_sword_anim.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_shadow.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	gameEngine.init(ctx);

	gameEngine.start();
});

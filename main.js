const gameEngine = new GameEngine();

const ASSET_MANAGER = new AssetManager();

ASSET_MANAGER.queueDownload("./sprites/pangolin_sheet.png");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	let pangolin = new Pangolin(gameEngine);
	
	gameEngine.addEntity(pangolin)

	gameEngine.init(ctx);

	gameEngine.start();
});

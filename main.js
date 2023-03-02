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
ASSET_MANAGER.queueDownload("./sprites/leveltwo.png");
ASSET_MANAGER.queueDownload("./sprites/PangolinPauseScreen.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_inventory.png");
ASSET_MANAGER.queueDownload("./sprites/Pangolin_upclose.png");
ASSET_MANAGER.queueDownload("./sprites/slime_enemy.png");
ASSET_MANAGER.queueDownload("./sprites/title_screen.png");
ASSET_MANAGER.queueDownload("./sprites/slime_child_enemy.png");
ASSET_MANAGER.queueDownload("./sprites/skelly.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_play.png");
ASSET_MANAGER.queueDownload("./sprites/pangolin_lose_screen.png");
ASSET_MANAGER.queueDownload("./sounds/Memoraphile.mp3");

ASSET_MANAGER.downloadAll(() => {
	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");
	ctx.imageSmoothingEnabled = false;

	params.scale = document.getElementById("scale").value;
	const setScale = document.getElementById("reset");

	gameEngine.init(ctx);

	var manager = new sceneManager(gameEngine);
	let menu = new mainmenu()
	gameEngine.addEntity(menu);
	gameEngine.addEntity(menu.startbutton);
	gameEngine.addEntity(menu.levelselect);
	gameEngine.start();

	setScale.addEventListener('click', function(e) {
		let reset = window.confirm("This will send you back to the main menu.\ndo you wish to continue?")
		if(reset){
			params.scale = document.getElementById("scale").value;
			clearEntities();
			ctx.canvas.width =  roomWidth * params.scale;
			ctx.canvas.height = roomHeight * params.scale;
			ctx.imageSmoothingEnabled = false;
			let menu = new mainmenu()
			gameEngine.addEntity(menu);
			gameEngine.addEntity(menu.startbutton);
			gameEngine.addEntity(menu.levelselect);
			manager = new sceneManager(gameEngine);
			gameEngine.paused = false;
			gameEngine.menu.current_displayed = menu_enum.main;
		}
	});
});

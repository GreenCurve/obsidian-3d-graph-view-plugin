// import { App, MarkdownView, Modal, Notice, Plugin } from 'obsidian';
// import { Ob3gvView, VIEW_TYPE_OB3GV } from "./view";

// export default class Ob3dgvPlugin extends Plugin {
// 	async onload() {
// 		this.registerView(
// 			VIEW_TYPE_OB3GV,
// 			(leaf) => new Ob3gvView(leaf)
// 		);
	
// 		this.addRibbonIcon("workflow", "Open 3D", () => {
// 			this.activateView();
// 		}); 
// 	}
  
// 	async onunload() {
// 	  	this.app.workspace.getLeavesOfType(VIEW_TYPE_OB3GV);
// 	}

// 	async activateView() {
// 	  // this.app.workspace.detachLeavesOfType(VIEW_TYPE_OB3GV);
  
// 	  await this.app.workspace.getLeaf(false).setViewState({
// 		type: VIEW_TYPE_OB3GV,
// 		active: true,
// 	  });
  
// 	  this.app.workspace.revealLeaf(
// 		this.app.workspace.getLeavesOfType(VIEW_TYPE_OB3GV)[0]
// 	  );
// 	}
//   }

import { Plugin } from "obsidian";
import { Graph3DView, VIEW_TYPE_3D_GRAPH } from "./view";

export default class MyPlugin extends Plugin {
  async onload() {
    this.registerView(VIEW_TYPE_3D_GRAPH, (leaf) => new Graph3DView(leaf));

	this.addRibbonIcon("workflow", "Open 3D", () => {
		this.activateView();
	}); 
  }

  async activateView() {
    const leaf = this.app.workspace.getLeaf(true);
    await leaf.setViewState({ type: VIEW_TYPE_3D_GRAPH, active: true });
  }
}

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
  async onunload() {
      console.log("3D Graph plugin unloaded");
      // nothing else needed yet
    }
}

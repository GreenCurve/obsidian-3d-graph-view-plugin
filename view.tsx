import { ItemView, WorkspaceLeaf } from "obsidian";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { Dgraph7c94cd } from "ReactView";
import { Graph_processing } from "graph_processer.tsx"
import { GUI } from "dat.gui";
import { TFile } from "obsidian";
import * as d3 from "d3";
import * as THREE from 'three';
import { getRandomColor } from "functions_spellbook.tsx";




export const VIEW_TYPE_3D_GRAPH = "3d-graph-view";

export class Graph3DView extends ItemView {
  private graphContainer: HTMLDivElement;
  private graph: any;

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }

  getViewType(): string {
    return VIEW_TYPE_3D_GRAPH;
  }

  getDisplayText(): string {
    return "3D Graph View";
  }

  async onOpen() {

    //CREATE GUI!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


    // Create the container for the 3D graph
    this.graphContainer = document.createElement("div");
    this.graphContainer.style.width = "100%";
    this.graphContainer.style.height = "100%";
    this.containerEl.appendChild(this.graphContainer);

    const graph_data = Graph_processing()

    this.graph = ForceGraph3D()(this.graphContainer)
      .graphData(graph_data)
      .backgroundColor("#202020")
      // Set node labels
      .nodeLabel("id")
      // // Customize node appearance
      .nodeColor((node) => node.color || "#b6bfc1db")
      .nodeThreeObjectExtend(true)
      .nodeThreeObject((node) => {
        const sprite = new SpriteText(node.id);
        sprite.color = "lightgrey";
        sprite.textHeight = 4;
        return sprite;
      })
      // // Customize link appearance
      .linkColor((link) => link.color || "#f5f5f5")
      .linkWidth((link) => (link.color ? 1 : 0))
      .linkCurveRotation(4)
      .linkDirectionalArrowColor("#ffffff")
      .linkDirectionalArrowLength(0)
      .linkDirectionalParticles(2)
      .linkDirectionalParticleWidth(0.8)
      .linkDirectionalParticleSpeed(0.006)
      .onNodeClick(node => this.handleClick(node));

    // Resolve source/target references to node objects
    const data = this.graph.graphData()
    const nodeById = Object.fromEntries(data.nodes.map(n => [n.id, n]));
    data.links.forEach(link => {
      link.source = nodeById[link.source];
      link.target = nodeById[link.target];
    });
    this.graph.graphData(data);


    // Then disable forces
    this.graph.d3Force('charge', null);
    this.graph.d3Force('link', null);
    this.graph.d3Force('center', null);


    // //adding cubes
    // for (let cluster of graph_data[1]){
    //   let scene = this.graph.scene();
    //   let y_dimension = 60
    //   const geometry = new THREE.BoxGeometry(45, y_dimension, 45);
    //   let node = cluster[1][0]
    //   let material = new THREE.MeshStandardMaterial({
    //     color: getRandomColor(),
    //     transparent: true,
    //     opacity: 0.3,
    //     depthWrite: false  
    //   });

    //   let cube = new THREE.Mesh(geometry, material);
    //   cube.position.set(node.x, node.y + y_dimension/2, node.z);
    //   scene.add(cube);
    // }




  }

  handleClick(node) {
    // Ensure the node has a valid path
    if (!node.path) return; 
    const file = this.app.vault.getAbstractFileByPath(node.path);
    if (file && file instanceof TFile) {
      this.app.workspace.getLeaf().openFile(file);
    } else {
      console.warn("File not found:", node.path);
    }
  }

  async onClose() {
    this.graphContainer.remove();
  }
}

import { ItemView, WorkspaceLeaf } from "obsidian";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { CoordinateProcessing } from "Coordinates.tsx"
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

    const graph_data = CoordinateProcessing()

    this.graph = ForceGraph3D()(this.graphContainer)
      .graphData(graph_data[0])
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


    // // adding cylinders instead of cubes
    // for (let ClusterChain of graph_data[1]) {
    //   let node = ClusterChain.root.root
    //   let scene = this.graph.scene();
    //   let y_dimension = 60;   // height of cylinder
    //   const radiusTop = 20;    // radius of top circle
    //   const radiusBottom = 20; // radius of bottom circle
    //   const height = y_dimension;
    //   const radialSegments = 32; // smoothness of the cylinder

    //   const geometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);

    //   let material = new THREE.MeshStandardMaterial({
    //     color: getRandomColor(),
    //     transparent: true,
    //     opacity: 0.3,
    //     depthWrite: false  
    //   });

    //   let cylinder = new THREE.Mesh(geometry, material);

    //   // Position: note y + half height so base sits on node.y
    //   cylinder.position.set(node.x, node.y + height / 2, node.z);

    //   scene.add(cylinder);
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

  //gpt written
  async onClose() {
    // Stop animation
    if (this.graph) {
      this.graph.pauseAnimation();

      // Dispose of Three.js objects to release GPU memory
      const scene = this.graph.scene();
      scene.traverse((object) => {
        if (object.isMesh) {
          object.geometry?.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach(m => m.dispose?.());
          } else {
            object.material?.dispose?.();
          }
        }
      });

      // Optional: Clear the graph data
      this.graph.graphData({ nodes: [], links: [] });
    }

    // Remove DOM container
    this.graphContainer.remove();
  }
}

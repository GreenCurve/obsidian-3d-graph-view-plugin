import { ItemView, WorkspaceLeaf } from "obsidian";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { Dgraph7c94cd } from "ReactView";
import { Graph_processing } from "graph_processer.tsx"
import { GUI } from "dat.gui";
import { TFile } from "obsidian";
import * as d3 from "d3";




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

    // Initialize 3D Force Graph
    const graph_data = {
      "nodes":[],
      "links":[]
    }

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
      // .linkCurvature((link) => (link.curvature ? 0.5 : 0))
      .linkCurveRotation(4)
      .linkDirectionalArrowColor("#ffffff")
      .linkDirectionalArrowLength(0)
      .linkDirectionalParticles(2)
      .linkDirectionalParticleWidth(0.8)
      .linkDirectionalParticleSpeed(0.006)
      .onNodeClick(node => this.handleClick(node));

    // Resolve source/target references to node objects
    // const nodeById = Object.fromEntries(data.nodes.map(n => [n.id, n]));
    // data.links.forEach(link => {
    //   link.source = nodeById[link.source];
    //   link.target = nodeById[link.target];
    // });

    // this.graph.graphData(data);


    // Then disable forces
    this.graph.d3Force('charge', null);
    this.graph.d3Force('link', null);
    this.graph.d3Force('center', null);

    //Slowly add nodes
    let [nodes_map_1, nodes_order_1] = Graph_processing()
    let distance = 0
    const interval = setInterval(() => {
      if (!(nodes_order_1.length === 0)){
        // console.log(nodes_order_1)
        const { nodes, links } = this.graph.graphData();
        let new_node = nodes_map_1.get(nodes_order_1.shift())
        //root nodes
        if ((new_node.parents.size === 0) && (new_node.children.size !== 0)) {
          new_node.y = 0
          new_node.x = (Math.random() - 0.5) * 1000
          new_node.z = (Math.random() - 0.5) * 1000
        //class nodes but not roots
        } else if ((new_node.parents.size !== 0)) {
          new_node.y = 0
          new_node.x = 0
          new_node.z = 0
          //av of the coordinates
          for (let parent of new_node.parents) {
            new_node.y += nodes_map_1.get(parent).y
            new_node.x += nodes_map_1.get(parent).x
            new_node.z += nodes_map_1.get(parent).z
          }
          new_node.y = new_node.y/new_node.parents.size
          new_node.x = new_node.x/new_node.parents.size
          new_node.z = new_node.z/new_node.parents.size

          new_node.y += 10
        //any other normal node
        } else {
          new_node.y = distance;
          new_node.x = 0
          new_node.z = 0
          distance += 10
        }
        nodes.push(new_node)
        this.graph.graphData({ nodes, links });
      } else {
        distance = 0
        clearInterval(interval);
        console.log('Finished Graph Building from interval',nodes_map_1)
        return;

      }
    }, 100);
  }

  handleClick(node) {
    if (!node.path) return; // Ensure the node has a valid path

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

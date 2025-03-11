// import { ItemView, TAbstractFile, TFile, WorkspaceLeaf } from "obsidian";
// import * as React from "react";
// import * as ReactDOM from "react-dom";
// import { createRoot } from "react-dom/client";
// import ForceGraph3D from 'react-force-graph-3d';
// import SpriteText from 'three-spritetext';
// import { Dgraph7c94cd } from "ReactView"
// export const VIEW_TYPE_OB3GV = "Obsidian-3D-Graph-Viewer";
// import { useWindowSize } from '@react-hook/window-size';


// export class Ob3gvView extends ItemView {
//   constructor(leaf: WorkspaceLeaf) {
//     super(leaf);
//   }

//   getViewType() {
//     return VIEW_TYPE_OB3GV;
//   }

//   getDisplayText() {
//     return "3D Graph View";
//   }

//   async onOpen() {
//     const { useRef, useCallback, useState, useEffect } = React;
//     const FocusGraph = () => {
//       const graphJson = Dgraph7c94cd()
//       const [refresh, setData] = useState(Dgraph7c94cd());
//       useEffect(() => {
//         // refresh graphJson when metadataCache changed
//         this.registerEvent(this.app.metadataCache.on('changed', () => {
//           const refresh = Dgraph7c94cd()
//           console.log('🐟 metadataCache changed!');
//           setData(() => {
//             let graphJson = refresh
//             return graphJson
//           });
//         }))
//       }, []);

//       const [width, height] = useWindowSize();
//       const fgRef = useRef();

//       // const handleClick = useCallback(async node => {
//       //   // move markdown file when click
//       //   const nodePath = node.path
//       //   const dgNodefile: TFile = app.vault.getAbstractFileByPath(nodePath)
//       //   const file = app.vault.getFileByPath(dgNodefile.path)

//       //   if (file) {
//       //     const newPath = file.path.replace("Workspace", "Подольск");
//       //     await this.app.fileManager.renameFile(file, newPath);
//       //     new Notice(`File moved to ${newPath}`);
//       //     console.log(file.path)
//       //   } else {
//       //     new Notice('No active file found');
//       //   }

//       // }, [fgRef]);

//       const handleClick = useCallback(node => {
//         // Open markdown file when click
//         const nodePath = node.path
//         const dgNodefile: TFile = app.vault.getAbstractFileByPath(nodePath)
//         app.workspace.getLeaf().openFile(dgNodefile);
//         // Auto-focus center node
//         // credit to vasturiano/react-force-graph/example/camera-auto-orbit
//         // const distance = 200;
//         // const distRatio = 1 + distance / Math.hypot(node.x, node.y, node.z);
//         // fgRef.current.cameraPosition(
//         //   { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio },
//         //   node, // lookAt ({ x, y, z })
//         //   1500  // ms transition duration
//         // );
//       }, [fgRef]);

//       // useEffect(() => {

//       //   this.registerEvent(this.app.workspace.on('file-open',() => {
//       //     const currentFileName = app.workspace.getActiveFile()?.basename
//       //     let currentNode
//       //     for (let q = 0; q < graphJson.nodes.length; q++) {
//       //       let node = graphJson.nodes[q]
//       //       let nodeid = node.id
//       //       if (nodeid == currentFileName) {
//       //         currentNode = node
//       //       }
//       //     }
//       //     const distance = 200;
//       //     const distRatio = 1 + distance / Math.hypot(currentNode.x, currentNode.y, currentNode.z);
//       //     fgRef.current.cameraPosition(
//       //       { x: currentNode.x * distRatio, y: currentNode.y * distRatio, z: currentNode.z * distRatio },
//       //       currentNode, 
//       //       1500
//       //     );
//       // }));
//       // }, []);


//       useEffect(() => {
//         if (fgRef.current ) {

//         // Accessing the underlying d3Force simulation
//           const graph = fgRef.current;

//           graph.d3Force('link').distance(link =>
//             link.curvature ? 10 : 50
//           );
//           graph.d3Force('link').strength(link =>
//             link.curvature ? 3 : 1.3
//           );
//           graph.d3Force('charge').strength(link =>
//             link.curvature ? 10 : -1000
//           );
//         }
//       }, []);


//       return <ForceGraph3D
//         dagMode = {'bu'}  // Direct Acyclic Graph (DAG) mode
//         dagLevelDistance = {70}

//         onDagError={(loopNodeIds) => {
//           if (typeof graphData === 'undefined' || !graphData.nodes) {
//             console.warn("Graph data is unavailable or improperly loaded.");
//             //It is not loading stuff, checked
//             return; // Exit the function to prevent further errors
//           }

//           // Proceed with placing cycle nodes on the same level
//           const cycleLevel = 100;
//           loopNodeIds.forEach(nodeId => {
//             const node = graphData.nodes.find(n => n.id === nodeId);
//             if (node) {
//               node.fz = cycleLevel;
//             }
//           });
//         }}

//         width={width}
//         height={height}
//         ref={fgRef}
//         graphData={graphJson}
//         nodeLabel="id"
//         nodeColor={node => node.color ? node.color : '#b6bfc1db'}
//         nodeResolution={8}
//         linkColor={link => link.color ? link.color : "#f5f5f5"}
//         linkWidth = {link => link.color ? 1 : 0}
//         linkCurvature={link => link.curvature ? 0.5 : 0}
//         linkCurveRotation={4}
//         linkDirectionalArrowColor={"#ffffff"}
//         linkDirectionalArrowLength={0}

//         linkDirectionalParticles = {2}
//         linkDirectionalParticleWidth = {0.8}
//         linkDirectionalParticleSpeed= {0.006}

//         backgroundColor={'#202020'}
//         nodeThreeObjectExtend={true}
//         nodeThreeObject={node => {
//           const sprite = new SpriteText(node.id);
//           sprite.color = 'lightgrey';
//           sprite.textHeight = 4;
//           return sprite;
//         }}
        
//         // warmupTicks={200}
//         // cooldownTicks={1000}

//         onNodeClick={handleClick}
//       />;
//     };

//     const root = createRoot(this.containerEl.children[1])
//     root.render( 
//         <FocusGraph />
//       );
//   }

//   async onClose() {
//     ReactDOM.unmountComponentAtNode(this.containerEl);
//   } 
// }



import { ItemView, WorkspaceLeaf } from "obsidian";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { Dgraph7c94cd } from "ReactView";

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
    const graphJson = Dgraph7c94cd()
    // Create the container for the 3D graph
    this.graphContainer = document.createElement("div");
    this.graphContainer.style.width = "100%";
    this.graphContainer.style.height = "100%";
    this.containerEl.appendChild(this.graphContainer);

    // Initialize 3D Force Graph
    this.graph = ForceGraph3D()(this.graphContainer)
      .dagMode("bu") // Direct Acyclic Graph layout (bottom-up)
      .onDagError(() => {})
      .dagLevelDistance(70)
      .graphData(graphJson)
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
      .linkCurvature((link) => (link.curvature ? 0.5 : 0))
      .linkCurveRotation(4)
      .linkDirectionalArrowColor("#ffffff")
      .linkDirectionalArrowLength(0)
      .linkDirectionalParticles(2)
      .linkDirectionalParticleWidth(0.8)
      .linkDirectionalParticleSpeed(0.006);

    this.graph.d3Force("link").distance((link) => (link.curvature ? 10 : 50));
    this.graph.d3Force("link").strength((link) => (link.curvature ? 3 : 1.3));
    this.graph.d3Force("charge").strength((link) => (link.curvature ? 10 : -1000))
  }

  async onClose() {
    this.graphContainer.remove();
  }
}

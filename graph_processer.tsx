import { topologicalSort,RemoveDuplicateLinks,getRandomColor,blendHexColors } from "support.tsx";
import { ItemView, WorkspaceLeaf } from "obsidian";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { Dgraph7c94cd } from "ReactView";
import { TFile } from "obsidian";
import * as d3 from "d3";



export function Graph_processing(){
	//get raw graph data
	let [nodes_map, nodes_top_sort,edges_top_sort] = Dgraph7c94cd()
	//remove duplicates
	edges_top_sort = RemoveDuplicateLinks(edges_top_sort)
	//impose correct norder on nodes with topological sorting
	nodes_order = topologicalSort(nodes_top_sort,edges_top_sort)

    //Slowly add nodes
    let distance = 0
    const nodes = []
    const links = []

    const funny_objects = []


    //representation of a class chain
	class NodeClass {
	  constructor(root = {}) {
	  	this.root = root
	    this.nodes = [root]; // array of node objects
	    this.x = (Math.random() - 0.5) * 1000
	    this.y = 0
	    this.z = (Math.random() - 0.5) * 1000
	    this.color = getRandomColor()
	  }

	  // getCenter() {
	  //   const total = { x: 0, y: 0, z: 0 };
	  //   for (const node of this.nodes) {
	  //     total.x += node.x || 0;
	  //     total.y += node.y || 0;
	  //     total.z += node.z || 0;
	  //   }
	  //   const count = this.nodes.length || 1;
	  //   return {
	  //     x: total.x / count,
	  //     y: total.y / count,
	  //     z: total.z / count
	  //   };
	  // }

	  addNode(node) {
	    this.nodes.push(node);
	  }

	  hasNode(id) {
	    return this.nodes.some(n => n.id === id);
	  }
	}



    while (true){
      if (!(nodes_order.length === 0)){
        // console.log(nodes_order)
        let new_node = nodes_map.get(nodes_order.shift())
        //root nodes
        if ((new_node.parents.size === 0) && (new_node.children.size !== 0)) {
		  funny_objects.push(NodeClass(new_node))      
        //class nodes but not roots
        } else if ((new_node.parents.size !== 0)) {
          new_node.y = 0
          new_node.x = 0
          new_node.z = 0
          //av of the coordinates + av of colors
          new_node.color = []
          for (let parent of new_node.parents) {
            new_node.y += nodes_map.get(parent).y
            new_node.x += nodes_map.get(parent).x
            new_node.z += nodes_map.get(parent).z
            new_node.color.push(nodes_map.get(parent).color)
            //adding class links
            links.push({"source": parent, "target": new_node.id, "color": nodes_map.get(parent).color })

          }
          new_node.color = blendHexColors(new_node.color)
          new_node.y = new_node.y/new_node.parents.size
          new_node.x = new_node.x/new_node.parents.size
          new_node.z = new_node.z/new_node.parents.size

          new_node.y += 50
        //any other normal node
        } else {
          new_node.y = distance;
          new_node.x = 0
          new_node.z = 0
          distance += 50
        }
        nodes.push(new_node)        
      } else {
        distance = 0
        console.log('Finished Graph Building from loop',nodes_map)
        break;
      }
    }

	return {nodes,links}
}
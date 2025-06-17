import { blendHexColors } from "functions_spellbook.tsx";
import { NodeChain } from "classes_spellbook.tsx"
import { ItemView, WorkspaceLeaf } from "obsidian";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { Dgraph7c94cd } from "Initial_processing";
import { TFile } from "obsidian";
import * as d3 from "d3";



export function Graph_processing(){
	//get raw graph data
	let [nodes_map,nodes_order] = Dgraph7c94cd()
	

    //Slowly add nodes
    const nodes = []
    const links = []


    const funny_objects = []

    const link_map = new Map()


    while (true){
		if (!(nodes_order.length === 0)){
			// console.log(nodes_order)
			let new_node = nodes_map.get(nodes_order.shift())
			//root nodes
			if ((new_node.parents.size === 0) && (new_node.children.size !== 0)) {
				let a = new NodeChain(new_node)
				a.addNode(new_node)
				funny_objects.push(a)      
			//non-root class nodes with a singular parent
			} else if ((new_node.parents.size > 0)) {
				for (let parent of new_node.parents){
					parent = nodes_map.get(parent)
					for (let one_class of parent.class){
						one_class.addNode(new_node)
					}
					links.push({"source": parent.id, "target": new_node.id, "color": parent.color })
				}
			}

        //remaining links
        for (let node of new_node.incoming_exclusive){
        	links.push({"source": node, "target": new_node.id, "color": false })
        }        

        nodes.push(new_node)
        
      } else {
        console.log('Finished Graph Building from loop',nodes_map,link_map)
        break;
      }
    }

	return [nodes_map,link_map,funny_objects,nodes,links]
}
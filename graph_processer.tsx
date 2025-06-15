import { topologicalSort,RemoveDuplicateLinks,blendHexColors } from "functions_spellbook.tsx";
import { NodeChain } from "classes_spellbook.tsx"
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
				funny_objects.push(a)      
			//non-root class nodes with a singular parent
			} else if ((new_node.parents.size === 1)) {
				//adding new ndoe to the class
				parent = nodes_map.get(new_node.parents.values().next().value)
				parent.class.addNode(new_node,parent)
				links.push({"source": parent.id, "target": new_node.id, "color": parent.color })
			//non-root class nodes with a more then one parent (the classes can be same or many)
			} else if ((new_node.parents.size > 1)) {
				//find parent with the bigges y
				let y_level = -1
				let main_parent
				let classes_to_be_merged = new Set()
				for (let parent of new_node.parents){
					parent = nodes_map.get(parent)
					classes_to_be_merged.add(parent.class)
					links.push({"source": parent.id, "target": new_node.id, "color": parent.color })
					if (parent.y > y_level){
						main_parent = parent
						y_level = main_parent.y
					}
				}
				//if set size (amount of classes) is one, proceed as if it had one parent (no class merging neeeded)
				if (classes_to_be_merged.size === 1){
					main_parent = nodes_map.get(new_node.parents.values().next().value)
					main_parent.class.addNode(new_node,main_parent)
				//class merging and adding sub/super classes
				} else {
					let a = new NodeChain(new_node,main_parent,classes_to_be_merged)
					funny_objects.push(a)
				}
			}

        //remaining links
        for (let node of new_node.incoming_exclusive){
        	links.push({"source": node, "target": new_node.id, "color": false })
        }


        //calculating node position by creating an orbital between all the parents
        //setting up orbitals dictinonary
        let ancestors =  Array.from(new_node.incoming).sort()
        ancestors = JSON.stringify(ancestors)
        if (!link_map.get((ancestors))){
        	link_map.set(ancestors,[new_node])
        } else {
        	link_map.get(ancestors).push(new_node)
        }
        
        //how many nodes are currently occupaing this orbital
        queue_number = link_map.get(ancestors).length


        //determining coordinates
        let new_x = 0
        let new_z = 0
        let highest_y = 0
        for (let ancestor of new_node.incoming){
        	ancestor = nodes_map.get(ancestor)
        	new_x += ancestor.x
        	new_z += ancestor.z
        	if (ancestor.y>highest_y){
        		highest_y = ancestor.y
        	}
        }



		if (new_node.incoming.size === 1){
			ancestor = nodes_map.get(new_node.incoming.values().next().value)

			if (ancestor.outcoming.size === 1){
				new_node.x = ancestor.x
				new_node.z = ancestor.z
				new_node.y = highest_y + 50 
			} else {
				let angle = 360/(ancestor.outcoming.size)
				let radians = angle * (Math.PI / 180)
				let theta = radians * (queue_number - 1)
				new_node.x = ancestor.x + 50 * Math.cos(theta)
				new_node.z = ancestor.z + 50 * Math.sin(theta)
				new_node.y = highest_y + 50 
			}
		} else if (new_node.incoming.size !== 0){
        	new_x = new_x/new_node.incoming.size 
        	new_z= new_z/new_node.incoming.size

        	if (queue_number>1){
        		new_x += ((Math.random() - 0.5) * 10)
        		new_z += ((Math.random() - 0.5) * 10)
        	}
        	new_node.x = new_x
        	new_node.z = new_z
        	new_node.y = highest_y + 50        
        	
        } else {
        	new_node.x = (Math.random() - 0.5) * 1000
        	new_node.z = (Math.random() - 0.5) * 1000
        	new_node.y = 0
        }

        if (!Number.isNaN(new_node.x) && !Number.isNaN(new_node.z)){
        	nodes.push(new_node)
        } else {
        	console.warn('Nan cooridnate',new_node)
        }

      } else {
        console.log('Finished Graph Building from loop',nodes_map,link_map)
        break;
      }
    }


    console.log(nodes,links)
	return {nodes,links}
}
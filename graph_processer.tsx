import { topologicalSort,RemoveDuplicateLinks,getRandomColor,blendHexColors } from "functions_spellbook.tsx";
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
    let distance = 0
    const nodes = []
    const links = []

    const funny_objects = []


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
    console.log('Funny stuff',funny_objects)

    let a = 50
    for (let chain of funny_objects){

    	chain.x = a
    	chain.z = a
    	a+=50
    	if (chain.id === 'Abra' || chain.id === 'Bebra' || chain.id === 'cadebra' || chain.id === 'Allax'){
    		chain.x = (Math.random() - 0.5) * 1000
    		chain.z = (Math.random() - 0.5) * 1000
    	}
   	}
	return {nodes,links}
}
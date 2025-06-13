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


     //simple cluster,basically just a few class threads that are glued together
    const surroundings_map = new Map()
    for (let clas of funny_objects){
    	for (let class_node of clas.nodes){
    		class_node = class_node[1]
    		if (surroundings_map.get(class_node.nodeSurroundings(nodes_map))){
    			surroundings_map.get(class_node.nodeSurroundings(nodes_map)).push(class_node.id)
    		} else {
    		surroundings_map.set(class_node.nodeSurroundings(nodes_map),[class_node.id])
    		}
    	}
    }
    console.log(surroundings_map)
    //iterating over the surroundings map, and grouping clusters if there is a parent child relation inside the map entry
    let clusters = []
    for (let pattern of surroundings_map){
    	let classes_grouping = new Map()

    	//empty connectivity pattern is a skip
    	if (pattern[0] === '[]'){
    		continue;
    	}
    	//sorting nodes based on their class
    	for (let node of pattern[1]){
    		node = nodes_map.get(node)
    		if (classes_grouping.get(node.class)){
    			classes_grouping.get(node.class).push(node)
    		} else {classes_grouping.set(node.class,[node])}

    	}
    	//adding clusters which have more then one node
    	for (let group of classes_grouping){
    		if (group[1].length > 1){
    			group.push(pattern[0])
    			clusters.push(group)
    		}
    	}
    }
    console.log(clusters)



    //some class movements
    let a = 100
    let b = 200
    let s = 0
    let increment = 80
    for (let clas of funny_objects){
    	clas.x = a + s%(increment*4)
    	clas.z = b + Math.floor(s/(increment*4))*increment
    	s += increment
    }	




	return [{nodes,links},clusters]
}
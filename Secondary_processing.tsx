import { blendHexColors } from "functions_spellbook.tsx";
import { NodeChain,NodeCluster,NodeClusterChain } from "classes_spellbook.tsx"
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


    const funny_objects = new Map()
    funny_objects.set('Classes',[])
    funny_objects.set('ClusterChains',[])

    const link_map = new Map()


    while (true){
		if (!(nodes_order.length === 0)){
			let new_node = nodes_map.get(nodes_order.shift())

			//root nodes
			if ((new_node.parents.size === 0) && (new_node.children.size !== 0)) {
				let a = new NodeChain(new_node)
				a.addNode(new_node)
				funny_objects.get("Classes").push(a)      
			//non-root class nodes with a singular parent
			} else if ((new_node.parents.size > 0)) {
				classes_to_be_merged = new Set()
				for (let parent of new_node.parents){
					parent = nodes_map.get(parent)
					classes_to_be_merged.add(parent.class)					
					links.push({"source": parent.id, "target": new_node.id, "color": parent.color })
				}
				//if only one parenting class among all parents
				if (classes_to_be_merged.size === 1){
					[...classes_to_be_merged][0].addNode(new_node)
				//if many classes to be merged
				} else {
					let a = new NodeChain(new_node)
					for (let clas of classes_to_be_merged){
						a.colors.push(clas.color)
						a.parents.add(clas)
						clas.children.add(a)
					}
					a.addNode(new_node)
					funny_objects.get("Classes").push(a) 
				}
			}

        //remaining links
        for (let node of new_node.incoming_exclusive){
        	links.push({"source": node, "target": new_node.id, "color": false })
        }        

        nodes.push(new_node)
        
      } else {
        console.log('Finished Graph Building from loop')
        break;
      }
    }


    //clusters
    for (let node of nodes){
		if (node.proxy.length > 0){
			//check if one of parents is already in cluster
			let parent_with_cluster = false
			let parent_cluster = false
			for (let parent of node.parents){
				parent = nodes_map.get(parent)
				if (parent.cluster){
					parent_cluster = parent.cluster
					parent_with_cluster = parent
				}
			}
			//checking whether we create new or add to old
			if (parent_cluster){
				parent_cluster.addCluster(parent_with_cluster,node)
			} else {
				let a = new NodeClusterChain(node)
				funny_objects.get("ClusterChains").push(a)
			}

		}

    }


    console.log(funny_objects)
	return [nodes_map,link_map,funny_objects,nodes,links]
}
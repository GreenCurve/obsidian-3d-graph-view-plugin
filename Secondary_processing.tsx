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
				funny_objects.get("Classes").push(a)      
			//non-root class nodes
			} else if ((new_node.parents.size > 0)) {
				classes_to_be_merged = new Set()
				for (let parent of new_node.parents){
					parent = nodes_map.get(parent)
					classes_to_be_merged.add(parent.class)					
					links.push({"source": parent.id, "target": new_node.id, "color": parent.color })
				}
				//if only one parenting class among all parents
				if (classes_to_be_merged.size === 1){
					[...classes_to_be_merged][0].addMember([...new_node.parents],new_node)
				//if many classes to be merged
				} else {
					let a = new NodeChain(new_node)
					for (let clas of classes_to_be_merged){
						a.colors.push(clas.color)
						a.parents.add(clas)
						clas.children.add(a)
					}
					a.addMember([],new_node)
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
    	//every class node is a cluster...
    	if (node.class){
    		//...except for the proxies (for now atleast)
    		if (node.representative){
    			continue
    		}

			//check if one of parents is already in cluster
			let ancestors_with_cluster = []
			let cluster_parents = new Map()
			for (let ancestor of node.parents){
				ancestor = nodes_map.get(ancestor)
				if (ancestor.cluster){
					ancestors_with_cluster.push(ancestor)
					if (cluster_parents.has(ancestor.cluster)){
						cluster_parents.get(ancestor.cluster.id).add(ancestor)
					} else {
						cluster_parents.set(ancestor.cluster.id,[ancestor])
					}

				}
			}


			//no parents means no clusters for sure (as after this algo every class node is in some cluster)
			if (node.parents.size === 0){
				let a = new NodeClusterChain(node)
				funny_objects.get("ClusterChains").push(a)
				//new chain and new cluster
			//error, read last one
			} else if (ancestors_with_cluster.length === 0 ){
				console.error('Some class node is clusterless!',node.parents)
			} else {
				if ([...cluster_parents.keys()].length === 1){
					ancestors_with_cluster[0].cluster.clusterChain.addMember(ancestors_with_cluster,node)
				} else {
					let a = new NodeClusterChain(node)
					funny_objects.get("ClusterChains").push(a)
					for (let parents_from_one_cluster of cluster_parents.values()){
						a.parents.add(parents_from_one_cluster[0].cluster.clusterChain)
						parents_from_one_cluster[0].cluster.clusterChain.children.add(a)
						a.root.parents.add(parents_from_one_cluster[0].cluster)
						parents_from_one_cluster[0].cluster.children.add(a.root)
					}
				}
			}


			for (let pc_anc of node.incoming_exclusive){
				pc_anc = nodes_map.get(pc_anc)
				if (!(pc_anc.representative) && pc_anc.cluster){
					node.cluster.incoming.add(pc_anc.cluster)
					node.cluster.clusterChain.incoming.add(pc_anc.cluster.clusterChain)

					pc_anc.cluster.outcoming.add(node.cluster)
					pc_anc.cluster.clusterChain.outcoming.add(node.cluster.clusterChain)

				}
			}

    	}
    }


    console.log(funny_objects)
	return [nodes_map,link_map,funny_objects,nodes,links]
}
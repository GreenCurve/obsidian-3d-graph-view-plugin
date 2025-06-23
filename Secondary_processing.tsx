import { getRandomColor } from "functions_spellbook.tsx";
import { ShapeActor,Bridge } from "classes_spellbook.tsx"
import { ItemView, WorkspaceLeaf } from "obsidian";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { Dgraph7c94cd } from "Initial_processing";
import { TFile } from "obsidian";
import * as d3 from "d3";



export function Graph_processing(){
	//get raw graph data
	let [one_map,nodes_order] = Dgraph7c94cd()
	

    //Slowly add nodes
    const nodes = []
    const links = []


    //classes
    const two_map = new Map()
    //clusters
    const three_map = new Map()
    //cluster chains
    const four_map = new Map()


    for (let new_node of nodes_order){
    	new_node = one_map.get(new_node)
    	//roots
    	if ((new_node.incoming_class_bridges.length === 0) && (new_node.outcoming_class_bridges.length !== 0)){
			let shape = new ShapeActor(2)
			shape.colors.push(getRandomColor())
			//the frist array is zero
			shape.addMember(new_node.incoming_class_bridges,new_node)
			two_map.set(shape.id,shape)  
		//non-root class nodes
		} else if (new_node.incoming_class_bridges.length > 0) {

			twos_to_be_merged = new Set()
			for (let bridge of new_node.incoming_class_bridges){

				source_group = bridge.source['q2'].values().next().value
				twos_to_be_merged.add(source_group.id)
				links.push({"source":  bridge.source.id, "target": new_node.id, "color":  bridge.source.color })
			}

			//if only one parenting class among all parents

			if (twos_to_be_merged.size === 1){
				two_map.get([...twos_to_be_merged][0]).addMember(new_node.incoming_class_bridges,new_node)
			//if many classes to be merged
			} else {
				let shape = new ShapeActor(2)
				for (let two of twos_to_be_merged){
					two = two_map.get(two)
					shape.colors.push(two.color)
					let bridge = new Bridge(two,shape)
					bridge.type = "class"


					two.outcoming_bridges.push(bridge)
					shape.incoming_bridges.push(bridge)
					two.class_bridges.push(bridge)
					shape.class_bridges.push(bridge)
					two.outcoming_class_bridges.push(bridge)
					shape.incoming_class_bridges.push(bridge)
 
				}
				shape.addMember(new_node.incoming_class_bridges,new_node)
				two_map.set(shape.id,shape) 
			}
		}
		//incoming non-parent classes
		if (new_node['q2'].size > 0){
			for (let bridge of new_node.incoming_to_classes_bridges){
				let one = bridge.source
				a = one['q2'].values().next().value
				b = new_node['q2'].values().next().value

				a.outcoming_bridges.push(bridge)
                b.incoming_bridges.push(bridge)
                a.normal_bridges.push(bridge)
                b.normal_bridges.push(bridge)
                a.outcoming_normal_bridges.push(bridge)
                b.incoming_normal_bridges.push(bridge)
				links.push({"source": one.id, "target": new_node.id, "color": false })
			}
		}


		//remaining links of non-class origin
		for (let bridge of new_node.incoming_normal_bridges){
			let one = bridge.source
			links.push({"source": one.id, "target": new_node.id, "color": false })
		}

		nodes.push(new_node)
	} 



	const zero_map = new Map()
	zero_map.set('1',new Map(one_map))
	zero_map.set('2',new Map(two_map))

	for (let node of nodes){
		//each object must have its proxies (made by YOu)
		if (node.outcoming_proxy_bridges.length > 0){
			let shape = new ShapeActor(3)
			shape.addMember([],node)
			zero_map.get('1').delete(node.id)
			for (let bridge of node.outcoming_proxy_bridges){
				let proxy = bridge.target
				shape.addMember([bridge],proxy)
				zero_map.get('1').delete(bridge.target.id)
			}
			shape.innerfy()
			three_map.set(shape.id,shape)
		}

	}

	zero_map.set('3',new Map(three_map))
   	console.log(zero_map)
	return [one_map,nodes,links,zero_map]
}
import { Graph_processing } from "Secondary_processing.tsx"

export function CoordinateProcessing(){
	let [one_map,nodes,links,zero_map] = Graph_processing()


	let a = 0
	for (let node of nodes){

		[node.x,node.y,node.z] = [0,a,0]
		a+=50
		if (node['q2'].size > 0){
			node.set_X = (Math.random() - 0.5) * 1000
			node.set_Z = (Math.random() - 0.5) * 1000
		}
	}
	let b = 0
	for (let node of zero_map.get('3').values()){
		node.set_Y = b
		node.set_X = (Math.random() - 0.5) * 1000
		node.set_Z = (Math.random() - 0.5) * 1000
		b+=50
	}

	// let counter = 0
	// for (let cluster of zero_map.get('3').values()){
	// 	let angle = 360/(zero_map.get('3').size)
	// 	let radians = angle * (Math.PI / 180)
	// 	let theta = radians * counter
	// 	cluster.set_X = 200 * Math.cos(theta)
	// 	cluster.set_Y = 0
	// 	cluster.set_Z = 200 * Math.sin(theta)
	// 	counter++
	// }

	// for (let cluster of funny_objects.get("ClusterChains")){
	// 	a = (Math.random() - 0.5) * 1000
	// 	cluster.set_X = a
	// 	cluster.set_Y = a
	// 	cluster.set_Z = a
	// }

	

	// for (let new_node of nodes){
	// 	//calculating node position by creating an orbital between all the parents
	//     //setting up orbitals dictinonary
	//     let ancestors =  Array.from(new_node.incoming).sort()
	//     ancestors = JSON.stringify(ancestors)
	//     if (!link_map.get((ancestors))){
	//     	link_map.set(ancestors,[new_node])
	//     } else {
	//     	link_map.get(ancestors).push(new_node)
	//     }
	    
	//     //how many nodes are currently occupaing this orbital
	//     queue_number = link_map.get(ancestors).length


	//     //determining coordinates
	//     let new_x = 0
	//     let new_z = 0
	//     let highest_y = 0

	//     for (let ancestor of new_node.incoming){
	//     	ancestor = nodes_map.get(ancestor)
	//     	new_x += ancestor.x
	//     	new_z += ancestor.z
	//     	if (ancestor.y>highest_y){
	//     		highest_y = ancestor.y
	//     	}
	//     }


	//     //proxy
	//     if (new_node.representative){
	//     	[new_node.x,new_node.y,new_node.z] = nodes_map.get(new_node.representative).nextProxy;
	//     } else if (new_node.incoming.size === 1){
	// 		ancestor = nodes_map.get(new_node.incoming.values().next().value)

	// 		if (ancestor.outcoming.size === 1){
	// 			new_node.x = ancestor.x
	// 			new_node.z = ancestor.z
	// 			new_node.y = highest_y + 50 
	// 		} else {
	// 			let angle = 360/(ancestor.outcoming.size)
	// 			let radians = angle * (Math.PI / 180)
	// 			let theta = radians * (queue_number - 1)
	// 			new_node.x = ancestor.x + 100 * Math.cos(theta)
	// 			new_node.z = ancestor.z + 100 * Math.sin(theta)
	// 			new_node.y = highest_y + 50 
	// 		}
	// 	} else if (new_node.incoming.size !== 0){
	//     	new_x = new_x/new_node.incoming.size 
	//     	new_z= new_z/new_node.incoming.size

	//     	if (queue_number>1){
	//     		new_x += ((Math.random() - 0.5) * 10)
	//     		new_z += ((Math.random() - 0.5) * 10)
	//     	}
	//     	new_node.x = new_x
	//     	new_node.z = new_z
	//     	new_node.y = highest_y + 50        
	    	
	//     } else {
	//     	new_node.x = (Math.random() - 0.5) * 1000
	//     	new_node.z = (Math.random() - 0.5) * 1000
	//     	new_node.y = 0
	//     }

	// }
	
	return [{nodes,links},9999999999999999]
}
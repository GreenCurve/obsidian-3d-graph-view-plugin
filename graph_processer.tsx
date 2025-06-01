import { topologicalSort,RemoveDuplicateLinks } from "support.tsx";
import { ItemView, WorkspaceLeaf } from "obsidian";
import ForceGraph3D from "3d-force-graph";
import SpriteText from "three-spritetext";
import { Dgraph7c94cd } from "ReactView";
import { GUI } from "dat.gui";
import { TFile } from "obsidian";
import * as d3 from "d3";



export function Graph_processing(){
	//get raw graph data
	let [nodes_map_2, nodes_top_sort_1,edges_top_sort_1] = Dgraph7c94cd()
	//remove duplicates
	edges_top_sort_1 = RemoveDuplicateLinks(edges_top_sort_1)
	//impose correct norder on nodes with topological sorting
	nodes_order_2 = topologicalSort(nodes_top_sort_1,edges_top_sort_1)

	return [nodes_map_2,nodes_order_2]
}
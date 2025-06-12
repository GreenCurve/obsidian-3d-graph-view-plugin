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
	class NodeChain {
	  constructor(root,m_parent = 0,merg_classes = []) {
	  	this.id = root.id
	  	this.root = root
	  	this.superclasses = new Map()
	  	this.subclasses = new Map()
	  	this.branches = new Map()

	  	// map of node objects included in the chain
	    this.nodes = new Map(); 
	    this.nodes.set(root.id,root)
	    this.x = (Math.random() - 0.5) * 1000
	    this.y = 0
	    this.z = (Math.random() - 0.5) * 1000
	    this.color = getRandomColor()
	   	//distance between class nodes
	    this.level = 50
	    //new property to refer to class
	    root.class = this


	   	//if we create class as subclass
	    if (!(m_parent === 0)){
	    	//list of colors from all superclasses
		    let colors = []
		    for (let parent_class of merg_classes){
		    	parent_class.subclasses.set(this.id,this)
		    	this.superclasses.set(parent_class.id,parent_class)
		    	colors.push(parent_class.color)
		    }

		    //new color shoulb be blend of references to other classes
		    this.linkPropertyToExpression("color",() => blendHexColors(colors))

		    //new coordinates should also be reference of the parent
		    this.linkPropertyToExpression("x",() => m_parent.x)
		    this.linkPropertyToExpression("z",() => m_parent.z)
		    this.linkPropertyToExpression("y",() => m_parent.y + m_parent.class.level)
		}


		//setting root to have the same stuff as its class
	    root.linkPropertyToExpression('x',() => this.x)
	    root.linkPropertyToExpression('y',() => this.y)
	    root.linkPropertyToExpression('z',() => this.z)
	    root.linkPropertyToExpression('color',() => this.color)

	  }

	    linkPropertyToExpression(propName, expressionFn) {
	      Object.defineProperty(this, propName, {
	        get: expressionFn,
	        configurable: true,
	        enumerable: true,
	      });
	    }

	  addNode(node,parent) {
	    this.nodes.set(node.id,node);
	    //node now references coordinates of its parent
	    node.linkPropertyToExpression('y',() => parent.y + this.level)
	    node.linkPropertyToExpression('x',() => parent.x)
	    node.linkPropertyToExpression('z',() => parent.z)
	    node.linkPropertyToExpression('color',() => parent.color)
	    node.class = this
	  }
	}



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

    		let y_level = -1
    		let main_parent
    		let classes_to_be_merged = new Set()
    		for (let parent of new_node.parents){
    			parent = nodes_map.get(parent)
    			//adding parent's class to the set of merge classes
    			classes_to_be_merged.add(parent.class)
    			//adding link to the parent
    			links.push({"source": parent.id, "target": new_node.id, "color": parent.color })
    			//find parent with the biggest .y
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


   	//when any class node is dependant on another class node( of different class) in a composition way, 
   	//and it has some children that do the same or is already do the same or part of the cluster, then we have a cluster
   	//what to do with clusters that modify as they go


   	//class overlay for lineage clusters tracking
   	class Branch{
   		constructor(root){
   		this.id = root.id
	  	this.root = root
	  	this.nodes = new Map()

	  	this.addNode(root)

   		}
   		addNode(node) {
   		this.nodes.set(node.id,node)
	    node.branches.add(this)
	  }
   	}

   	// a single "level" of the cluster
   	//should be a mini tree?
   	class ClusterBlock{
   		constructor(dependancy,dependant){
   			this.id = anchor.id
   			this.anchor = dependancy


   			this.nodes = new Map()
   			this.nodes.set(dependancy.id,dependancy)
   			this.nodes.set(dependant.id,dependant)

   			this.x = 0
   			this.y = 0
   			this.z = 0

   			//anchor coordinates are dependant on the block coordinates
   			anchor.linkPropertyToExpression("x", () => this.x)
   			anchor.linkPropertyToExpression("y", () => this.y)
   			anchor.linkPropertyToExpression("z", () => this.z)


   			//dependants are dependant on the anchor
   			dependant.linkPropertyToExpression('x',() => anchor.x)
   			dependant.linkPropertyToExpression('y',() => anchor.y + 50)
   			dependant.linkPropertyToExpression('z',() => anchor.z + 50)
   		}

	    linkPropertyToExpression(propName, expressionFn) {
	      Object.defineProperty(this, propName, {
	        get: expressionFn,
	        configurable: true,
	        enumerable: true,
	      });
	    }



   	}

   	class Cluster{
   		constructor(dependancy,dependant){
   			this.root = new ClusterBlock(dependancy,dependant)

   			//show which branches and how should connect
   			this.rule = 
   			this.cluster_blocks = new Map()
   			this.cluster_blocks.set("",root)
   			this.level = 70

   		}



   	}

   	clusters = []

   	for (let chain of funny_objects){
   		for (let member of chain.nodes){
   			//second elemetn of the thing returned by map
   			member = member[1]
   			for (let possible_dependancy of member.incoming){
   				//get the node object by name
   				possible_dependancy = nodes_map.get(possible_dependancy)
   				if (("class" in possible_dependancy) && (possible_dependancy.class !== member.class)){
   					links.push({"source": possible_dependancy.id, "target": member.id, "color": "#b6bfc1db" })
   					//nodes are now branch creators
   					let b1 = new Branch(possible_dependancy)
   					possible_dependancy.class.branches.set(b1.id,b1)
   					let b2 = new Branch(member)
   					member.class.branches.set(b2.id,b2)


   					let a = new Cluster(possible_dependancy,member)
   					clusters.push(a)
   				}
   			}
   		}
   	}




	return {nodes,links}
}
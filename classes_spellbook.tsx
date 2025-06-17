import { getRandomColor,blendHexColors } from "functions_spellbook.tsx";





//defaul object class
export class ShapeActor{
	constructor(){		
	}

	//Turn static property into expression
    //chat gpt warned me about serialisation with JSON.stringify(node)
    linkPropertyToExpression(propName, expressionFn) {
      Object.defineProperty(this, propName, {
        get: expressionFn,
        configurable: true,
        enumerable: true,
      });
    }
    //revert expression propety to the static one
    setStaticProperty(propName, value) {
      // Remove dynamic getter if it exists
      delete this[propName];
      // Set static value
      this[propName] = value;
    }
}


export class Node extends ShapeActor{
    constructor(id,path){
   	  super()
      this.id = id
      this.path = path
      this.colors = []
      this.linkPropertyToExpression('color',() => blendHexColors(this.colors))
      this.class = new Set()
      this.incoming = new Set()
      this.outcoming = new Set()
      this.linkPropertyToExpression("incoming_exclusive",() => new Set([...this.incoming].filter(x => !this.parents.has(x))))
      this.children = new Set()
      this.parents = new Set()
      this.x = 0
      this.y = 0
      this.z = 0
    }
  }



//representation of a class chain
export class NodeChain extends ShapeActor{
  constructor(root) {
  	super()
  	this.id = root.id
  	this.root = root

  	// map of node objects included in the chain
    this.nodes = new Map();
    this.links = [] 
    this.color = getRandomColor()
    this.addNode(root)
  }

  addNode(node) {
  	if (this.nodes.has(node)){
  		return
  	}
    this.nodes.set(node.id,node);
    for (let parent of node.parents){
    	if (this.nodes.has(parent)){
    		this.links.push({"source": parent.id, "target": node.id})
    	}
    }
    //new node has more colors and more classes
    node.colors.push(this.color)
    node.class.add(this)
  }
}

import { getRandomColor } from "functions_spellbook.tsx";





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
      this.color = false
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
  constructor(root,m_parent = 0,merg_classes = []) {
  	super()
  	this.id = root.id
  	this.root = root
  	this.superclasses = new Map()
  	this.subclasses = new Map()
  	// map of node objects included in the chain
    this.nodes = new Map(); 
    this.nodes.set(root.id,root)
    this.color = getRandomColor()
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
	}
	//setting root to have the same stuff as its class
    root.linkPropertyToExpression('color',() => this.color)
  }
  addNode(node,parent) {
    this.nodes.set(node.id,node);
    //node now references coordinates of its parent
    node.linkPropertyToExpression('color',() => parent.color)
    node.class = this
  }
}

import { getRandomColor,blendHexColors } from "functions_spellbook.tsx";





//defaul object class
export class ShapeActor{
	constructor(id,root,members){
	this.id = id
	this.root = root
	this.members = members
	this.links = []
	this.children = new Set()
    this.parents = new Set() 
	this.x = 0
	this.y = 0
	this.z = 0		
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

    set set_X(value){
    	this.x = value
    }
    set set_Y(value){
    	this.y = value
    }
    set set_Z(value){
    	this.z = value
    }
}


export class Node extends ShapeActor{
    constructor(id,path){
   	  super(id,0,0)
   	  this.root = this
   	  this.members = [this]

      this.path = path
      this.color = false
      this.class = new Set()
      this.incoming = new Set()
      this.outcoming = new Set()
      this.linkPropertyToExpression("incoming_exclusive",() => new Set([...this.incoming].filter(x => !this.parents.has(x))))


      this.proxy = []
      this.representative = false

      //iterator for proxy
      this._iterator = this.generateProxyPositions()

    }

	*generateProxyPositions() {
	  for (let i = 0; i < this.proxy.length; i++) {
	    let angle = (360 / this.proxy.length) * i;
	    let radians = angle * (Math.PI / 180);
	    let x = this.x + 20 * Math.cos(radians);
	    let z = this.z + 20 * Math.sin(radians);
	    let y = this.y + 20
	    yield [x,y,z];
	  }
	}

	get nextProxy()	{
	    const result = this._iterator.next();
	    return result.done ? null : result.value; // or wrap around, or reset, your choice
  	}


  }


//representation of a class chain
export class NodeChain extends ShapeActor{
  constructor(root) {
  	super(root.id,root,new Map())





    this.colors = [getRandomColor()]
    this.linkPropertyToExpression('color',() => blendHexColors(this.colors))


  }

  addNode(node) {
  	if (this.members.has(node)){
  		console.log('node already exists in the class')
  		return
  	}
    this.members.set(node.id,node);
    for (let parent of node.parents){
    	if (this.members.has(parent)){
    		this.links.push({"source": parent.id, "target": node.id})
    	}
    }

    node.color = this.color
    node.class = this
    
  }
}


export class NodeCluster extends ShapeActor{
	constructor(root){
		super(root.id,root,[root].concat(root.proxy))
	}

}

export class NodeClusterChain extends ShapeActor{
	constructor(root){
		super(root.id,new NodeCluster(root),new Map())

		this.addCluster(0,root)

	}

	addCluster(parent_node,child_node){
		if (parent_node === 0){
			this.root_cluster = new NodeCluster(child_node)
			this.members.set(this.root_cluster.id,this.root_cluster)
		} else {
			let new_cluster = new NodeCluster(child_node)
			this.members.set(new_cluster.id,new_cluster)
		}
		child_node.cluster = this
	}



}
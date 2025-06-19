import { getRandomColor,blendHexColors } from "functions_spellbook.tsx";





//defaul object class
export class ShapeActor{
	constructor(){

	this.members = new Map()
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


    //list of id's + node object
    addMember(parent_members,new_member){
	  	if (this.members.has(new_member.id)){
	  		console.log('member already exists', this, new_member)
	  		return
	  	}
    	if (parent_members.length>0){
    		this.members.set(new_member.id,new_member)
			for (let parent of parent_members){
				if (this.members.has(parent)){
					parent = this.members.get(parent)
					this.links.push({"source": parent.id, "target": new_member.id})
					//be wary, in the class chains this makes classes to attempt tro assign parents-children anew
					parent.children.add(new_member.id)
					new_member.parents.add(parent.id)
				}
			}
		} else {
			//change to container for roots later?
			this.root = new_member
			this.id = this.root.id
			this.members.set(this.root.id,this.root)			
		}
    }


    set set_X(value){
    	let className = this.constructor.name;
    	//the way it works for nodes
    	if (className === "Node"){
    		this.x = value
    	} else {
    		for (let member of this.members.values()){
    			member.set_X = value
    		}
    	}
    }
    set set_Y(value){
    	let className = this.constructor.name;
    	//the way it works for nodes
    	if (className === "Node"){
    		this.y = value
    	} else {
    		for (let member of this.members.values()){
    			member.set_Y = value
    		}
    	}
    }
    set set_Z(value){
    	let className = this.constructor.name;
    	//the way it works for nodes
    	if (className === "Node"){
    		this.z = value
    	} else {
    		for (let member of this.members.values()){
    			member.set_Z = value
    		}
    	}
    }
}


export class Node extends ShapeActor{
    constructor(id,path){
   	  super()
   	  //the only one who sets them directly instead of using addMember
   	  this.id = id
   	  this.root = this
   	  this.members.set(this.id,this)

      this.path = path
      this.color = false
      this.class = false
      this.incoming = new Set()
      this.outcoming = new Set()
      this.linkPropertyToExpression("incoming_exclusive",() => new Set([...this.incoming].filter(x => !this.parents.has(x))))


      this.proxy = new Map()
      this.representative = false
      this.cluster = false

      //iterator for proxy
      this._iterator = this.generateProxyPositions()

    }

	*generateProxyPositions() {
	  for (let i = 0; i < this.proxy.size; i++) {
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
  	super()
  	this.colors = [getRandomColor()]
    this.linkPropertyToExpression('color',() => blendHexColors(this.colors))

  	this.addMember([],root)

  }

  addMember(parent_members,new_member) {
    super.addMember(parent_members,new_member)
    new_member.color = this.color
    new_member.class = this
    
  }
}


export class NodeCluster extends ShapeActor{
	constructor(root){
		super()
		this.addMember([],root)
		for (let node of root.proxy.values()){
			this.addMember([root.id],node)
		}

	}
	addMember(parent_members,new_member){
		super.addMember(parent_members,new_member)
	}



}	


export class NodeClusterChain extends ShapeActor{
	constructor(root){
		super(root)
		this.addMember([],root)
	}

	addMember(parent_members,new_member){
		new_member.cluster = this
		new_member = new NodeCluster(new_member)
		super.addMember(parent_members,new_member)
		
	}
}
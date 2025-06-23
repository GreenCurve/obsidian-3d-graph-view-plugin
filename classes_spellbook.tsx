import { getRandomColor,blendHexColors } from "functions_spellbook.tsx";
import generateId from "functions_spellbook.tsx";





//defaul object class
export class ShapeActor{
	constructor(layer){

	//what type of actor it is
	//1 - node
	//2 - class
	//3 - cluster
	//4 - cluster chain
	//5 - special
	this.layer = layer
	//way to identify this actor
	this.id = generateId()
	this.path = false

	//things it perticipates in
	this.q2 = new Map()
	this.q3 = new Map()
	this.q4 = new Map()

	//members, most important members, and their connections
	this.members = new Map()
	this.root = false
	this.member_bridges = []

	//inner
	this.inner_members = false
	this.inner_bridges = []


	//bridges
	this.bridges = []
	//..aaand their categories
	this.incoming_bridges = []
	this.outcoming_bridges = []
	this.normal_bridges = []
	this.incoming_normal_bridges = []
	this.outcoming_normal_bridges = []
	this.class_bridges = []
	this.incoming_class_bridges = []
	this.outcoming_class_bridges = []
	this.proxy_bridges = []
	this.incoming_proxy_bridges = []
	this.outcoming_proxy_bridges = []
	this.to_classes_bridges = []
	this.incoming_to_classes_bridges = []
	this.outcoming_to_classes_bridges = []




    //coordinates
	this.x = 0
	this.y = 0
	this.z = 0

	//coloring
	this.colors = []
	this.linkPropertyToExpression('color',() => blendHexColors(this.colors))

	//defines how it handles its members
	this.behaviour = false

	//filtering temp
	this.f_classed = false
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


    //needs list of id's + object
    addMember(parent_bridges,new_member){
	  	if (this.members.has(new_member.id)){
	  		console.log('member already exists', this, new_member)
	  		return
	  	}
	  	//classes transfer their colors to members
	  	if (this.layer === 2){
	  		new_member.colors.push(this.color)
	  	}
	  	let a = this.member_bridges.length

    	if (parent_bridges.length>0){
			for (let bridge of parent_bridges){
				if (this.members.has(bridge.source.id)){
					this.member_bridges.push(bridge)
				}
			}
		}
		//if new bridges were added
		if (a < this.member_bridges.length){
		    this.members.set(new_member.id,new_member)	
		} else {
			//change to container for roots later?
			this.root = new_member
			this.members.set(this.root.id,this.root)			
		}
		new_member['q' + this.layer.toString()].set(this.id,this)
    }

    //consume members and bridges between them, re-rout outside bridges to itself
    innerfy(){
    	this.inner_members = new Map(this.members)
    	this.members = new Map()
    	this.inner_bridges = this.root.outcoming_proxy_bridges
    	for (let member of this.inner_members.values()){
    		for (let bridge of member.incoming_bridges){
    			if (bridge.type !== 'proxy'){
    				bridge.true_target = bridge.target
    				bridge.target = this
    			}
    		}
    		for (let bridge of member.outcoming_bridges){
    			if (bridge.type !== 'proxy'){
    				bridge.true_source = bridge.source
    				bridge.source = this
    			}
    		}
    	}
    }
    
    set set_X(value){
    	//the way it works for nodes
    	if (this.layer === 1){
    		this.x = value
    	} else {
    		for (let member of this.members.values()){
    			member.set_X = value
    		}
    		for (let member of this.inner_members.values()){
    			member.set_X = value
    		}
    	}
    }
    set set_Y(value){
    	//the way it works for nodes
    	if (this.layer === 1){
    		this.y = value
    	} else {
    		for (let member of this.members.values()){
    			member.set_Y = value
    		}
    		for (let member of this.inner_members.values()){
    			member.set_Y = value
    		}
    	}
    }
    set set_Z(value){
    	//the way it works for nodes
    	if (this.layer === 1){
    		this.z = value
    	} else {
    		for (let member of this.members.values()){
    			member.set_Z = value
    		}
    		for (let member of this.inner_members.values()){
    			member.set_Z = value
    		}
    	}
    }
}

export class Bridge{
	constructor(source,target){
		this.source = source
		this.target = target
		//type of connection
		//false
		//class
		//proxy
		this.type = false
		//in case of re-routing
		this.true_source = false
		this.true_target = false
		if (source === target){
			console.log('Equal to itself',this)
		}

	}
}
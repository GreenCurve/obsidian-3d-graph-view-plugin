//import supporiting functions
import { getRandomColor,blendHexColors,removeItem,idExists,addDictionary,push_forward } from "support.tsx";

//exported function that builds and returns graph
export function Dgraph7c94cd() {

  //graph that is going to be returned at the end
  //DO NOT CHANGE ANY KEY OF THE DICTIONARIES PUSHED TO THIS VARIABLE, IT SEEMS THEY ARE IMPORTANT LATER IN view.tsx
  const graph = {
    "nodes":[],
    "links":[]
  }
  //fetch all the md files from the vault
  //returns an array of dictionaries (files)
  //each dictionary(file) has:
  //  basename -- heading of the note, string
  //  extension -- always md, str
  //  name -- basename+extension,str
  //  path -- path from the vault folder (excluding it), str
  //  saving -- idk, default false
  //  deleted -- idk, default false
  //  parent, stat, vault, [[Prototype]] -- idk

  const t_files = app.vault.getMarkdownFiles()
  console.log(t_files)
  const files = []; 

  //iteration in alphabetic order
  for (let i = 0; i < t_files.length; i++) {
    //skip calendar notes
    if (t_files[i].path.startsWith("Calendar") || t_files[i].path.startsWith("Template")) {
        console.log('Skip items that start forbidden')
        continue; }
    const t_c = this.app.metadataCache.getCache(t_files[i].path)
    //getting the cache dictionary of the file:
    //
    //
    // console.log('passed cash')
    const tags = t_c.frontmatter.tags
    const searchString = "Economics/Econometrics";
    let containsString
    if (tags !== null) {
      containsString = tags.some(item => item.toLowerCase().includes(searchString.toLowerCase()));
      // console.log('passed tags')
    }
    const searchString2 = "Economics/Econometrics";
    let containsString2 
    if (tags !== null) {
      containsString2 = tags.some(item => item.toLowerCase().includes(searchString2.toLowerCase()));
      // console.log('passed tags')
    }
    // search with paths
    // const Pyt = t_files[i].path
    // const search_path = "Workspace"
    // const containsPath = Pyt.includes(search_path)
    ////  well, and this is search itself
    sortcondition = containsString || containsString2
    if (sortcondition) {
      files.push(t_files[i])
    }
  }
  //TODO, some kind of global map of files?
  function maping() {
    const map = new Map()
    for (let i = 0; i < files.length; i++) {
    const heading = files[i].basename
    map.set(heading, "i")
    }
    return map
  }  
  const map = maping()

  colored_links = []
  //future use
  colored_nodes = []
  //future use
  future_root_nodes = []
  //future use


  nodes_map = new Map()
  nodes_order = []

  for (let i = 0; i < files.length; i++) {
    //start of the giant FOR cycle that iterates over every file fetched

    const heading_of_the_note = files[i].basename
    const path = files[i].path
    //crerating a new node in the map if not already exist
    if (!nodes_map.has("heading_of_the_note")){
      nodes_map.set(heading_of_the_note,{"id": heading_of_the_note,"path": path, "color": false,'incoming':new Set(),'outcoming':new Set()})
      nodes_order.push(heading_of_the_note)
    } else {
      nodes_map.get(heading_of_the_note).path = path
    }


    //getting the cache dictionary of the file:
    //(returns cache metadata https://docs.obsidian.md/Reference/TypeScript+API/CachedMetadata)  
    const caches = this.app.metadataCache.getCache(path)
    //check for Class property of the note
    if (("frontmatter" in caches)) {
      const frontmatter = caches.frontmatter    
      if (!!frontmatter.Class){
        // just in case i have left onld text-only Class property (new ones are lists which for some reason have type 'object')
        if (typeof frontmatter.Class === 'string') {
            variable = [variable];
        }
        for (let element of frontmatter.Class) {
          node_name_in_the_link = element.slice(2, -2)
          //links are displayed with "|", alias after it, so getting the real name
          node_name_in_the_link = node_name_in_the_link.split('|')[0] 
          //slicing of square brackets of the [[foo]], as it is stored that way in the Class
          if (map.has(node_name_in_the_link)) {
                  //adding improvised ;ink into map
                  nodes_map.get(heading_of_the_note).incoming.add(node_name_in_the_link)
                  if (!nodes_map.has(node_name_in_the_link)){
                        nodes_map.set(node_name_in_the_link,{"id": node_name_in_the_link,"path": "", "color": false,'incoming':new Set(),'outcoming':new Set()})
                        nodes_order.push(heading_of_the_note)
                      }
                  nodes_map.get(node_name_in_the_link).outcoming.add(heading_of_the_note)
                  //moving the new one forward as a requirment for the old one
                  push_forward(nodes_order,heading_of_the_note,node_name_in_the_link)
          }
        }
      }
    }
    //second possible link check, those are links in the main body (text)
    if (("links" in caches)) {
        const link = caches.links
        if (!!link) {
          for (let j = 0; j < link.length; j++) {
            const links = link[j].link;
            if (map.has(links)) {
              nodes_map.get(heading_of_the_note).incoming.add(links)
              if (!nodes_map.has(links)){
                    nodes_map.set(links,{"id": node_name_in_the_link,"path": "", "color": false,'incoming':new Set(),'outcoming':new Set()})
                    nodes_order.push(heading_of_the_note)
                  }
              nodes_map.get(links).outcoming.add(heading_of_the_note)
              //moving the new one forward as a requirment for the old one
              push_forward(nodes_order,heading_of_the_note,links)
            }
          }
        }
    }
  }

  return nodes_map,nodes_order
}


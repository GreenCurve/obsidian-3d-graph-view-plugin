//import supporiting functions
import { getRandomColor,blendHexColors,removeItem,idExists,addDictionary } from "support.tsx";

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
  console.log(map)

  colored_links = []
  //future use
  colored_nodes = []
  //future use
  future_root_nodes = []
  //future use





  for (let i = 0; i < files.length; i++) {
    //start of the giant FOR cycle that iterates over every file fetched

    const heading_of_the_note = files[i].basename
    const path = files[i].path
    //

    current_note = {"id": heading_of_the_note,"path": path, "color": false}
    graph.nodes.push(current_note)
    //pushing fresh node to the nodes of the graph
    //no color finding performed yet, sot it is false for now

    //if some other node called this to be added to the list of tree, do it now
    if (future_root_nodes.includes(heading_of_the_note)){
      colored_nodes.push(current_note)
    }
    removeItem(future_root_nodes,heading_of_the_note)

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
                  //WARNING: link is bottom-up for a reason, it helps with DAG
                  current_link = {"source":  node_name_in_the_link,"target": heading_of_the_note,"value": 1, "color": node_name_in_the_link, "curvature": false}
                  graph.links.push(current_link)
                  colored_links.push(current_link)
                  //The color of the node is now list
                  if (current_note.color === false) {current_note.color = []}
                  //add another depandancy into the color list
                  current_note.color.push(node_name_in_the_link)
                  //push to the coloreds (unless was added up there in the code as a root)
                  if (!colored_nodes.includes(current_note)){
                    colored_nodes.push(current_note)}
                  //add new future root node if not already processed or added in to be processed list
                  if (!(idExists(colored_nodes,node_name_in_the_link)) && !future_root_nodes.includes(node_name_in_the_link)) {future_root_nodes.push(node_name_in_the_link)}
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
            // console.log('links')
            // console.log(links)
            if (map.has(links)) {
              let array = graph.links
              let newDictionary = {"source":  links,"target": heading_of_the_note,"value": 1, "color": false, "curvature": false}
              //WARNING: link is bottom-up for a reason, it helps with DAG
              addDictionary(array, newDictionary);
            }
          }
        }

        // const embed = caches.embeds
        // if (!!embed) {
        //   for (let k = 0; k < embed.length; k++) {
        //     const id = embed[k].link
        //     if (id.indexOf("#")!=-1) {
        //       const sharp = id.indexOf("#");
        //       const embeds = id.substring(0,sharp);
        //       if (map.has(embeds)) {
        //         graph.links.push({"source": heading_of_the_note,"target": embeds,"value": 1, "color": false})
        //       }

        //     } else {
        //       const embeds = id
        //       if (map.has(embeds)) {
        //         graph.links.push({"source": heading_of_the_note,"target": embeds,"value": 1, "color": false})
        //       }

        //     }
        //   }
        // } 
        // I do not need this piece for now, but for future me: it fetches links to the embedded objects (like pasted pngs) from caches
    }
  }


  //finding missing roots and inserting them to complete the list
  for (let i = 0; i < future_root_nodes.length; i++){
    const item_root = future_root_nodes[i];
    for (let j = 0; j<graph.nodes.length; j++){
      const item_node = graph.nodes[j];
      if (item_node.id === item_root){
        colored_nodes.push(item_node)
      }
    }
  }



  // Graph coloring
  let actualy_colored_nodes = [];

  while (true) {
    if (colored_nodes.length === 0) break;

    for (let i = 0; i < colored_nodes.length; ) {
      const item = colored_nodes[i];

      if (item.color === false) {
        item.color = getRandomColor();

        colored_nodes.splice(i, 1);
        actualy_colored_nodes.push(item);
        // No i++ here because the list got shorter
      } else {
        // Process item.color list
        for (let j = 0; j < item.color.length; j++) {
          const colorRef = item.color[j];

          if (colorRef.startsWith("#")) continue; // skip already resolved

          // Try to find match by id
          const match = actualy_colored_nodes.find(n => n.id === colorRef);

          if (match) {
            // Replace with actual color
            item.color[j] = match.color;
          }
          // If no match, we leave the original string as-is and skip it later
        }

        // Check if all entries now start with #
        const unresolved = item.color.some(c => !c.startsWith("#"));

        if (!unresolved) {
          // All are resolved: blend and update
          item.color = blendHexColors(item.color);

          colored_nodes.splice(i, 1);
          actualy_colored_nodes.push(item);
          // Do not increment i (list shrunk)
        } else {
          i++; // No change to array, so move on
          console.log(item.color)
        }
      }
    }
  }


  for (let i = 0; i < colored_links.length; i++) {
    const link = colored_links[i];
    const match = actualy_colored_nodes.find(node => node.id === link.color);

    if (match) {
      link.color = match.color;
    }
  }


  // console.log(colored_nodes)
  // console.log(actualy_colored_nodes)
  // console.log(colored_links)




  return graph
}


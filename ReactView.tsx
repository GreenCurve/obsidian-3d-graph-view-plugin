import { basenames_array } from "functions_spellbook.tsx";
import { Node } from "classes_spellbook.tsx"

//exported function that returns raw graph data
export function Dgraph7c94cd() {
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
  const raw_data = app.vault.getMarkdownFiles()

  //iteration in alphabetic order
  const filtered_files = []; 
  for (let i = 0; i < raw_data.length; i++) {
    //skip calendar notes and template notes
    if (raw_data[i].path.startsWith("Calendar") || raw_data[i].path.startsWith("Template")) {
        console.log('Skip items that start forbidden')
        continue; }

    //be default file is not included
    let Verdict = false
    //but if some conditions resolve as true...
    //to change whether you need AND or OR for the tags or paths specific, chnage the booleans for the contains-guys and boolean operation inside for loop
    //to change how you apply conditions together, go into the Verdict in the end

    //tag conditions check
    //getting the cache dictionary of the file:
    const t_c = this.app.metadataCache.getCache(raw_data[i].path)
    const tags = t_c.frontmatter.tags
    const search_conditions = ["Economics/Econometrics"]
    let containsTags = false
    if (tags !== null){
      for (let condition of search_conditions){
        containsTags = containsTags || tags.some(item => item.toLowerCase().includes(condition.toLowerCase()));
        //break the moment we spot atleast one condition is not fulfilled
      }
    }
    //path conditions check
    const Pyt = raw_data[i].path
    const search_path_conditions = []
    let containsPath = true
    for (let condition_path of search_path_conditions){
      containsPath = containsPath || Pyt.includes(condition_path)
    }
    //and finally, our verdict is:
    Verdict = Verdict || (containsTags && containsPath)
    if (Verdict) {
      filtered_files.push(raw_data[i])
    }
  }

  //creating map with each node having a custom unfilled template




  //direct access array to check for the file existance
   function maping(arr) {
    const map = new Map()
    for (let i = 0; i < arr.length; i++) {
    const heading = arr[i].basename
    const path = arr[i].path
    map.set(heading,new Node(heading,path))
    }
    return map
  } 

  const nodes_map = maping(filtered_files)


  //creating list of node basenames for the topological sort
  nodes_top_sort = basenames_array(filtered_files)
  edges_top_sort = []

  for (let i = 0; i < filtered_files.length; i++) {
    //start of the giant FOR cycle that iterates over every file fetched

    const heading_of_the_note = filtered_files[i].basename
    const path = filtered_files[i].path

    //getting the cache dictionary of the file:
    //(returns cache metadata https://docs.obsidian.md/Reference/TypeScript+API/CachedMetadata)  
    const caches = this.app.metadataCache.getCache(path)
    // check for Class property of the note
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
          if (nodes_map.has(node_name_in_the_link)) {
                  //adding improvised ;ink into map
                  nodes_map.get(heading_of_the_note).parents.add(node_name_in_the_link)
                  nodes_map.get(node_name_in_the_link).children.add(heading_of_the_note)
                  //topological sort
                  edges_top_sort.push([node_name_in_the_link,heading_of_the_note])
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
            if (nodes_map.has(links)) {
              nodes_map.get(heading_of_the_note).incoming.add(links)
              nodes_map.get(links).outcoming.add(heading_of_the_note)
              //topological sort
              edges_top_sort.push([links,heading_of_the_note])             
            }
          }
        }
    }
  }
  return [nodes_map,nodes_top_sort,edges_top_sort]
}


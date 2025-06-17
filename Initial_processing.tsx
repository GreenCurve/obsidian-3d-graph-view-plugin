import { basenames_array,topologicalSort,RemoveDuplicateLinks } from "functions_spellbook.tsx";
import { Node } from "classes_spellbook.tsx"
import { FilterFiles } from "Filtering.tsx"

//exported function that returns raw graph data
export function Dgraph7c94cd() {

  filtered_files = FilterFiles()

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
                  nodes_map.get(heading_of_the_note).incoming.add(node_name_in_the_link)
                  nodes_map.get(node_name_in_the_link).children.add(heading_of_the_note)
                  nodes_map.get(node_name_in_the_link).outcoming.add(heading_of_the_note)
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



  //remove duplicates
  edges_top_sort = RemoveDuplicateLinks(edges_top_sort)
  //impose correct norder on nodes with topological sorting
  nodes_order = topologicalSort(nodes_top_sort,edges_top_sort)
  return [nodes_map,nodes_order]
}


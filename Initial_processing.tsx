import { maping,basenames_array,topologicalSort,RemoveDuplicateLinks } from "functions_spellbook.tsx";
import { ShapeActor,Bridge } from "classes_spellbook.tsx"
import { FilterFiles } from "Filtering.tsx"

//exported function that returns raw graph data
export function Dgraph7c94cd() {
  filtered_files = FilterFiles()
  const one_map = maping(filtered_files)
  //creating list of node basenames for the topological sort
  nodes_top_sort = basenames_array(filtered_files)
  edges_top_sort = []
  //start of the giant FOR cycle that iterates over every file fetched
  for (let i = 0; i < filtered_files.length; i++) {
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
            frontmatter.Class = [frontmatter.Class];
        }
        for (let element of frontmatter.Class) {
          node_name_in_the_link = element.slice(2, -2)
          //links are displayed with "|", alias after it, so getting the real name
          node_name_in_the_link = node_name_in_the_link.split('|')[0] 
          //slicing of square brackets of the [[foo]], as it is stored that way in the Class
          if (one_map.has(node_name_in_the_link)) {
                  //adding improvised ;ink into map
                  let a = one_map.get(node_name_in_the_link)
                  let b = one_map.get(heading_of_the_note)
                  a.f_classed = true
                  b.f_classed = true
                  let bridge = new Bridge(a,b)
                  bridge.type = "class"
                  a.bridges.push(bridge)
                  b.bridges.push(bridge)
                  //the indexing part
                  a.outcoming_bridges.push(bridge)
                  b.incoming_bridges.push(bridge)
                  a.class_bridges.push(bridge)
                  b.class_bridges.push(bridge)
                  a.outcoming_class_bridges.push(bridge)
                  b.incoming_class_bridges.push(bridge)
                  //topological sort
                  edges_top_sort.push([a.id,b.id])
          }
        }
      }
      //check if it is proxy of someone
      if (!!frontmatter.Proxy){
        if (typeof frontmatter.Proxy === 'string') {
            frontmatter.Proxy = [frontmatter.Proxy];
        }
        for (let element of frontmatter.Proxy) {
          node_name_in_the_link = element.slice(2, -2)
          //links are displayed with "|", alias after it, so getting the real name
          node_name_in_the_link = node_name_in_the_link.split('|')[0] 
          //slicing of square brackets of the [[foo]], as it is stored that way in the Class
          if (one_map.has(node_name_in_the_link)) {
                  //adding improvised ;ink into map
                  let a = one_map.get(node_name_in_the_link)
                  let b = one_map.get(heading_of_the_note)
                  let bridge = new Bridge(a,b)
                  bridge.type = "proxy"
                  a.bridges.push(bridge)
                  b.bridges.push(bridge)
                  //the indexing part
                  a.outcoming_bridges.push(bridge)
                  b.incoming_bridges.push(bridge)
                  a.proxy_bridges.push(bridge)
                  b.proxy_bridges.push(bridge)
                  a.outcoming_proxy_bridges.push(bridge)
                  b.incoming_proxy_bridges.push(bridge)
                  //topological sort
                  edges_top_sort.push([a.id,b.id])
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
            if (links.endsWith("#")){
              continue;
            }
            if (one_map.has(links)) {

              let a = one_map.get(links)
              let b = one_map.get(heading_of_the_note)
              let bridge = new Bridge(a,b)
              a.bridges.push(bridge)
              b.bridges.push(bridge)
              if (a.f_classed){
                a.outcoming_bridges.push(bridge)
                b.incoming_bridges.push(bridge)
                a.to_classes_bridges.push(bridge)
                b.to_classes_bridges.push(bridge)
                a.outcoming_to_classes_bridges.push(bridge)
                b.incoming_to_classes_bridges.push(bridge)
                edges_top_sort.push([a.id,b.id])
              } else {
                //the indexing part
                a.outcoming_bridges.push(bridge)
                b.incoming_bridges.push(bridge)
                a.normal_bridges.push(bridge)
                b.normal_bridges.push(bridge)
                a.outcoming_normal_bridges.push(bridge)
                b.incoming_normal_bridges.push(bridge)
                edges_top_sort.push([a.id,b.id])
              }            
            }
          }
        }
    }
  }
  //remove duplicates
  edges_top_sort = RemoveDuplicateLinks(edges_top_sort)
  //impose correct norder on nodes with topological sorting
  nodes_order = topologicalSort(nodes_top_sort,edges_top_sort)
  return [one_map,nodes_order]
}


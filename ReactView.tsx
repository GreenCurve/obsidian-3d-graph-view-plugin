export function Dgraph7c94cd() {
  //exported function that builds and returns graph

  
  const graph = {
    "nodes":[],
    "links":[]
  }
  //graph that is going to be returned at the end
  //DO NOT CHANGE ANY KEY OF THE DICTIONARIES PUSHED TO THIS VARIABLE, IT SEEMS THEY ARE IMPORTANT LATER IN view.tsx


  const t_files = app.vault.getMarkdownFiles()
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


  
  const files = []; 
  for (let i = 0; i < t_files.length; i++) {


    //search with tags
    console.log(t_files[i].path)
    const t_c = this.app.metadataCache.getCache(t_files[i].path)
    //getting the cache dictionary of the file:
    //
    //
    // console.log('passed cash')
    const tags = t_c.frontmatter.tags
    const searchString = "Fundamentals_of_Data_Analysis";

    let containsString
    if (tags !== null) {
      containsString = tags.some(item => item.toLowerCase().includes(searchString.toLowerCase()));
      // console.log('passed tags')
    }

    // const searchString2 = "algebra";

    // let containsString2 
    // if (tags !== null) {
    //   containsString2 = tags.some(item => item.toLowerCase().includes(searchString2.toLowerCase()));
    //   // console.log('passed tags')
    // }

    // search with paths
    // const Pyt = t_files[i].path
    // const search_path = "Workspace"
    // const containsPath = Pyt.includes(search_path)

    ////  well, and this is search itself

    sortcondition = containsString //|| containsString2

    if (sortcondition) {
      files.push(t_files[i])
    }
  }
  // sorting only the ones who are in Workspace
  //const files = t_files

  function maping() {
    const map = new Map()
    for (let i = 0; i < files.length; i++) {
    const heading = files[i].basename
    map.set(heading, "i")
    }
    return map
  }
  //TODO, some kind of global map of files?

  const map = maping()


  Color_Based_On_Class = {}
  //keep track of all the "class" properties (only applicable to my vault) and map the entire class group to its color 

  for (let i = 0; i < files.length; i++) {
  //start of the giant FOR cycle that iterates over every file fetched

  const heading_of_the_note = files[i].basename
  const path = files[i].path
  //

  graph.nodes.push({"id": heading_of_the_note,"path": path, "color": false})
  //pushing fresh node to the nodes of the graph
  //no color finding performed yet, sot it is false for now

  const caches = this.app.metadataCache.getCache(path)
  //getting the cache dictionary of the file:
  //
  //


  //(returns cache metadata https://docs.obsidian.md/Reference/TypeScript+API/CachedMetadata)  

  if (("frontmatter" in caches)) {
    //first possible link check,those are links in properties (Class)



    //following function returns random hex color (#RRGGBB) that is not 'bad' (no pale, dark, etc colors)
    function getRandomColor() {
        let r, g, b;

        do {
            r = Math.floor(Math.random() * 256); // Red (0-255)
            g = Math.floor(Math.random() * 256); // Green (0-255)
            b = Math.floor(Math.random() * 256); // Blue (0-255)

            // Brightness = r + g + b (simple heuristic for brightness)
            var brightness = r + g + b;
        } while (brightness < 200 || brightness > 700 || Math.abs(r - g) < 30 && Math.abs(g - b) < 30);

        // Convert RGB values to Hex
        const toHex = (value) => value.toString(16).padStart(2, '0');
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }


    const frontmatter = caches.frontmatter

  
    if (!!frontmatter.Class){

      // console.log(frontmatter.Class)
      // console.log(typeof frontmatter.Class)
      if (typeof frontmatter.Class === 'string') {
          variable = [variable];
      }
      // just in case i have left onld text-only Class property (new ones are lists which for some reason have type 'object')




      for (let element of frontmatter.Class) {
        c_links = element.slice(2, -2)
        c_links = c_links.split('|')[0] //links are displayed with "|", alias after it, so getting the real name
        // console.log('c_links')
        // console.log(c_links)

        //slicing of square brackets of the [[foo]], as it is stored that way in the Class
        if (map.has(c_links)) {
                if (!(c_links in Color_Based_On_Class)) {
                  Color_Based_On_Class[c_links] = getRandomColor()
                }
                graph.links.push({"source":  c_links,"target": heading_of_the_note,"value": 1, "color": Color_Based_On_Class[c_links], "curvature": false})
                //WARNING: link is bottom-up for a reason, it helps with DAG
                const lastElement = graph.nodes.slice(-1)[0]
                lastElement.color = Color_Based_On_Class[c_links]
        }
      }
    }
  }

  if (("links" in caches)) {
    //second possible link check, those are links in the text


      const link = caches.links
      
      if (!!link) {
        for (let j = 0; j < link.length; j++) {
          const links = link[j].link;
          // console.log('links')
          // console.log(links)
          if (map.has(links)) {



            function addDictionary(arr, newDict) {
              // Check if the reverse of the new dictionary exists in the array
              for (let dict of arr) {

                if (dict.source === newDict.target && dict.target === newDict.source) {
                    dict.curvature = true;      // Update the existing dictionary
                    newDict.curvature = true;
                }
              }
              // Add the new dictionary to the array
              arr.push(newDict);
            }

            let arr = graph.links
            let newDict = {"source":  links,"target": heading_of_the_note,"value": 1, "color": false, "curvature": false}
            //WARNING: link is bottom-up for a reason, it helps with DAG

            addDictionary(arr, newDict);
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
  // console.log(graph)
    return graph
}


export function FilterFiles() {

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
    const search_conditions = ["temp"]
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


  return filtered_files

}
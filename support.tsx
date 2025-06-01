//following function returns random hex color (#RRGGBB) that is not 'bad' (no pale, dark, etc colors)
export const getRandomColor = (function () {
  // Generate random initial hue on first use
  let hue = Math.random() * 360;
  const golden_ratio = 137.508; // spacing for good color separation
  const saturation = 90; // vibrant
  const lightness = 60;  // bright

  function hslToHex(h, s, l) {
    s /= 100;
    l /= 100;

    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
      const color = l - a * Math.max(-1, Math.min(Math.min(k(n) - 3, 9 - k(n)), 1));
      return Math.round(255 * color).toString(16).padStart(2, '0');
    };

    return `#${f(0)}${f(8)}${f(4)}`;
  }

  return function () {
    hue = (hue + golden_ratio) % 360;
    return hslToHex(hue, saturation, lightness);
  };
})();


export  function blendHexColors(colors) {
    if (!colors.length) return "#000000"; // default to black if list is empty

    let total = { r: 0, g: 0, b: 0 };

    colors.forEach(hex => {
      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      total.r += r;
      total.g += g;
      total.b += b;
    });

    const n = colors.length;
    const avg = {
      r: Math.round(total.r / n),
      g: Math.round(total.g / n),
      b: Math.round(total.b / n),
    };

    const toHex = c => c.toString(16).padStart(2, '0');

    return `#${toHex(avg.r)}${toHex(avg.g)}${toHex(avg.b)}`;
  }


//cuz apparently i cannot just pop
export function removeItem(array, value) {
  const index = array.indexOf(value);
  if (index !== -1) {
    array.splice(index, 1);
  }
  // else do nothing
}


//find if the name exists among the ids of node objects in some list
export function idExists(arr, searchId) {
return arr.some(item => item.id === searchId);
}

// Check if the reverse of the link exists in the array
export function addDictionary(arr, newDict) {
  for (let dict of arr) {
    if (dict.source === newDict.target && dict.target === newDict.source) {
        dict.curvature = true;      // Update the existing dictionary
        newDict.curvature = true;
    }
  }
  arr.push(newDict);
} 

export function RemoveDuplicateLinks(arr) {
  //cleanup of the duplicates
  const seen = new Set();
  const unique = [];

  for (const pair of arr) {
    const key = JSON.stringify(pair);
    if (!seen.has(key)) {
      seen.add(key);
      unique.push(pair); // original array, not string
    }
  }
  return unique
}


export function topologicalSort(nodes, edges) {
  
      // Build graph_top_sort and in-degree map
      const graph_top_sort = new Map();
      const inDegree = new Map();

      // Initialize maps
      for (const node of nodes) {
        graph_top_sort.set(node, []);
        inDegree.set(node, 0);
      }
            // Build adjacency list and in-degree count
      for (const [from, to] of edges) {       
        graph_top_sort.get(from).push(to);
        inDegree.set(to, inDegree.get(to) + 1);
      }

      // Collect nodes with no incoming edges
      const queue = [];
      for (const [node, degree] of inDegree) {
        if (degree === 0) queue.push(node);
      }

      const sorted = [];

      while (queue.length > 0) {
        const current = queue.shift();
        sorted.push(current);

        for (const neighbor of graph_top_sort.get(current)) {
          inDegree.set(neighbor, inDegree.get(neighbor) - 1);
          if (inDegree.get(neighbor) === 0) {
            queue.push(neighbor);
          }
        }
      }

      // Check for cycles
      if (sorted.length !== nodes.length) {
        const unprocessed = nodes.filter(n => !sorted.includes(n));
        throw new Error("Cycle detected involving these nodes:", unprocessed);
        }

      return sorted;
    }





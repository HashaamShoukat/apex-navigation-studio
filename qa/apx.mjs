// Minimal APEXlang reader for the QA harness: enough to read list and page templates.
//   component name ( ... )   group { ... }   key: value   key:\n ```lang ... ```   key: [ a b ]
// Returns { type, id, props: { "group.key": value }, children: [...] }.
export function parseApx(src) {
    const lines = src.replace(/\r\n/g, "\n").split("\n");
    let i = 0;
    function comp(type, id) {
        const node = { type, id, props: {}, children: [] };
        const path = [];
        while (i < lines.length) {
            const raw = lines[i++], line = raw.trim();
            if (!line) continue;
            if (line === ")") return node;
            if (line === "}") { path.pop(); continue; }
            let m;
            if ((m = /^([A-Za-z]+) ("[^"]+"|[\w.-]+) \($/.exec(line))) { node.children.push(comp(m[1], m[2].replace(/"/g, ""))); continue; }
            if ((m = /^([A-Za-z]\w*) \{$/.exec(line))) { path.push(m[1]); continue; }
            if ((m = /^([\w]+):\s*(.*)$/.exec(line))) {
                const key = [...path, m[1]].join(".");
                let v = m[2];
                if (v === "") {
                    // fenced block on the following lines
                    const open = lines[i].trim();
                    if (open.startsWith("```")) {
                        const ind = lines[i].indexOf("```"); i++;
                        const body = [];
                        while (i < lines.length && lines[i].trim() !== "```") { body.push(lines[i].slice(ind)); i++; }
                        i++;
                        v = body.join("\n");
                    }
                } else if (v === "[") {
                    const arr = [];
                    while (i < lines.length && lines[i].trim() !== "]") { arr.push(lines[i].trim()); i++; }
                    i++;
                    v = arr;
                }
                node.props[key] = v;
                continue;
            }
            throw new Error("apx parse: cannot read line " + i + ": " + raw);
        }
        return node;
    }
    const out = [];
    while (i < lines.length) {
        const line = lines[i++].trim();
        const m = /^([A-Za-z]+) ("[^"]+"|[\w.-]+)? ?\($/.exec(line);
        if (m) out.push(comp(m[1], (m[2] || "").replace(/"/g, "")));
    }
    return out;
}

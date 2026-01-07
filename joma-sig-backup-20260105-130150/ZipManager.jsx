import React, { useState, useRef, useMemo } from "react";
import { ZipReader, BlobReader, BlobWriter } from "@zip.js/zip.js";

export default function UltimateZipDashboardPlus() {
  const [zipSessions, setZipSessions] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name");
  const fileInputRef = useRef(null);

  // Charger un ZIP
  const loadZip = async (file) => {
    if (!file) return;
    setStatus(`Lecture du ZIP ${file.name}...`);
    const zipReader = new ZipReader(new BlobReader(file));
    const entries = await zipReader.getEntries();

    const tree = entries.map(entry => ({
      name: entry.filename,
      directory: entry.directory,
      size: entry.uncompressedSize,
      entry
    }));

    setZipSessions(prev => [
      ...prev,
      {
        name: file.name,
        size: file.size,
        zipReader,
        entries: tree,
        extracted: [],
        progress: 0
      }
    ]);
    setStatus(`ZIP ${file.name} chargÃƒÆ’Ã‚Â© !`);
  };

  // Extraire un fichier
  const extractFile = async (sessionIndex, entry) => {
    const session = zipSessions[sessionIndex];
    if (!session || entry.directory) return;

    setStatus(`Extraction de ${entry.name}...`);
    const blob = await entry.entry.getData(new BlobWriter());
    const url = URL.createObjectURL(blob);

    let preview = null;
    if (entry.name.match(/\.(png|jpg|jpeg|gif|webp)$/i)) preview = <img src={url} alt={entry.name} style={{maxWidth:150,maxHeight:150}}/>;
    else if (entry.name.match(/\.(txt|csv|log)$/i)) {
      const text = await blob.text();
      preview = <pre style={{ maxHeight:150, overflow:'auto' }}>{text}</pre>;
    } else if (entry.name.match(/\.pdf$/i)) preview = <iframe src={url} title={entry.name} style={{ width:"100%", height:200 }} />;

    setZipSessions(prev => {
      const newSessions = [...prev];
      newSessions[sessionIndex].extracted.push({ name: entry.name, blob, url, preview });
      newSessions[sessionIndex].progress = Math.round((newSessions[sessionIndex].extracted.length / newSessions[sessionIndex].entries.length) * 100);
      return newSessions;
    });
    setStatus(`Fichier ${entry.name} extrait !`);
  };

  // TÃƒÆ’Ã‚Â©lÃƒÆ’Ã‚Â©charger tous les fichiers extraits
  const downloadAll = (sessionIndex) => {
    const session = zipSessions[sessionIndex];
    if (!session) return;
    session.extracted.forEach(f => {
      const link = document.createElement("a");
      link.href = f.url;
      link.download = f.name;
      link.click();
    });
  };

  // ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â¹ Tri et filtrage
  const filteredSessions = useMemo(() => {
    return zipSessions.map(session => {
      let entries = session.entries;

      // Filtrer par recherche
      if (search) entries = entries.filter(e => e.name.toLowerCase().includes(search.toLowerCase()));

      // Filtrer par type
      if (filter !== "all") {
        const extMap = {
          images: /\.(png|jpg|jpeg|gif|webp)$/i,
          text: /\.(txt|csv|log)$/i,
          pdf: /\.pdf$/i
        };
        entries = entries.filter(e => e.name.match(extMap[filter]));
      }

      // Trier
      entries = [...entries].sort((a,b) => {
        if (sortBy === "name") return a.name.localeCompare(b.name);
        if (sortBy === "size") return a.size - b.size;
        return 0;
      });

      return { ...session, entries };
    });
  }, [zipSessions, search, filter, sortBy]);

  // Progression globale
  const globalProgress = useMemo(() => {
    const totalFiles = zipSessions.reduce((acc,s) => acc + s.entries.length, 0);
    const totalExtracted = zipSessions.reduce((acc,s) => acc + s.extracted.length, 0);
    return totalFiles === 0 ? 0 : Math.round((totalExtracted/totalFiles)*100);
  }, [zipSessions]);

  return (
    <div style={{padding:20}}>
      <h2>ÃƒÂ°Ã…Â¸Ã¢â‚¬â„¢Ã…Â½ Ultimate ZIP Dashboard Plus</h2>

      <div style={{marginBottom:10}}>
        <input type="text" placeholder="ÃƒÂ°Ã…Â¸Ã¢â‚¬ÂÃ‚Â Rechercher un fichier..." value={search} onChange={e => setSearch(e.target.value)} style={{marginRight:10}} />
        <select value={filter} onChange={e => setFilter(e.target.value)} style={{marginRight:10}}>
          <option value="all">Tous</option>
          <option value="images">Images</option>
          <option value="text">Textes</option>
          <option value="pdf">PDF</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
          <option value="name">Nom</option>
          <option value="size">Taille</option>
        </select>
      </div>

      <div
        style={{border:"2px dashed #888", padding:20, textAlign:"center", cursor:"pointer", marginBottom:20}}
        onDrop={e => {
          e.preventDefault();
          loadZip(e.dataTransfer.files[0]);
        }}
        onDragOver={e => e.preventDefault()}
        onClick={() => fileInputRef.current.click()}
      >
        Glisser-dÃƒÆ’Ã‚Â©poser un ZIP ou cliquez pour ouvrir
      </div>
      <input ref={fileInputRef} type="file" accept=".zip" style={{display:"none"}} onChange={e => loadZip(e.target.files[0])} />

      {status && <div style={{margin:"10px 0"}}><strong>Status:</strong> {status}</div>}

      <div>
        <strong>Progression globale: {globalProgress}%</strong>
        <progress value={globalProgress} max="100" style={{width:"100%", marginBottom:20}}></progress>
      </div>

      {filteredSessions.map((session, idx) => (
        <div key={idx} style={{border:"1px solid #ccc", padding:15, marginTop:20}}>
          <h3>{session.name}</h3>
          <p>Taille: {(session.size / 1024).toFixed(2)} KB | Fichiers: {session.entries.length}</p>
          <progress value={session.progress} max="100" style={{width:"100%"}}></progress>

          <div style={{display:"flex", flexWrap:"wrap", gap:10, marginTop:10}}>
            {session.entries.map((entry, i) => (
              <div key={i} style={{border:"1px solid #aaa", padding:5}}>
                <span>{entry.name}</span>
                {!entry.directory && <button style={{marginLeft:5}} onClick={() => extractFile(idx, entry)}>Extraire</button>}
              </div>
            ))}
          </div>

          {session.extracted.length > 0 && (
            <div style={{marginTop:15}}>
              <h4>Fichiers extraits</h4>
              <button onClick={() => downloadAll(idx)} style={{marginBottom:10}}>TÃƒÆ’Ã‚Â©lÃƒÆ’Ã‚Â©charger tout</button>
              <div style={{display:"flex", flexWrap:"wrap", gap:10}}>
                {session.extracted.map((f,i) => (
                  <div key={i} style={{border:"1px solid #ddd", padding:5}}>
                    <a href={f.url} download={f.name}>{f.name}</a>
                    <div>{f.preview}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

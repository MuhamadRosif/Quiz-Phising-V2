import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../lib/api";

export default function Leaderboard(){
  const [list, setList] = useState([]);

  useEffect(()=>{
    fetchLeaderboard().then(setList).catch(()=>{});
  },[]);

  return (
    <div className="card">
      <h3>Leaderboard</h3>
      <ol className="list" style={{marginTop:12}}>
        {list.map((p, idx)=>(
          <li key={p.id} className="q-card" style={{display:"flex", justifyContent:"space-between", alignItems:"center"}}>
            <div>
              <div style={{fontWeight:700}}>{idx+1}. {p.name}</div>
              <div className="small">Detail: {p.details ? JSON.stringify(p.details) : "-"}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontWeight:700}}>{p.total_score ?? 0} pts</div>
              <div className="small">{p.total_time ?? 0}s</div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

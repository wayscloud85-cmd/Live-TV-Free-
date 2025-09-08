// live-iptv-player.js
(function(){
  // Inject styles
  const style = document.createElement('style');
  style.innerHTML = `
  * { box-sizing:border-box; margin:0; padding:0; }
  body { font-family:'Arial',sans-serif; background:#1E1E2F; color:#fff; }
  header { display:flex; align-items:center; justify-content:center; background:#2C2C3E; padding:15px 25px; position:sticky; top:0; z-index:1000; box-shadow:0 2px 5px rgba(0,0,0,0.5); }
  header h1 { font-size:1.6rem; color:#FF5722; }
  .top-controls { display:flex; gap:10px; max-width:1100px; margin:25px auto 0; padding:0 15px; }
  input[type=text] { flex:1; padding:8px 10px; border-radius:6px; border:none; background:#2C2C3E; color:#fff; }
  button { padding:8px 14px; border:none; border-radius:6px; background:#FF5722; color:#fff; cursor:pointer; font-weight:bold; }
  button:hover { background:#FF7043; }
  #player-container { display:block; max-width:1100px; margin:25px auto; padding:0 15px; }
  video, iframe { width:100%; border-radius:12px; background:#000; max-height:650px; box-shadow:0 4px 20px rgba(0,0,0,0.5); }
  .category-title { margin:25px 15px 5px; font-size:18px; color:#FFC107; font-weight:bold; }
  .channel-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(140px,1fr)); gap:20px; max-width:1100px; margin:0 auto 35px; padding:0 15px; }
  .channel { background:#2C2C3E; border-radius:12px; cursor:pointer; padding:10px; text-align:center; transition:0.3s; position:relative; box-shadow:0 2px 8px rgba(0,0,0,0.4); }
  .channel:hover { transform:translateY(-5px) scale(1.05); background:#3D3D5A; }
  .channel img { width:100%; height:100px; object-fit:contain; border-radius:8px; background:#222; padding:5px; }
  .channel-name { margin-top:10px; font-weight:bold; font-size:14px; color:#FFC107; }
  .dot-menu-btn { position:absolute; top:8px; right:10px; cursor:pointer; font-size:20px; color:#FFC107; }
  .dot-menu-content { display:none; position:absolute; top:30px; right:10px; background:#2C2C3E; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.4); z-index:10; min-width:140px; }
  .dot-menu-content a { display:block; padding:10px; color:#fff; text-decoration:none; transition:0.2s; }
  .dot-menu-content a:hover { background:#3D3D5A; }
  footer { text-align:center; padding:18px; background:#2C2C3E; margin-top:50px; font-size:14px; color:#aaa; }
  @media(max-width:768px){ video, iframe{ max-height:300px; } .channel img{ height:70px; } }
  `;
  document.head.appendChild(style);

  // Load HLS.js if not already loaded
  if(!window.Hls){
    const script = document.createElement('script');
    script.src = "https://cdn.jsdelivr.net/npm/hls.js@latest";
    document.head.appendChild(script);
  }

  // Create main elements
  const header = document.createElement('header');
  header.innerHTML = '<h1>Live IPTV Grid Player</h1>';
  document.body.appendChild(header);

  const controlsDiv = document.createElement('div');
  controlsDiv.className = 'top-controls';
  controlsDiv.innerHTML = `
    <input type="text" id="customLink" placeholder="Enter M3U/M3U8 link to play directly">
    <button id="playLinkBtn">Play Link</button>
    <input type="text" id="playlistUrl" placeholder="Enter M3U/M3U8 playlist URL">
    <button id="loadPlaylist">Load Playlist</button>
  `;
  document.body.appendChild(controlsDiv);

  const playerContainer = document.createElement('section');
  playerContainer.id = 'player-container';
  document.body.appendChild(playerContainer);

  const channelContainer = document.createElement('section');
  channelContainer.id = 'channelContainer';
  document.body.appendChild(channelContainer);

  const footer = document.createElement('footer');
  footer.innerHTML = '© 2025 Live IPTV Grid. All rights reserved.';
  document.body.appendChild(footer);

  // Channels data (example)
  const channelsData = [
    {category:"Sports", name:"PTV Sports", url:"https://tvsen5.aynaott.com/Ptvsports/tracks-v1a1/mono.ts.m3u8", logo:"https://i.imgur.com/CPm6GHA.png"},
    {category:"Sports", name:"T Sports", url:"https://tvsen5.aynaott.com/tsports/tracks-v1a1/mono.ts.m3u8", logo:"https://i.postimg.cc/7PdvbtGt/T-Sports-logo-svg.png"},
    {category:"News", name:"Geo News", url:"https://jk3lz82elw79-hls-live.5centscdn.com/newgeonews/07811dc6c422334ce36a09ff5cd6fe71.sdp/playlist.m3u8", logo:"https://i.imgur.com/Op4EsaB.png"},
  ];

  let hls;

  function playStream(url){
    playerContainer.innerHTML='';
    if(url.includes("youtube.com")){
      const videoId = url.split("/live/")[1] || url.split("watch?v=")[1];
      const iframe = document.createElement('iframe');
      iframe.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0";
      iframe.allow = "autoplay; encrypted-media";
      iframe.allowFullscreen = true;
      iframe.style.width = "100%";
      iframe.style.height = "650px";
      iframe.style.border = "0";
      playerContainer.appendChild(iframe);
    } else {
      const video = document.createElement('video');
      video.controls = true;
      video.autoplay = true;
      playerContainer.appendChild(video);
      if(window.Hls && Hls.isSupported()){ 
        if(hls) hls.destroy();
        hls = new Hls(); 
        hls.loadSource(url); 
        hls.attachMedia(video); 
        hls.on(Hls.Events.MANIFEST_PARSED, ()=>video.play()); 
      } else { video.src = url; video.play(); }
    }
    playerContainer.scrollIntoView({behavior:'smooth'});
  }

  function displayChannels(data){
    channelContainer.innerHTML='';
    const categories = [...new Set(data.map(ch=>ch.category))];
    categories.forEach(cat=>{
      const title = document.createElement('div'); title.className='category-title'; title.textContent=cat;
      channelContainer.appendChild(title);
      const grid = document.createElement('div'); grid.className='channel-grid';
      data.filter(ch=>ch.category===cat).forEach(ch=>{
        const div = document.createElement('div'); div.className='channel'; div.dataset.url=ch.url;
        div.innerHTML = `
          <span class="dot-menu-btn" onclick="toggleMenu(this)">⋮</span>
          <div class="dot-menu-content">
            <a href="#" onclick="copyLink('${ch.url}', event)">Copy Link</a>
            <a href="#">Add to Favorites</a>
            <a href="#">Share</a>
            <a href="#">Info</a>
          </div>
          <img src="${ch.logo}" alt="${ch.name}">
          <div class="channel-name">${ch.name}</div>`;
        div.addEventListener('click', e=>{
          if(!e.target.classList.contains('dot-menu-btn') && !e.target.closest('.dot-menu-content')) playStream(ch.url);
        });
        grid.appendChild(div);
      });
      channelContainer.appendChild(grid);
    });
  }

  window.copyLink = function(url, e){ e.stopPropagation(); navigator.clipboard.writeText(url).then(()=>alert("Link copied!")); }
  window.toggleMenu = function(btn){ const menu=btn.nextElementSibling; document.querySelectorAll('.dot-menu-content').forEach(m=>{if(m!==menu)m.style.display='none';}); menu.style.display=(menu.style.display==='block')?'none':'block'; }

  document.addEventListener('click', function(e){
    if(!e.target.classList.contains('dot-menu-btn') && !e.target.closest('.dot-menu-content')){
      document.querySelectorAll('.dot-menu-content').forEach(m => m.style.display='none');
    }
  });

  document.getElementById('playLinkBtn').addEventListener('click', ()=>{
    const url = document.getElementById('customLink').value.trim();
    if(url) playStream(url);
  });

  displayChannels(channelsData);
  if(channelsData.length>0) playStream(channelsData[0].url);

})();

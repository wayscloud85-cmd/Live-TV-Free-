<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Live IPTV Grid Player</title>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
<style>
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
.active-channel { border:2px solid #FF5722; }
.dot-menu-btn { position:absolute; top:8px; right:10px; cursor:pointer; font-size:20px; color:#FFC107; }
.dot-menu-content { display:none; position:absolute; top:30px; right:10px; background:#2C2C3E; border-radius:6px; box-shadow:0 4px 12px rgba(0,0,0,0.4); z-index:10; min-width:140px; }
.dot-menu-content a { display:block; padding:10px; color:#fff; text-decoration:none; transition:0.2s; }
.dot-menu-content a:hover { background:#3D3D5A; }
footer { text-align:center; padding:18px; background:#2C2C3E; margin-top:50px; font-size:14px; color:#aaa; }
@media(max-width:768px){ video, iframe{ max-height:300px; } .channel img{ height:70px; } }
</style>
</head>
<body>

<header>
  <h1>Live IPTV Grid Player</h1>
</header>

<div class="top-controls">
  <input type="text" id="customLink" placeholder="Enter M3U/M3U8 link to play directly">
  <button id="playLinkBtn">Play Link</button>
  <input type="text" id="playlistUrl" placeholder="Enter M3U/M3U8 playlist URL">
  <button id="loadPlaylist">Load Playlist</button>
</div>

<section id="player-container"></section>
<section id="channelContainer"></section>
<footer>© 2025 Live IPTV Grid. All rights reserved.</footer>

<script>
const playerContainer = document.getElementById('player-container');
const channelContainer = document.getElementById('channelContainer');
const customLinkInput = document.getElementById('customLink');
const playLinkBtn = document.getElementById('playLinkBtn');

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
  } else if(url.includes("ptvsportshd.net")) {
    const iframe = document.createElement('iframe');
    iframe.src = url;
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
    if(Hls.isSupported()){ 
      hls = new Hls(); 
      hls.loadSource(url); 
      hls.attachMedia(video); 
      hls.on(Hls.Events.MANIFEST_PARSED, ()=>video.play()); 
    } else { video.src = url; video.play(); }
  }
  playerContainer.scrollIntoView({behavior:'smooth'});
}

// Channels data
const channelsData = [
  // Sports
  {category:"Sports", name:"PTV Sports", url:"https://tvsen5.aynaott.com/Ptvsports/tracks-v1a1/mono.ts.m3u8", logo:"https://i.imgur.com/CPm6GHA.png"},
  {category:"Sports", name:"T Sports", url:"https://tvsen5.aynaott.com/tsports/tracks-v1a1/mono.ts.m3u8", logo:"https://i.postimg.cc/7PdvbtGt/T-Sports-logo-svg.png"},
  {category:"Sports", name:"GTV Sports", url:"https://tvsen5.aynaott.com/Ravc7gPCZpxk/tracks-v1a1/mono.ts.m3u8", logo:"https://i.postimg.cc/0yFRKtBy/gtv-live-cricket-logo.webp"},
  {category:"Sports", name:"RTA Sports", url:"https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA3)/index.m3u8", logo:"https://i.postimg.cc/6qDg2JN8/rtasport.png"},
  {category:"Sports", name:"A Sports", url:"https://stream2.aryzap.com/v1/018a8885b8951eb401a603639363/018a88860ada09831f17035d95dd/ARYBK2H264_720p.m3u8", logo:"https://i.postimg.cc/QNczJxvr/A-Sports-Logo.png"},
  {category:"Sports", name:"Ten Sports", url:"https://tapmadlive.akamaized.net/tapmadold/tensports.smil/chunklist_w1543578491_b1248000_slENG.m3u8", logo:"https://i.imgur.com/nnqpYNm.png"},
  {category:"Sports", name:"Tamasha Live", url:"https://ptvsportshd.net/?p=1108/fvp-37/#fvp_37", logo:"https://i.postimg.cc/VLgm4F21/63c1e52872e94.jpg"},
  {category:"Sports", name:"Start Sports", url:"https://edge4-moblive.yuppcdn.net/drm1/smil:starsports2drm.smil/chunklist_b996000.m3u8", logo:"https://i.imgur.com/5En7pOI.png"},
  {category:"Sports", name:"Willow", url:"https://muc100.myluck1.top:8088/live/webcricm05/playlist.m3u8?vidictid=20339551028&id=114516&pk=000affe68ec9acd1d17eeb194131da6682a44900efc9b36aa3b21deb9d24ceef39c843b93b1defb4b7a3903d45d34a8ed88e731251ea10467bd6e1d97bb27b4a", logo:"https://i.imgur.com/v7nSm7M.png"},
  {category:"Sports", name:"Sky Sports", url:"https://muc200.myluck1.top:8088/live/webcrice08/playlist.m3u8?vidictid=203393984899&id=116153&pk=000affe68ec9acd1d17eeb194131da6682a44900efc9b36aa3b21deb9d24ceef39c843b93b1defb4b7a3903d45d34a8ed88e731251ea10467bd6e1d97bb27b4a", logo:"https://i.imgur.com/SuTOqKi.png"},
  {category:"Sports", name:"GEO Super", url:"https://muc100.myluck1.top:8088/live/webcricp01/playlist.m3u8?vidictid=203391083934&id=113431&pk=000affe68ec9acd1d17eeb194131da6682a44900efc9b36aa3b21deb9d24ceef39c843b93b1defb4b7a3903d45d34a8ed88e731251ea10467bd6e1d97bb27b4a", logo:"https://upload.wikimedia.org/wikipedia/en/5/5f/Geo_Super_logo.png"},

  // News
  {category:"News", name:"Geo News", url:"https://jk3lz82elw79-hls-live.5centscdn.com/newgeonews/07811dc6c422334ce36a09ff5cd6fe71.sdp/playlist.m3u8", logo:"https://i.imgur.com/Op4EsaB.png"},
  {category:"News", name:"Discover Pakistan", url:"https://livecdn.live247stream.com/discoverpakistan/web/playlist.m3u8", logo:"https://i.imgur.com/IJH47fJ.png"},
  {category:"News", name:"Dunia News", url:"https://imob.dunyanews.tv/livehd/ngrp:dunyalivehd_2_all/playlist.m3u8", logo:"https://i.postimg.cc/htHtP9VP/dunyanews.png"},
  {category:"News", name:"Lahore News", url:"https://vcdn.dunyanews.tv/lahorelive/ngrp:lnews_1_all/playlist.m3u8", logo:"https://i.imgur.com/bQfQeEA.jpeg"},
  {category:"News", name:"PTV News", url:"https://www.youtube.com/live/RJFJprClvlk?si=2ubPnVsZqsr63DXj", logo:"https://i.imgur.com/Fpn8VU7.png"}
];

// Display channels
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

// Copy link
function copyLink(url, e){
  e.stopPropagation();
  navigator.clipboard.writeText(url).then(()=>{ alert("Link copied to clipboard!"); });
}

// Toggle 3-dot menu
function toggleMenu(btn){
  const menu = btn.nextElementSibling;
  document.querySelectorAll('.dot-menu-content').forEach(m => { if(m!==menu) m.style.display='none'; });
  menu.style.display = (menu.style.display==='block') ? 'none' : 'block';
}
document.addEventListener('click', function(e){
  if(!e.target.classList.contains('dot-menu-btn') && !e.target.closest('.dot-menu-content')){
    document.querySelectorAll('.dot-menu-content').forEach(m => m.style.display='none');
  }
});

// Custom link button
playLinkBtn.addEventListener('click', ()=>{
  const url = customLinkInput.value.trim();
  if(url) playStream(url);
});

// Display channels and autoplay first
displayChannels(channelsData);
if(channelsData.length>0) playStream(channelsData[0].url);
</script>
</body>
</html>

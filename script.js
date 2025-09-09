const playerContainer = document.getElementById('player-container');
const channelContainer = document.getElementById('channelContainer');
const input = document.getElementById('customLink');
const loadBtn = document.getElementById('loadBtn');
let hls;

// Built-in channels
let channelsData = [
  {category:"Sports", name:"DD Sports", url:"https://cdn-6.pishow.tv/live/13/master.m3u8", logo:"https://i.postimg.cc/3W5Mz7q7/DVag2TSu.jpg"},
  {category:"Sports", name:"Star Sports", url:"https://live20.bozztv.com/akamaissh101/ssh101/vboxsungosttamil/playlist.m3u8", logo:"https://i.imgur.com/dfLSnsZ.png"},
  {category:"Sports", name:"Star Sports 2", url:"https://edge4-moblive.yuppcdn.net/drm1/smil:starsports2drm.smil/chunklist_b996000.m3u8", logo:"https://i.imgur.com/5En7pOI.png"},
  {category:"Sports", name:"PTV Sports", url:"https://tvsen5.aynaott.com/Ptvsports/tracks-v1a1/mono.ts.m3u8", logo:"https://i.imgur.com/CPm6GHA.png"},
  {category:"Sports", name:"T Sports", url:"https://tvsen5.aynaott.com/tsports/tracks-v1a1/mono.ts.m3u8", logo:"https://i.postimg.cc/7PdvbtGt/T-Sports-logo-svg.png"},
  {category:"Sports", name:"GTV Sports", url:"https://tvsen5.aynaott.com/Ravc7gPCZpxk/tracks-v1a1/mono.ts.m3u8", logo:"https://i.postimg.cc/0yFRKtBy/gtv-live-cricket-logo.webp"},
  {category:"Sports", name:"RTA Sports", url:"https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA3)/index.m3u8", logo:"https://i.postimg.cc/6qDg2JN8/rtasport.png"},
  {category:"Sports", name:"A Sports", url:"https://stream2.aryzap.com/v1/018a8885b8951eb401a603639363/018a88860ada09831f17035d95dd/ARYBK2H264_720p.m3u8", logo:"https://i.postimg.cc/QNczJxvr/A-Sports-Logo.png"},
  {category:"Sports", name:"Ten Sports", url:"https://tapmadlive.akamaized.net/tapmadold/tensports.smil/chunklist_w1543578491_b1248000_slENG.m3u8", logo:"https://i.imgur.com/nnqpYNm.png"},
  {category:"Sports", name:"Tamasha Live", url:"https://tencentcdn1.tamashaweb.com/v1/019270c9d9cb1ea5069517c2d441eb/019270d5a4f11ea5578a17c4df535f/TMSH_OG_720p.m3u8", logo:"https://i.postimg.cc/VLgm4F21/63c1e52872e94.jpg"},
  {category:"News", name:"Geo News", url:"https://jk3lz82elw79-hls-live.5centscdn.com/newgeonews/07811dc6c422334ce36a09ff5cd6fe71.sdp/playlist.m3u8", logo:"https://i.imgur.com/Op4EsaB.png"},
  {category:"News", name:"Discover Pakistan", url:"https://livecdn.live247stream.com/discoverpakistan/web/playlist.m3u8", logo:"https://i.imgur.com/IJH47fJ.png"},
  {category:"News", name:"Dunia News", url:"https://imob.dunyanews.tv/livehd/ngrp:dunyalivehd_2_all/playlist.m3u8", logo:"https://i.postimg.cc/htHtP9VP/dunyanews.png"},
  {category:"News", name:"Lahore News", url:"https://vcdn.dunyanews.tv/lahorelive/ngrp:lnews_1_all/playlist.m3u8", logo:"https://i.imgur.com/bQfQeEA.jpeg"},
  {category:"News", name:"PTV News", url:"https://www.youtube.com/live/RJFJprClvlk?si=2ubPnVsZqsr63DXj", logo:"https://i.imgur.com/Fpn8VU7.png"}
];

// --- Helper: Guess category by channel name ---
function guessCategory(name){
  name = name.toLowerCase();
  if(name.includes("sport")) return "Sports";
  if(name.includes("news")) return "News";
  if(name.includes("music") || name.includes("mtv")) return "Music";
  if(name.includes("movie") || name.includes("cinema") || name.includes("hollywood")) return "Movies";
  if(name.includes("kid") || name.includes("cartoon") || name.includes("disney")) return "Kids";
  return "Playlist"; // fallback
}

// --- Play a stream ---
function playStream(url){
  playerContainer.innerHTML='';
  const video = document.createElement('video');
  video.controls = true;
  video.autoplay = true;
  playerContainer.appendChild(video);
  if(Hls.isSupported()){ 
    hls = new Hls(); 
    hls.loadSource(url); 
    hls.attachMedia(video); 
    hls.on(Hls.Events.MANIFEST_PARSED, ()=>video.play()); 
  } else { 
    video.src = url; 
    video.play(); 
  }
  playerContainer.scrollIntoView({behavior:'smooth'});
}

// --- Load M3U playlist and auto-sort ---
async function loadPlaylist(url){
  try{
    const res = await fetch(url);
    const text = await res.text();
    const lines = text.split('\n');
    let newChannels = [];
    let name = "Unknown", logo = "";
    for(let line of lines){
      line = line.trim();
      if(line.startsWith("#EXTINF")){
        const nameMatch = line.match(/,(.*)$/);
        if(nameMatch) name = nameMatch[1].trim();
        const logoMatch = line.match(/tvg-logo="(.*?)"/);
        if(logoMatch) logo = logoMatch[1];
      } else if(line && !line.startsWith("#")){
        const category = guessCategory(name);
        newChannels.push({category, name, url:line, logo});
        name = "Unknown"; logo = "";
      }
    }
    channelsData = [...channelsData, ...newChannels]; 
    displayChannels(channelsData);
  }catch(err){ 
    alert("Failed to load playlist: "+err); 
  }
}

// --- Render channels by category ---
function displayChannels(data){
  channelContainer.innerHTML='';
  const categories = [...new Set(data.map(ch=>ch.category))];
  categories.forEach(cat=>{
    const title = document.createElement('div'); 
    title.className='category-title'; 
    title.textContent=cat;
    channelContainer.appendChild(title);

    const grid = document.createElement('div'); 
    grid.className='channel-grid';

    data.filter(ch=>ch.category===cat).forEach(ch=>{
      const div = document.createElement('div'); 
      div.className='channel'; 
      div.dataset.url=ch.url;
      div.innerHTML = `
        <img src="${ch.logo || 'https://via.placeholder.com/120x80?text=TV'}" alt="${ch.name}">
        <div class="channel-name">${ch.name}</div>`;
      div.addEventListener('click', ()=>playStream(ch.url));
      grid.appendChild(div);
    });
    channelContainer.appendChild(grid);
  });
}

// --- Button action ---
loadBtn.addEventListener('click', ()=>{
  const url = input.value.trim();
  if(!url) return;
  if(url.endsWith(".m3u")) loadPlaylist(url);
  else if(url.endsWith(".m3u8")) playStream(url);
  else alert("Please enter a valid M3U or M3U8 link");
});

// --- Init ---
displayChannels(channelsData);
playStream(channelsData[0].url);

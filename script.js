const playerContainer = document.getElementById('player-container');
const channelContainer = document.getElementById('channelContainer');
const customLinkInput = document.getElementById('customLink');
const playLinkBtn = document.getElementById('playLinkBtn');

function playStream(url){
  playerContainer.innerHTML='';
  if(url.includes("youtube.com") || url.includes("ptvsportshd.net")){
    const iframe = document.createElement('iframe');
    iframe.src = url.includes("youtube.com") 
      ? "https://www.youtube.com/embed/" + url.split("watch?v=")[1] + "?autoplay=1&controls=0"
      : url;
    iframe.allow="autoplay; encrypted-media";
    iframe.allowFullscreen=true;
    iframe.style.width="100%";
    iframe.style.height="500px";
    iframe.style.border="0";
    playerContainer.appendChild(iframe);
  } else {
    const video = document.createElement('video');
    video.controls = true; video.autoplay = true;
    playerContainer.appendChild(video);
    if(Hls.isSupported()){
      let hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, ()=>video.play());
    } else { video.src = url; video.play(); }
  }
}

// Sample channels
const channels = [
  {name:"PTV Sports",url:"https://tvsen5.aynaott.com/Ptvsports/tracks-v1a1/mono.ts.m3u8",logo:"https://i.imgur.com/CPm6GHA.png"},
  {name:"A Sports",url:"https://stream2.aryzap.com/v1/018a8885b8951eb401a603639363/018a88860ada09831f17035d95dd/ARYBK2H264_720p.m3u8",logo:"https://i.postimg.cc/QNczJxvr/A-Sports-Logo.png"},
  {name:"Willow",url:"https://muc100.myluck1.top:8088/live/webcricm05/playlist.m3u8?vidictid=20339551028&id=114516&pk=000affe68ec9acd1d17eeb194131da6682a44900efc9b36aa3b21deb9d24ceef39c843b93b1defb4b7a3903d45d34a8ed88e731251ea10467bd6e1d97bb27b4a",logo:"https://i.imgur.com/v7nSm7M.png"},
  {name:"Sky Sports",url:"https://muc200.myluck1.top:8088/live/webcrice08/playlist.m3u8?vidictid=203393984899&id=116153&pk=000affe68ec9acd1d17eeb194131da6682a44900efc9b36aa3b21deb9d24ceef39c843b93b1defb4b7a3903d45d34a8ed88e731251ea10467bd6e1d97bb27b4a",logo:"https://i.imgur.com/SuTOqKi.png"},
  {name:"GEO Super",url:"https://muc100.myluck1.top:8088/live/webcricp01/playlist.m3u8?vidictid=203391083934&id=113431&pk=000affe68ec9acd1d17eeb194131da6682a44900efc9b36aa3b21deb9d24ceef39c843b93b1defb4b7a3903d45d34a8ed88e731251ea10467bd6e1d97bb27b4a",logo:"https://upload.wikimedia.org/wikipedia/en/5/5f/Geo_Super_logo.png"}
];

// Display channels
function displayChannels(){
  const grid = document.createElement('div');
  grid.className='channel-grid';
  channels.forEach(ch=>{
    const div = document.createElement('div');
    div.className='channel';
    div.onclick = ()=>playStream(ch.url);
    div.innerHTML = `<img src="${ch.logo}" alt=""><div class="channel-name">${ch.name}</div>`;
    grid.appendChild(div);
  });
  channelContainer.appendChild(grid);
}
displayChannels();

// Play custom link
playLinkBtn.addEventListener('click', ()=>{
  const url = customLinkInput.value.trim();
  if(url) playStream(url);
});

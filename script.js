const playerContainer = document.getElementById('player-container');
const channelContainer = document.getElementById('channelContainer');
const customLinkInput = document.getElementById('customLink');
const playLinkBtn = document.getElementById('playLinkBtn');

// Play stream function
function playStream(url) {
  playerContainer.innerHTML = '';

  if (url.includes("youtube.com") || url.includes("ptvsportshd.net")) {
    const iframe = document.createElement('iframe');
    iframe.src = url.includes("youtube.com")
      ? "https://www.youtube.com/embed/" + url.split("watch?v=")[1] + "?autoplay=1&controls=0"
      : url;
    iframe.allow = "autoplay; encrypted-media";
    iframe.allowFullscreen = true;
    iframe.style.width = "100%";
    iframe.style.height = "500px";
    iframe.style.border = "0";
    playerContainer.appendChild(iframe);
  } else {
    const video = document.createElement('video');
    video.controls = true;
    video.autoplay = true;
    playerContainer.appendChild(video);

    if (Hls.isSupported()) {
      let hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => video.play());
    } else {
      video.src = url;
      video.play();
    }
  }
}

// Stable channels
const channels = [
  // Sports
  {category:"Sports", name:"PTV Sports", url:"https://tvsen5.aynaott.com/Ptvsports/tracks-v1a1/mono.ts.m3u8", logo:"https://i.imgur.com/CPm6GHA.png"},
  {category:"Sports", name:"T Sports", url:"https://tvsen5.aynaott.com/tsports/tracks-v1a1/mono.ts.m3u8", logo:"https://i.postimg.cc/7PdvbtGt/T-Sports-logo-svg.png"},
  {category:"Sports", name:"GTV Sports", url:"https://tvsen5.aynaott.com/Ravc7gPCZpxk/tracks-v1a1/mono.ts.m3u8", logo:"https://i.postimg.cc/0yFRKtBy/gtv-live-cricket-logo.webp"},
  {category:"Sports", name:"RTA Sports", url:"https://rtatv.akamaized.net/Content/HLS/Live/channel(RTA3)/index.m3u8", logo:"https://i.postimg.cc/6qDg2JN8/rtasport.png"},
  {category:"Sports", name:"A Sports", url:"https://stream2.aryzap.com/v1/018a8885b8951eb401a603639363/018a88860ada09831f17035d95dd/ARYBK2H264_720p.m3u8", logo:"https://i.postimg.cc/QNczJxvr/A-Sports-Logo.png"},
  {category:"Sports", name:"Ten Sports", url:"https://tapmadlive.akamaized.net/tapmadold/tensports.smil/chunklist_w1543578491_b1248000_slENG.m3u8", logo:"https://i.imgur.com/nnqpYNm.png"},
  {category:"Sports", name:"Tamasha Live", url:"https://ptvsportshd.net/?p=1108/fvp-37/#fvp_37", logo:"https://i.postimg.cc/VLgm4F21/63c1e52872e94.jpg"},
  {category:"Sports", name:"Start Sports", url:"https://edge4-moblive.yuppcdn.net/drm1/smil:starsports2drm.smil/chunklist_b996000.m3u8", logo:"https://i.imgur.com/5En7pOI.png"},

  // News
  {category:"News", name:"Geo News", url:"https://jk3lz82elw79-hls-live.5centscdn.com/newgeonews/07811dc6c422334ce36a09ff5cd6fe71.sdp/playlist.m3u8", logo:"https://i.imgur.com/Op4EsaB.png"},
  {category:"News", name:"Discover Pakistan", url:"https://livecdn.live247stream.com/discoverpakistan/web/playlist.m3u8", logo:"https://i.imgur.com/IJH47fJ.png"},
  {category:"News", name:"Dunia News", url:"https://imob.dunyanews.tv/livehd/ngrp:dunyalivehd_2_all/playlist.m3u8", logo:"https://i.postimg.cc/htHtP9VP/dunyanews.png"},
  {category:"News", name:"Lahore News", url:"https://vcdn.dunyanews.tv/lahorelive/ngrp:lnews_1_all/playlist.m3u8", logo:"https://i.imgur.com/bQfQeEA.jpeg"},
  {category:"News", name:"PTV News", url:"https://www.youtube.com/live/RJFJprClvlk?si=2ubPnVsZqsr63DXj", logo:"https://i.imgur.com/Fpn8VU7.png"}
];

// Display channels
function displayChannels() {
  channelContainer.innerHTML = '';
  const categories = [...new Set(channels.map(ch => ch.category))];

  categories.forEach(cat => {
    const title = document.createElement('h2');
    title.textContent = cat;
    title.style.color = "#FFC107";
    title.style.margin = "20px 0 10px";
    channelContainer.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'channel-grid';

    channels.filter(ch => ch.category === cat).forEach(ch => {
      const div = document.createElement('div');
      div.className = 'channel';
      div.onclick = () => playStream(ch.url);
      div.innerHTML = `<img src="${ch.logo}" alt=""><div class="channel-name">${ch.name}</div>`;
      grid.appendChild(div);
    });

    channelContainer.appendChild(grid);
  });
}

// Initial load
displayChannels();

// Play custom link
playLinkBtn.addEventListener('click', () => {
  const url = customLinkInput.value.trim();
  if (url) playStream(url);
});

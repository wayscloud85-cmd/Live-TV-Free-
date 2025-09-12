const root = document.getElementById('channels-root');
const playerView = document.getElementById('player-view');
const channelsView = document.getElementById('channels-view');
const video = document.getElementById('video');
const relatedDiv = document.getElementById('related-channels');
const backBtn = document.getElementById('back-btn');
const searchInput = document.getElementById('search-input');
const totalCountDiv = document.getElementById('total-count');
let hls = null;

function renderChannels(filterCat=null){
  const searchQuery = searchInput.value.toLowerCase();
  root.innerHTML="";
  let filtered = channelsData;
  if(filterCat) filtered = filtered.filter(c=>c.category===filterCat);
  if(searchQuery) filtered = filtered.filter(c=>c.name.toLowerCase().includes(searchQuery));
  totalCountDiv.textContent=`Total Channels: ${filtered.length}`;
  const categories = [...new Set(filtered.map(c=>c.category))];
  categories.forEach(cat=>{
    const catTitle = document.createElement('div');
    catTitle.className='category-title';
    catTitle.textContent=cat;
    root.appendChild(catTitle);
    const container = document.createElement('div');
    container.className='channel-container';
    filtered.filter(ch=>ch.category===cat).forEach(ch=>{
      const item = document.createElement('div');
      item.className='channel';
      if(cat==="Sports") item.style.background="linear-gradient(135deg,#00d4ff,#0072ff)";
      if(cat==="News") item.style.background="linear-gradient(135deg,#ff7a18,#ffb347)";
      if(cat==="Entertainment") item.style.background="linear-gradient(135deg,#ff4ecd,#ff6b81)";
      if(cat==="Documentary") item.style.background="linear-gradient(135deg,#4facfe,#00f2fe)";
      item.innerHTML=`<img class="channel-logo" src="${ch.logo}" alt="${ch.name}"><div class="channel-name">${ch.name}</div>`;
      item.addEventListener('click',()=>playChannel(ch));
      container.appendChild(item);
    });
    root.appendChild(container);
  });
}

function playChannel(ch){
  if(hls){try{hls.destroy()}catch(e){}hls=null}
  if(/youtube\.com|youtu\.be/.test(ch.url)){window.open(ch.url,"_blank");return}
  if(Hls.isSupported()){hls=new Hls();hls.attachMedia(video);hls.loadSource(ch.url);hls.on(Hls.Events.MANIFEST_PARSED,()=>video.play())}
  else if(video.canPlayType("application/vnd.apple.mpegurl")){video.src=ch.url;video.addEventListener('loadedmetadata',()=>video.play())}
  relatedDiv.innerHTML="";
  channelsData.filter(c=>c.category===ch.category).forEach(rc=>{
    const item=document.createElement('div');
    item.className='channel';
    if(rc.category==="Sports") item.style.background="linear-gradient(135deg,#00d4ff,#0072ff)";
    if(rc.category==="News") item.style.background="linear-gradient(135deg,#ff7a18,#ffb347)";
    if(rc.category==="Entertainment") item.style.background="linear-gradient(135deg,#ff4ecd,#ff6b81)";
    if(rc.category==="Documentary") item.style.background="linear-gradient(135deg,#4facfe,#00f2fe)";
    item.innerHTML=`<img class="channel-logo" src="${rc.logo}" alt="${rc.name}"><div class="channel-name">${rc.name}</div>`;
    item.addEventListener('click',()=>playChannel(rc));
    relatedDiv.appendChild(item);
  });
  channelsView.style.display="none";
  playerView.style.display="block";
  window.scrollTo({top:0,behavior:'smooth'});
}

backBtn.addEventListener('click',()=>{
  if(hls){try{hls.destroy()}catch(e){}hls=null}
  video.pause();
  video.removeAttribute('src');
  playerView.style.display="none";
  channelsView.style.display="block";
});

searchInput.addEventListener('input',()=>renderChannels());
renderChannels();

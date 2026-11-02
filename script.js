/* E-Card Cutter - browser-only ID crop and front/back merge tool */
const tools = [
  {id:'aadhaar',name:'Aadhaar Cutter',desc:'Quickly crop and print your Aadhaar card with perfect alignment',icon:'आ',symbol:'▣',ratio:1.586,kind:'crop'},
  {id:'ayushman',name:'Ayushman Cutter',desc:'Easily trim and print Ayushman cards in the right size',icon:'✚',symbol:'✚',ratio:1.586,kind:'crop'},
  {id:'pan',name:'PAN Card Cutter',desc:'Crop and resize PAN cards for hassle-free printing',icon:'PAN',symbol:'▤',ratio:1.42,kind:'crop'},
  {id:'voter',name:'Voter Card Cutter',desc:'Quickly crop and format Voter ID cards for print',icon:'☑',symbol:'▣',ratio:1.586,kind:'crop'},
  {id:'merge',name:'Merge ID Front & Back',desc:'Combine front and back sides into one printable image',icon:'⇄',symbol:'⇄',ratio:null,kind:'merge'},
  {id:'ration',name:'Ration Card Cutter',desc:'Easily crop and format Ration cards for print',icon:'▤',symbol:'▤',ratio:1.586,kind:'crop'},
  {id:'abha',name:'ABHA Card Cutter',desc:'Crop and print ABHA health cards with perfect sizing',icon:'♥',symbol:'♥',ratio:1.586,kind:'crop'},
  {id:'eshram',name:'e-Shram Card Cutter',desc:'Crop and print e-Shram cards in one click',icon:'♙',symbol:'♙',ratio:1.586,kind:'crop'},
  {id:'panjab',name:'Punjab Health Card',desc:'Crop and print Punjab Health cards effortlessly',icon:'✚',symbol:'✚',ratio:1.586,kind:'crop'}
];
const $ = id => document.getElementById(id);
const grid=$('toolsGrid'), modal=$('editorModal'), cropImage=$('cropImage'), fileInput=$('fileInput');
let activeTool=null, cropper=null, currentUrl=null, frontImage=null, backImage=null;
$('year').textContent=new Date().getFullYear();

function renderTools(query=''){
  const filtered=tools.filter(t=>(t.name+' '+t.desc).toLowerCase().includes(query.toLowerCase()));
  grid.innerHTML=filtered.map(t=>`<article class="tool-card" data-tool="${t.id}" tabindex="0" role="button" aria-label="Open ${t.name}"><div class="tool-visual"><div class="symbol">${t.symbol}</div></div><h3>${t.name}</h3><p>${t.desc}</p><div class="card-link">OPEN TOOL <span>→</span></div></article>`).join('');
  $('emptyState').hidden=filtered.length>0;
}
renderTools();
$('searchTools').addEventListener('input',e=>renderTools(e.target.value));
grid.addEventListener('click',e=>{const card=e.target.closest('[data-tool]');if(card)openTool(card.dataset.tool)});
grid.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){const card=e.target.closest('[data-tool]');if(card){e.preventDefault();openTool(card.dataset.tool)}}});
function openTool(id){activeTool=tools.find(t=>t.id===id);if(!activeTool)return;
  $('editorTitle').textContent=activeTool.name;
  modal.classList.add('open');modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';
  const isMerge=activeTool.kind==='merge';$('uploadZone').hidden=isMerge;$('cropStage').hidden=true;$('mergeUpload').hidden=!isMerge;
  $('downloadBtn').disabled=true;$('printBtn').disabled=true;$('statusText').textContent='Select an image to begin.';
  $('aspectSelect').value=activeTool.ratio?String(activeTool.ratio):'free';
  $('outputWidth').value=1011;$('outputHeight').value=638;
  destroyCropper();currentUrl=null;frontImage=null;backImage=null;$('mergePreview').innerHTML='';fileInput.value='';$('frontInput').value='';$('backInput').value='';
}
function closeEditor(){modal.classList.remove('open');modal.setAttribute('aria-hidden','true');document.body.style.overflow='';destroyCropper();}
$('closeModal').addEventListener('click',closeEditor);
modal.addEventListener('click',e=>{if(e.target===modal)closeEditor()});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal.classList.contains('open'))closeEditor()});
$('browseBtn').addEventListener('click',()=>fileInput.click());
$('uploadZone').addEventListener('click',e=>{if(e.target.id!=='browseBtn')fileInput.click()});
$('uploadZone').addEventListener('dragover',e=>{e.preventDefault();$('uploadZone').style.background='#e8f4ff'});
$('uploadZone').addEventListener('dragleave',()=>{$('uploadZone').style.background=''});
$('uploadZone').addEventListener('drop',e=>{e.preventDefault();$('uploadZone').style.background='';if(e.dataTransfer.files[0])loadCropFile(e.dataTransfer.files[0])});
fileInput.addEventListener('change',()=>{if(fileInput.files[0])loadCropFile(fileInput.files[0])});
function loadCropFile(file){if(!file.type.startsWith('image/'))return alert('Please select an image file.');if(file.size>20*1024*1024)return alert('Please choose an image smaller than 20 MB.');destroyCropper();if(currentUrl)URL.revokeObjectURL(currentUrl);currentUrl=URL.createObjectURL(file);cropImage.src=currentUrl;$('uploadZone').hidden=true;$('cropStage').hidden=false;$('statusText').textContent='Adjust the crop area, then download or print.';
  cropImage.onload=()=>{ cropper=new Cropper(cropImage,{viewMode:1,dragMode:'move',autoCropArea:.88,background:false,responsive:true,restore:false,checkOrientation:true,zoomOnWheel:true,ready(){applyRatio();$('downloadBtn').disabled=false;$('printBtn').disabled=false;}}); };
}
function destroyCropper(){if(cropper){cropper.destroy();cropper=null}}
function applyRatio(){if(!cropper)return;const val=$('aspectSelect').value;cropper.setAspectRatio(val==='free'?NaN:Number(val))}
$('aspectSelect').addEventListener('change',applyRatio);
$('resetCrop').addEventListener('click',()=>{if(cropper){cropper.reset();applyRatio()}});
$('clearImage').addEventListener('click',()=>{destroyCropper();if(currentUrl)URL.revokeObjectURL(currentUrl);currentUrl=null;cropImage.removeAttribute('src');$('cropStage').hidden=true;$('uploadZone').hidden=activeTool.kind==='merge';$('downloadBtn').disabled=true;$('printBtn').disabled=true;$('statusText').textContent='Image cleared.';fileInput.value='';frontImage=null;backImage=null;$('mergePreview').innerHTML=''});
function getCropCanvas(){if(!cropper)return null;const w=Math.max(100,Math.min(6000,Number($('outputWidth').value)||1011));const h=Math.max(100,Math.min(6000,Number($('outputHeight').value)||638));return cropper.getCroppedCanvas({width:w,height:h,imageSmoothingEnabled:true,imageSmoothingQuality:'high',fillColor:'#fff'})}
$('downloadBtn').addEventListener('click',()=>{let canvas;if(activeTool.kind==='merge')canvas=makeMergedCanvas();else canvas=getCropCanvas();if(!canvas)return;const a=document.createElement('a');a.download=`${activeTool.id}-cropped.png`;a.href=canvas.toDataURL('image/png');a.click();$('statusText').textContent='PNG downloaded successfully.'});
$('printBtn').addEventListener('click',()=>{let canvas=activeTool.kind==='merge'?makeMergedCanvas():getCropCanvas();if(!canvas)return;const data=canvas.toDataURL('image/png');const win=window.open('','_blank');if(!win){alert('Please allow pop-ups to print your card.');return}win.document.write(`<html><head><title>Print ID Card</title><style>body{margin:0;display:flex;justify-content:center;align-items:flex-start;padding:12mm}img{max-width:100%;height:auto}@media print{body{padding:0}}</style></head><body><img src="${data}" onload="window.focus();window.print();"></body></html>`);win.document.close();$('statusText').textContent='Print window opened.'});
// Front/back merge tool
$('frontInput').addEventListener('change',e=>loadMergeSide(e.target.files[0],'front'));
$('backInput').addEventListener('change',e=>loadMergeSide(e.target.files[0],'back'));
function loadMergeSide(file,side){if(!file)return;if(!file.type.startsWith('image/'))return alert('Please select an image file.');const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{if(side==='front')frontImage=img;else backImage=img;renderMergePreview();$('downloadBtn').disabled=!(frontImage&&backImage);$('printBtn').disabled=!(frontImage&&backImage);$('statusText').textContent=frontImage&&backImage?'Both sides ready to merge.':'Upload the other side too.'};img.src=reader.result};reader.readAsDataURL(file)}
function renderMergePreview(){const box=$('mergePreview');box.innerHTML='';[frontImage,backImage].forEach((img,i)=>{if(!img)return;const el=document.createElement('img');el.src=img.src;el.alt=i===0?'Front preview':'Back preview';box.appendChild(el)})}
function makeMergedCanvas(){if(!frontImage||!backImage)return null;const maxW=1400,gap=24,scaleF=Math.min(1,maxW/frontImage.naturalWidth),scaleB=Math.min(1,maxW/backImage.naturalWidth);const w1=Math.round(frontImage.naturalWidth*scaleF),h1=Math.round(frontImage.naturalHeight*scaleF),w2=Math.round(backImage.naturalWidth*scaleB),h2=Math.round(backImage.naturalHeight*scaleB);const canvas=document.createElement('canvas');canvas.width=w1+w2+gap;canvas.height=Math.max(h1,h2);const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(frontImage,0,0,w1,h1);ctx.drawImage(backImage,w1+gap,0,w2,h2);return canvas}

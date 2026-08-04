const pageCount = 28;
const imagePath = n => `assets/pages/page-${String(n).padStart(2, '0')}.jpg`;
const leftPage = document.querySelector('#leftPage');
const rightPage = document.querySelector('#rightPage');
const turnSheet = document.querySelector('#turnSheet');
const pageLabel = document.querySelector('#pageLabel');
const progressBar = document.querySelector('#progressBar');
let spread = 2;
let isAnimating = false;

function pageMarkup(n) {
  if (n > pageCount) return '';
  return `<img src="${imagePath(n)}" alt="VIASEAM magazine page ${n}" loading="lazy">`;
}

function renderSpread() {
  leftPage.innerHTML = pageMarkup(spread);
  rightPage.innerHTML = pageMarkup(spread + 1);
  pageLabel.textContent = `P. ${String(spread).padStart(2,'0')}—${String(Math.min(spread + 1, pageCount)).padStart(2,'0')} / ${pageCount}`;
  progressBar.style.width = `${Math.min(100, ((spread + 1) / pageCount) * 100)}%`;
}

function turn(direction) {
  if (isAnimating) return;
  const next = spread + direction * 2;
  if (next < 2 || next > pageCount) return;
  isAnimating = true;
  turnSheet.classList.remove('is-turning');
  void turnSheet.offsetWidth;
  turnSheet.style.backgroundImage = `url("${imagePath(direction > 0 ? spread + 1 : spread)}")`;
  turnSheet.style.right = direction > 0 ? '0' : '50%';
  turnSheet.style.transformOrigin = direction > 0 ? 'left center' : 'right center';
  turnSheet.classList.add('is-turning');
  setTimeout(() => {
    spread = next;
    renderSpread();
    turnSheet.classList.remove('is-turning');
    isAnimating = false;
  }, 720);
}

function jumpTo(page) {
  const next = Math.max(2, Math.min(pageCount - 1, page % 2 ? page - 1 : page));
  spread = next;
  renderSpread();
  document.querySelector('#magazine').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelector('#nextButton').addEventListener('click', () => turn(1));
document.querySelector('#prevButton').addEventListener('click', () => turn(-1));
document.querySelector('#book').addEventListener('keydown', e => {
  if (e.key === 'ArrowRight') turn(1);
  if (e.key === 'ArrowLeft') turn(-1);
});
document.querySelector('#book').addEventListener('click', e => {
  const rect = e.currentTarget.getBoundingClientRect();
  turn(e.clientX < rect.left + rect.width / 2 ? -1 : 1);
});
let touchStart = 0;
document.querySelector('#book').addEventListener('touchstart', e => { touchStart = e.changedTouches[0].screenX; }, { passive: true });
document.querySelector('#book').addEventListener('touchend', e => {
  const delta = e.changedTouches[0].screenX - touchStart;
  if (Math.abs(delta) > 35) turn(delta < 0 ? 1 : -1);
}, { passive: true });

document.querySelector('#enterButton').addEventListener('click', () => {
  document.querySelector('#magazine').classList.remove('is-hidden');
  document.querySelector('#magazine').scrollIntoView({ behavior: 'smooth' });
  document.querySelector('#book').focus({ preventScroll: true });
});
document.querySelectorAll('[data-jump]').forEach(button => button.addEventListener('click', () => {
  const target = button.dataset.jump;
  if (target === 'campaign') document.querySelector('#campaign').scrollIntoView({ behavior: 'smooth' });
  else document.querySelector('#looks').scrollIntoView({ behavior: 'smooth' });
}));

const looks = [
  { n:'02', page:11, name:'U5 SHIFTING SAND DECK', fabric:'轻薄棉麻、半透明织物', detail:'结构化肩线与流动裙摆，呈现城市渡轮上的轻盈层次。' },
  { n:'04', page:14, name:'BLUE SAIL LIGHT', fabric:'雾蓝轻纱、细针织', detail:'柔和弧线连接上衣与下装，强调风向般的侧面轮廓。' },
  { n:'11', page:17, name:'H2 SUNLIT CORAL', fabric:'柔光面料、细密针织', detail:'珊瑚色结构线作为视觉中心，收束腰部并延展身体比例。' },
  { n:'14', page:20, name:'D FOAM MIST', fabric:'泡泡纱、轻薄棉麻', detail:'单肩放射弧线与短裙结构结合，保留清晰的服装 DNA。' },
  { n:'19', page:23, name:'D2 HARBOR BALANCE', fabric:'哑光蓝织物、流沙色拼接', detail:'平衡直线与柔软褶量，呈现抵岸之后的安静力量。' }
];
const lookGrid = document.querySelector('#lookGrid');
lookGrid.innerHTML = looks.map(look => `<article class="look-card" tabindex="0" data-look="${look.n}">
  <div class="look-image"><img src="${imagePath(look.page)}" alt="LOOK ${look.n}"><span class="look-number">LOOK ${look.n}</span>
    <div class="look-info"><h3>${look.name}</h3><p><b>面料</b> ${look.fabric}</p><p><b>设计细节</b> ${look.detail}</p></div>
  </div>
</article>`).join('');

const colorNames = {'#d8d5c8':'CLOUD DANCER','#9aacc0':'MISTY BLUE','#c8b79d':'SHIFTING SAND','#355b83':'BLUE RIBBON','#c67b70':'CORAL ROSE'};
document.querySelectorAll('.swatch').forEach(swatch => swatch.addEventListener('click', () => {
  document.querySelectorAll('.swatch').forEach(item => item.classList.remove('active'));
  swatch.classList.add('active');
  const color = swatch.dataset.color;
  document.documentElement.style.setProperty('--accent', color);
  document.documentElement.style.setProperty('--accent-wash', `${color}28`);
  document.querySelector('#colorName').textContent = colorNames[color] || 'VIASEAM COLOR';
  document.querySelectorAll('.look-card').forEach(card => card.style.setProperty('--card-color', color));
}));

const campaignData = [
  ['assets/campaign/campaign-01-boarding.png','登船 / BEFORE DEPARTURE','清晨码头，两个方向在同一条路线短暂相遇。'],
  ['assets/campaign/campaign-02-same-gate.png','同一扇门 / THE SAME GATE','玻璃连廊与服装线条呼应，风从两个人之间经过。'],
  ['assets/campaign/campaign-03-boarding.png','同行 / BOARDING','衣摆、侧风与水面一起移动，形成共享的十八分钟。'],
  ['assets/campaign/campaign-04-meeting-seam.png','会合缝 / MEETING SEAM','手扶栏杆、包袋与接缝细节，把品牌语言拉近。'],
  ['assets/campaign/campaign-05-arrival.png','抵达 / ARRIVAL','城市岸线逐渐清晰，路线把两个人带向同一处终点。'],
  ['assets/campaign/campaign-06-different-exits.png','分开 / DIFFERENT EXITS','抵岸之后各自走向不同出口，只留下短暂交汇的水纹。']
];
document.querySelector('#campaignStory').innerHTML = campaignData.map((item, index) => `<figure class="campaign-frame" data-step="${index}">
  <img src="${item[0]}" alt="${item[1]}" loading="lazy"><figcaption class="campaign-caption"><strong>${item[1]}</strong><span>${item[2]}</span></figcaption>
</figure>`).join('');
const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) entry.target.classList.add('is-visible'); }), { threshold: .18 });
document.querySelectorAll('.campaign-frame').forEach(frame => observer.observe(frame));

renderSpread();

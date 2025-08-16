const OPTIONS = [
  "Skatebord",
  "Gå i seng",
  "Se fjernsyn",
  "Symaskine",
  "Læse bog",
  "Tegne",
];

const size = 280;
const slices = OPTIONS.length;
const sliceAngle = 360 / slices;

const wheelSvg = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const thinkingEl = document.getElementById('thinking');
const resultEl = document.getElementById('result');
const resultText = document.getElementById('resultText');
const historyWrap = document.getElementById('historyWrap');
const historyGrid = document.getElementById('history');
document.getElementById('year').textContent = new Date().getFullYear();

(function buildWheel(){
  const r = size/2;
  const g = document.createElementNS('http://www.w3.org/2000/svg','g');
  g.setAttribute('transform', `translate(${r},${r})`);
  OPTIONS.forEach((label, i) => {
    const start = (i * sliceAngle) * Math.PI/180;
    const end = ((i+1) * sliceAngle) * Math.PI/180;
    const x1 = Math.cos(start) * r;
    const y1 = Math.sin(start) * r;
    const x2 = Math.cos(end) * r;
    const y2 = Math.sin(end) * r;
    const largeArc = sliceAngle > 180 ? 1 : 0;
    const fill = i % 2 === 0 ? '#ffe4e6' : '#fecdd3';
    const path = document.createElementNS('http://www.w3.org/2000/svg','path');
    path.setAttribute('d', `M0 0 L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`);
    path.setAttribute('fill', fill);
    path.setAttribute('stroke', '#fda4af');
    g.appendChild(path);

    const tx = (Math.cos((start+end)/2) * r * 0.65).toFixed(2);
    const ty = (Math.sin((start+end)/2) * r * 0.65).toFixed(2);
    const text = document.createElementNS('http://www.w3.org/2000/svg','text');
    text.setAttribute('x', tx);
    text.setAttribute('y', ty);
    text.setAttribute('text-anchor','middle');
    text.setAttribute('dominant-baseline','middle');
    text.setAttribute('font-size','13');
    text.setAttribute('fill','#831843');
    text.textContent = label;
    g.appendChild(text);
  });

  const center = document.createElementNS('http://www.w3.org/2000/svg','circle');
  center.setAttribute('r','32');
  center.setAttribute('fill','#db2777');
  g.appendChild(center);
  const t1 = document.createElementNS('http://www.w3.org/2000/svg','text');
  t1.setAttribute('x','0'); t1.setAttribute('y','-2');
  t1.setAttribute('text-anchor','middle'); t1.setAttribute('font-size','12');
  t1.setAttribute('fill','#fff'); t1.textContent='LYDA';
  g.appendChild(t1);
  const t2 = document.createElementNS('http://www.w3.org/2000/svg','text');
  t2.setAttribute('x','0'); t2.setAttribute('y','12');
  t2.setAttribute('text-anchor','middle'); t2.setAttribute('font-size','10');
  t2.setAttribute('fill','#fff'); t2.textContent='HJULET';
  g.appendChild(t2);

  wheelSvg.appendChild(g);
})();

let spinning = false;
let history = [];

function rand(n){ return Math.floor(Math.random()*n); }

spinBtn.addEventListener('click', async () => {
  if (spinning) return;
  spinning = true;
  resultEl.classList.add('hidden');
  thinkingEl.classList.remove('hidden');

  const winnerIndex = rand(slices);
  const fullTurns = 4 + rand(3);
  const target = fullTurns * 360 + (360 - (winnerIndex * sliceAngle + sliceAngle/2));

  wheelSvg.style.transform = `rotate(${target}deg)`;

  const onEnd = () => {
    wheelSvg.removeEventListener('transitionend', onEnd);
    setTimeout(() => {
      const choice = OPTIONS[winnerIndex];
      resultText.textContent = choice;
      resultEl.classList.remove('hidden');
      thinkingEl.classList.add('hidden');
      history.unshift(choice);
      history = history.slice(0,6);
      renderHistory();
      if (window.confetti) {
        window.confetti({ particleCount: 90, spread: 60, origin: { y: 0.7 } });
      }
      spinning = false;
      wheelSvg.style.transition = 'none';
      const current = target % 360;
      wheelSvg.style.transform = `rotate(${current}deg)`;
      requestAnimationFrame(() => {
        wheelSvg.style.transition = 'transform 3.2s cubic-bezier(.22,1,.36,1)';
      });
    }, 700);
  };
  wheelSvg.addEventListener('transitionend', onEnd, { once:true });
});

function renderHistory(){
  historyWrap.classList.toggle('hidden', history.length === 0);
  historyGrid.innerHTML = history.map(h => `<div class="pill">${h}</div>`).join('');
}

const MONTHS = ['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'];
const MONTH_LABEL = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const items = window.MILESTONES.split('\n').map(l => l.trim()).filter(Boolean).map((line, i) => {
  const cut = line.indexOf(' - ');
  const dateStr = line.slice(0, cut);
  const title = line.slice(cut + 3);
  const m = dateStr.match(/^(\w+)\s+(\d+)\w*\s+(\d{4})/);
  const month = MONTHS.indexOf(m[1].slice(0, 3).toLowerCase());
  return { i, title, day: +m[2], month, year: +m[3], time: new Date(+m[3], month, +m[2]).getTime() };
}).sort((a, b) => a.time - b.time || a.i - b.i);

const root = document.getElementById('timeline');
const btn = document.getElementById('order');
document.getElementById('count').textContent = items.length;
let newestFirst = true;

function render() {
  const list = newestFirst ? [...items].reverse() : items;
  root.innerHTML = '';
  let section = null, year = null;
  list.forEach(it => {
    if (it.year !== year) {
      year = it.year;
      section = document.createElement('section');
      section.className = 'year';
      section.innerHTML = `<h2>${year}</h2><ol></ol>`;
      root.appendChild(section);
    }
    const li = document.createElement('li');
    li.innerHTML = `<time datetime="${it.year}-${String(it.month + 1).padStart(2, '0')}-${String(it.day).padStart(2, '0')}">${it.day} ${MONTH_LABEL[it.month]}</time><p></p>`;
    li.querySelector('p').textContent = it.title;
    section.querySelector('ol').appendChild(li);
  });
}

btn.addEventListener('click', () => {
  newestFirst = !newestFirst;
  btn.textContent = newestFirst ? 'Newest first' : 'Oldest first';
  btn.setAttribute('aria-pressed', newestFirst);
  render();
  window.scrollTo({ top: 0 });
});
render();

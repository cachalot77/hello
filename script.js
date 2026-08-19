const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const commitList = document.getElementById('commit-list');

function setMenu(open) {
  if (!menuToggle || !siteNav) return;
  menuToggle.setAttribute('aria-expanded', String(open));
  siteNav.dataset.open = open ? 'true' : 'false';
}

if (menuToggle && siteNav) {
  setMenu(false);

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      if (window.matchMedia('(max-width: 720px)').matches) {
        setMenu(false);
      }
    });
  });
}

function formatCommitRow(commit) {
  const timestamp = commit?.timestamp || commit?.date || commit?.commit?.committer?.date || commit?.commit?.author?.date;

  if (!timestamp) {
    return null;
  }

  const updatedAt = new Date(timestamp);
  if (Number.isNaN(updatedAt.getTime())) {
    return null;
  }

  const pad = (value) => String(value).padStart(2, '0');
  const time = `${pad(updatedAt.getHours())}:${pad(updatedAt.getMinutes())}:${pad(updatedAt.getSeconds())}`;
  const date = `${updatedAt.getFullYear()}/${pad(updatedAt.getMonth() + 1)}/${pad(updatedAt.getDate())}`;

  return `<li><span class="commit-time">${time}</span><span class="commit-date">${date}</span></li>`;
}

function renderCommitFallback(message) {
  if (!commitList) return;
  commitList.innerHTML = `<li><span class="commit-time">--:--:--</span><span class="commit-date">${message}</span></li>`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed with ${response.status}`);
  }

  return response.json();
}

async function loadLastUpdateTimes() {
  if (!commitList) return;

  try {
    const data = await fetchJson('./updates.json');
    const updates = Array.isArray(data) ? data : data?.updates;
    const rows = Array.isArray(updates)
      ? updates.map(formatCommitRow).filter(Boolean).slice(0, 5)
      : [];

    if (rows.length === 0) {
      renderCommitFallback('No recent updates');
      return;
    }

    commitList.innerHTML = rows.join('');
  } catch (error) {
    console.log('Last update history not available', error);
    renderCommitFallback('Update data unavailable');
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadLastUpdateTimes);
} else {
  loadLastUpdateTimes();
}

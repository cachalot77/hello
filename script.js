const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const githubOwner = document.body?.dataset.githubOwner || 'cachalot77';
const githubRepo = document.body?.dataset.githubRepo || 'chung.pin.hsu';
const githubBranch = document.body?.dataset.githubBranch || 'main';

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

function formatUpdateRow(entry) {
  const timestamp = entry?.commit?.committer?.date || entry?.commit?.author?.date;

  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `<li><span class="commit-time">${hours}:${minutes}</span><span class="commit-date">${year}-${month}-${day}</span></li>`;
}

function renderFallbackMessage(message) {
  const commitList = document.getElementById('commit-list');
  if (commitList) {
    commitList.innerHTML = `<li><span class="commit-time">--:--</span><span class="commit-date">${message}</span></li>`;
  }
}

// Load the latest 5 update rows from GitHub Pages-friendly GitHub API
async function loadCommitHistory() {
  try {
    const apiUrl = `https://api.github.com/repos/${githubOwner}/${githubRepo}/commits?sha=${encodeURIComponent(githubBranch)}&per_page=5`;
    const response = await fetch(apiUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API request failed: ${response.status}`);
    }

    const data = await response.json();
    const commitList = document.getElementById('commit-list');

    if (commitList && Array.isArray(data) && data.length > 0) {
      const rows = data
        .slice(0, 5)
        .map(formatUpdateRow)
        .filter(Boolean);

      if (rows.length > 0) {
        commitList.innerHTML = rows.join('');
        return;
      }
    }

    renderFallbackMessage('No recent commits found');
  } catch (error) {
    console.log('Commit history not available', error);
    renderFallbackMessage('GitHub API unavailable');
  }
}

// Load commits when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCommitHistory);
} else {
  loadCommitHistory();
}

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');

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
  const date = entry?.date || 'Unknown date';
  const time = entry?.time || '00:00';
  return `<li><span class="commit-time">${time}</span><span class="commit-date">${date}</span></li>`;
}

// Load last 5 update rows
async function loadCommitHistory() {
  try {
    const response = await fetch('./commits.json');
    const data = await response.json();
    const commitList = document.getElementById('commit-list');
    
    if (commitList && data.commits && data.commits.length > 0) {
      commitList.innerHTML = data.commits
        .slice(0, 5)
        .map(formatUpdateRow)
        .join('');
    }
  } catch (error) {
    console.log('Commit history not available');
    // Silently fail if commits.json doesn't exist
    const commitList = document.getElementById('commit-list');
    if (commitList) {
      commitList.innerHTML = '<li><span class="commit-time">--:--</span><span class="commit-date">Commit history not available</span></li>';
    }
  }
}

// Load commits when page loads
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadCommitHistory);
} else {
  loadCommitHistory();
}


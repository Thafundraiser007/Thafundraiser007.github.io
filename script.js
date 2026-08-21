// Footer year
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Typing effect for the hero name — respects prefers-reduced-motion
const nameEl = document.getElementById('typed-name');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (nameEl) {
  const fullText = nameEl.textContent.trim();
  if (!prefersReducedMotion && fullText.length > 0) {
    nameEl.textContent = '';
    let i = 0;
    const type = () => {
      nameEl.textContent = fullText.slice(0, i);
      i++;
      if (i <= fullText.length) {
        setTimeout(type, 90);
      } else {
        nameEl.style.borderRight = '2px solid transparent';
      }
    };
    type();
  }
}

// ============================================================
// DYNAMIC GITHUB PORTFOLIO PROJECTS
// ============================================================

const githubProjectsEl = document.getElementById('github-projects');

if (githubProjectsEl) {
  loadGithubProjects();
}

async function loadGithubProjects() {
  const username = 'Thafundraiser007';

  const featuredRepos = new Set([
    'ShikaNet-Python-Network-Automation-Platform',
    'Power-Outage-Tracker',
    'Enterprise-Multi-Site-BGP-WAN-Design',
    'Enterprise-VLAN-Segmentation-VoIP-Network-Design-Lab-Cisco-Packet-Tracer-'
  ]);

  try {
    const response = await fetch(
      `https://api.github.com/users/${username}/repos?per_page=100&sort=updated`
    );

    if (!response.ok) {
      throw new Error(`GitHub API returned ${response.status}`);
    }

    const repos = await response.json();

    const portfolioRepos = repos.filter(repo => {
      const topics = repo.topics || [];

      return (
        topics.includes('portfolio') &&
        !repo.fork &&
        !repo.archived &&
        repo.name !== `${username}.github.io` &&
        !featuredRepos.has(repo.name)
      );
    });

    githubProjectsEl.innerHTML = '';

    if (portfolioRepos.length === 0) {
      githubProjectsEl.innerHTML = `
        <p class="lede">
          No additional portfolio projects are currently published.
        </p>
      `;
      return;
    }

    portfolioRepos.forEach(repo => {
      const card = document.createElement('article');
      card.className = 'project-card';

      const topics = (repo.topics || [])
        .filter(topic => topic !== 'portfolio');

      const tag =
        topics[0] ||
        repo.language ||
        'project';

      const technologies = [];

      if (repo.language) {
        technologies.push(repo.language);
      }

      topics.slice(0, 3).forEach(topic => {
        const formatted = formatTopic(topic);

        if (!technologies.includes(formatted)) {
          technologies.push(formatted);
        }
      });

      const projectName = repo.name.replace(/-/g, ' ');

      const description =
        repo.description ||
        'Technical project documented and maintained on GitHub.';

      card.innerHTML = `
        <div class="project-head">
          <h3>${escapeHtml(projectName)}</h3>
          <span class="tag">${escapeHtml(formatTopic(tag))}</span>
        </div>

        <p>${escapeHtml(description)}</p>

        <div class="project-meta">
          <span>${escapeHtml(
            technologies.length
              ? technologies.join(' · ')
              : 'GitHub Project'
          )}</span>

          <a
            href="${repo.html_url}"
            target="_blank"
            rel="noopener"
          >
            view on GitHub →
          </a>
        </div>
      `;

      githubProjectsEl.appendChild(card);
    });

  } catch (error) {
    console.error('Unable to load GitHub projects:', error);

    githubProjectsEl.innerHTML = `
      <p class="lede">
        Unable to load GitHub projects right now.
      </p>
    `;
  }
}

function formatTopic(topic) {
  return String(topic)
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, char => char.toUpperCase());
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

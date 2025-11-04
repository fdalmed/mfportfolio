let lang = 'fr'; // default language

async function loadJSON(file) {
  try {
    const response = await fetch(file);
    if (!response.ok) throw new Error(`Failed to load ${file}`);
    return await response.json();
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function renderResume() {
  const personal = await loadJSON('json/personal.json');
  const skills = await loadJSON('json/skills.json');
  const education = await loadJSON('json/education.json');
  const languages = await loadJSON('json/languages.json');
  const experience = await loadJSON('json/experience.json');

  if (!personal || !skills || !education || !languages || !experience) {
    console.error('One or more JSON files failed to load.');
    return;
  }

  // Header
  document.getElementById('name').textContent = personal.personal.name[lang] || '';
  document.getElementById('role').textContent = personal.personal.role[lang] || '';

    // Skills
    const skillsList = document.getElementById('skills-list');
    if (skills.domains && skills.domains.length > 0) {
    skills.domains.forEach(domain => {
        const domainTitle = document.createElement('p');
        domainTitle.classList.add('font-semibold', 'mt-4');
        domainTitle.textContent = domain.title;
        skillsList.appendChild(domainTitle);

        const ul = document.createElement('ul');
        ul.classList.add('list-disc', 'list-inside', 'ml-4', 'mt-1');

        domain.items.forEach(skill => {
        const li = document.createElement('li');
        li.textContent = skill;
        ul.appendChild(li);
        });

        skillsList.appendChild(ul);
    });
    }



//   if (skillsList && skills.technical[lang]) {
//     skillsList.innerHTML = '';
//     skills.technical[lang].forEach(skill => {
//       const li = document.createElement('li');
//       li.textContent = skill;
//       skillsList.appendChild(li);
//     });
//   }

  // Education
  const eduList = document.getElementById('education-list');
  if (eduList) {
    eduList.innerHTML = '';
    education.forEach(edu => {
      const li = document.createElement('li');
      li.textContent = `${edu.degree[lang]} - ${edu.institution} (${edu.year})`;
      eduList.appendChild(li);
    });
  }

  // Languages
  const langList = document.getElementById('languages-list');
  if (langList) {
    langList.innerHTML = '';
    languages.forEach(l => {
      const li = document.createElement('li');
      li.textContent = `${l.language} - ${l.level[lang]}`;
      langList.appendChild(li);
    });
  }

  // Experience
  const expList = document.getElementById('experience-list');
  if (expList) {
    expList.innerHTML = '';
    experience.forEach(exp => {
      const div = document.createElement('div');
      div.classList.add('mb-6');

      // Company, Role, Context & Project
      div.innerHTML = `
        <h3 class="text-xl font-bold">${exp.company} (${exp.duration})</h3>
        ${exp.role && exp.role[lang] ? `<p class="italic">${exp.role[lang]}</p>` : ''}
        ${exp.context ? `<p class="mt-1">${exp.context}</p>` : ''}
        ${exp.project ? `<p class="mt-1 font-semibold">Projet : ${exp.project}</p>` : ''}
      `;

    // Responsibilities
    if (exp.responsibilities && exp.responsibilities.length > 0) {
    const ulResp = document.createElement('ul');
    ulResp.classList.add('list-disc', 'list-inside', 'ml-4', 'mt-2');
    exp.responsibilities.forEach(task => {
        const li = document.createElement('li');
        li.textContent = task;
        ulResp.appendChild(li);
    });
    div.appendChild(document.createElement('hr')); // optional separator
    div.appendChild(ulResp);
    }

    // Results
    if (exp.results && exp.results.length > 0) {
    const ulRes = document.createElement('ul');
    ulRes.classList.add('list-disc', 'list-inside', 'ml-4', 'mt-2', 'text-green-600');
    exp.results.forEach(result => {
        const li = document.createElement('li');
        li.textContent = result;
        ulRes.appendChild(li);
    });
    const resultsTitle = document.createElement('p');
    resultsTitle.classList.add('font-semibold', 'mt-4');
    resultsTitle.textContent = 'Résultats obtenus :';
    div.appendChild(resultsTitle);
    div.appendChild(ulRes);
    }

      // Tech Stack
      if (exp.techStack && exp.techStack.length > 0) {
        const pTech = document.createElement('p');
        pTech.classList.add('mt-2', 'font-semibold');
        pTech.textContent = `Environnement technique : ${exp.techStack.join(', ')}`;
        div.appendChild(pTech);
      }

      expList.appendChild(div);
    });
  }
}

document.addEventListener('DOMContentLoaded', renderResume);

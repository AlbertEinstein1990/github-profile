const userQuery =
        `
        {
            viewer 
            {
                avatarUrl(size: 300)
                name
                login
                bio
                repositories(first: 20)
                {
                    nodes 
                    {
                        name
                        description
                        primaryLanguage 
                        {
                            color
                            name
                        }
                        stargazerCount
                        updatedAt
                    }
                }
            }
        }
        `;

const feather = require('feather-icons')

let getUserProfile = async () =>
{
    let response = await fetch(process.env.API_URL, { method: 'POST', body: JSON.stringify({ query: userQuery }), headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, Accept: 'application/json' } }),
        json = await response.json();

    let repoList = document.querySelector('.repo-list'),
        profilePicture = document.querySelector('.profile-picture'),
        name = document.querySelector('.name'),
        username = document.querySelector('.username'),
        bio = document.querySelector('.bio'),
        repositories = [...json.data.viewer.repositories.nodes];

    profilePicture.style.backgroundImage = `url(${json.data.viewer.avatarUrl})`;
    name.innerHTML = json.data.viewer.name;
    username.innerHTML = json.data.viewer.login;
    bio.innerHTML = json.data.viewer.bio;

    repositories.forEach(repo => 
        {
            repoList.innerHTML += 
            `<li class="repo-list__item">
                <div class="repo-icon-background">
                    ${feather.icons['git-merge'].toSvg({ class: "icon repo-icon" })}
                </div>
                <span class="repo-name">${repo.name}</span>
                ${(repo.description) ? `<p class="repo-description">${(repo.description.length > 53) ? repo.description.slice(0, 48) + '...' : repo.description}</p>` : `<p class="repo-description repo-description--none">Description is not available</p>`}
                ${(repo.primaryLanguage) ? `<span class="language" style="background: ${repo.primaryLanguage.color}">${repo.primaryLanguage.name}</span>` : `<span class="language language--none">Language is not available</span>`}
                <div class="star-count-info">
                    ${feather.icons['star'].toSvg({ class: "icon star-icon" })}
                    <span class="star-count">${repo.stargazerCount}</span>
                </div
            </li>`;
        });
}

getUserProfile();


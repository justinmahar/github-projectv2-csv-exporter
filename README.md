<h2 align="center">
  📂 GitHub Project CSV Exporter (ProjectV2)
</h2>
<h3 align="center">
  Export an organization's GitHub projects as CSV files. Uses ProjectV2 API.
</h3>
<p align="center">
  <a href="https://badge.fury.io/js/github-projectv2-csv-exporter" target="_blank" rel="noopener noreferrer">
    <img src="https://badge.fury.io/js/github-projectv2-csv-exporter.svg" alt="npm Version" />
  </a>
  <a href="https://github.com/justinmahar/github-projectv2-csv-exporter/" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/badge/GitHub-Source-success" alt="View project on GitHub" />
  </a>
  <a href="https://github.com/justinmahar/github-projectv2-csv-exporter/actions?query=workflow%3ADeploy" target="_blank" rel="noopener noreferrer">
    <img src="https://github.com/justinmahar/github-projectv2-csv-exporter/workflows/Deploy/badge.svg" alt="Deploy Status" />
  </a>
</p>

## Documentation

Read the **[official documentation](https://justinmahar.github.io/github-projectv2-csv-exporter/)**.

## Donate 

This project is the result of countless hours of work and I really hope it saves you hours of your own precious time.

If you would like to join others in showing support for the development of this project, then please feel free to buy me a coffee.

<a href="https://paypal.me/thejustinmahar/5">
  <img src="https://justinmahar.github.io/github-projectv2-csv-exporter/support/coffee-1.png" alt="Buy me a coffee" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/15">
  <img src="https://justinmahar.github.io/github-projectv2-csv-exporter/support/coffee-3.png" alt="Buy me 3 coffees" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/25">
  <img src="https://justinmahar.github.io/github-projectv2-csv-exporter/support/coffee-5.png" alt="Buy me 5 coffees" height="35" />
</a>

## Overview

This export tool allows you to export GitHub projects (that use the [ProjectV2 API](https://github.blog/changelog/2022-06-23-the-new-github-issues-june-23rd-update/)) as a CSV.

For exporting "classic" GitHub projects (older implementation), you can try using [this exporter by Stephen Wu](https://github.com/wustep/github-project-exporter).

### Features include:

- **⬇️ Export all GitHub project cards as a CSV.**
  - View your GitHub cards in your spreadsheet software of choice.
- **🎛️ Filter issues by column and open/closed state.**
  - Only export cards in the columns you specify.
- **🚀 Easy to use**
  - Features a simple and easy to use web UI. Configure once. Click once.

## Installation

```
npm i github-projectv2-csv-exporter
```

## Usage

### Via Website

Go here: **[GitHub Project Exporter](https://justinmahar.github.io/github-projectv2-csv-exporter/?path=/story/tools-github-project-exporter--exporter)**.

### Via `npm`

If you want to fetch the data yourself, you can install this package via npm and use the exported fetch functions.

> Note: Your access token must include the following scopes: `repo`, `read:org`, `read:user`, `read:project`

#### fetchOrgProjects

```ts
fetchOrgProjects = async (orgName: string, token: string): Promise<OrgProjects>
```

Provide an org name and the token. The promise will be resolved with an `OrgProjects` instance.

##### Example

```ts
import { fetchOrgProjects } from 'github-projectv2-csv-exporter';
// ...
fetchOrgProjects('my-org', 'abc123mytoken').then((orgProjects) =>
  console.log(
    'Loaded projects:',
    orgProjects
      .getProjects()
      .map((p) => p.getTitle() + ` (${p.getTotalItemCount()})`)
      .join(', '),
  ),
);
```

#### fetchProjectItems

```ts
fetchProjectItems = async (orgName: string, projectNumber: number, token: string, progress?: (loaded: number, total: number) => void): Promise<ProjectItem[]>
```

Provide an org name, project number, and token. Optionally, you can provide a `progress` function that will be called periodically with the number of items loaded, and the total expected.

The promise will be resolved with an array of `ProjectItem` instances.

##### Example

```ts
import { fetchProjectItems } from 'github-projectv2-csv-exporter';
// ...
const projectNumber = loadedProject.getProjectNumber();
fetchProjectItems('my-org', projectNumber, 'abc123mytoken', (loaded, total) =>
  console.log(`Progress: ${Math.round((loaded / total) * 100)}%`),
).then((items) => console.log('Loaded', items.length, 'items'));
```

## Icon Attribution

Icon by [Twemoji](https://github.com/twitter/twemoji).

## Contributing

Open source software is awesome and so are you. 😎

Feel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.

For major changes, open an issue first to discuss what you'd like to change.

## ⭐ Found It Helpful? [Star It!](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers)

If you found this project helpful, let the community know by giving it a [star](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers): [👉⭐](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers)

## License

See [LICENSE.md](https://justinmahar.github.io/github-projectv2-csv-exporter/?path=/story/license--page).
<h2 align="center">
  📂 GitHub Project CSV Exporter (ProjectV2)
</h2>
<h3 align="center">
  Export GitHub project cards as CSV files. Uses the ProjectV2 API.
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
  <a href="https://github.com/sponsors/justinmahar" target="_blank" rel="noopener noreferrer">
    <img src="https://img.shields.io/static/v1?label=Sponsor&message=%E2%9D%A4&logo=GitHub&color=%23fe8e86" alt="Sponsor"/>
  </a>
</p>

## **[→ Open The GitHub Project Exporter ←](https://justinmahar.github.io/github-projectv2-csv-exporter/?path=/story/tools-github-project-exporter--exporter)**

## Documentation

Read the **[official documentation](https://justinmahar.github.io/github-projectv2-csv-exporter/)**.

## Overview

This export tool allows you to export GitHub projects as a CSV. 

Projects must exist within the [ProjectV2 API](https://github.blog/changelog/2022-06-23-the-new-github-issues-june-23rd-update/). For exporting "classic" GitHub projects (older implementation), you can try using [this exporter by Stephen Wu](https://github.com/wustep/github-project-exporter).

### Features include:

- **⬇️ Export all GitHub project cards as a CSV.**
  - View your GitHub cards in your spreadsheet software of choice.
- **🎛️ Filter issues by status, customize fields, and exclude closed issues.**
  - Only export cards with the statuses you specify, with options to choose custom fields, or hide closed issues.
- **🚀 Easy to use**
  - Features a simple and easy to use web UI. Configure once. Click once to export.

[lock:donate]::🚫---------------------------------------

## Donate 

I hope this project makes your life a little easier! If it does and you'd like to show your appreciation, consider supporting the project with a coffee or sponsorship. 

Your support helps keep the project going and will earn you some serious virtual high fives. Maybe even a virtual fist bump if you're feeling extra cool.

<a href="https://github.com/sponsors/justinmahar">
  <img src="https://justinmahar.github.io/react-kindling/support/sponsor.png" alt="Sponsor via GitHub" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/5">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-1.png" alt="Buy me a coffee" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/15">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-3.png" alt="Buy me 3 coffees" height="35" />
</a> <a href="https://paypal.me/thejustinmahar/25">
  <img src="https://justinmahar.github.io/react-kindling/support/coffee-5.png" alt="Buy me 5 coffees" height="35" />
</a>

[/lock:donate]::---------------------------------------🚫

## Table of Contents

- [**→ Open The GitHub Project Exporter ←**](#-open-the-github-project-exporter-)
- [Documentation](#documentation)
- [Overview](#overview)
  - [Features include:](#features-include)
- [Donate](#donate)
- [Table of Contents](#table-of-contents)
- [Installation](#installation)
- [Usage](#usage)
  - [Via Website](#via-website)
  - [Via `npm`](#via-npm)
    - [fetchProjects](#fetchprojects)
      - [Example](#example)
    - [fetchProjectItems](#fetchprojectitems)
      - [Example](#example-1)
- [TypeScript](#typescript)
- [Icon Attribution](#icon-attribution)
- [Contributing](#contributing)
- [⭐ Found It Helpful? Star It!](#-found-it-helpful-star-it)
- [License](#license)

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

#### fetchProjects

```ts
fetchProjects = async (login: string, isOrg: boolean, token: string): Promise<Projects>
```

Provide an org or username and the token. The promise will be resolved with a `Projects` instance.

##### Example

```ts
import { fetchProjects } from 'github-projectv2-csv-exporter';
// ...
fetchProjects('my-org', true, 'abc123mytoken').then((orgProjects) =>
  console.log(
    'Loaded projects:',
    orgProjects
      .getProjects()
      .map((p) => `${p.getTitle()} (number ${p.getProjectNumber()} | ${p.getTotalItemCount()} items)`)
      .join(', '),
  ),
);
```

#### fetchProjectItems

```ts
fetchProjectItems = async (login: string, isOrg: boolean, projectNumber: number, token: string, progress?: (loaded: number, total: number) => void): Promise<ProjectItem[]>
```

Provide an org or username, project number, and token. Optionally, you can provide a `progress` function that will be called periodically with the number of items loaded, and the total expected.

The promise will be resolved with an array of `ProjectItem` instances.

##### Example

```ts
import { fetchProjectItems } from 'github-projectv2-csv-exporter';
// ...
const projectNumber = loadedProject.getProjectNumber();
fetchProjectItems('my-org', true, projectNumber, 'abc123mytoken', (loaded, total) =>
  console.log(`Progress: ${Math.round((loaded / total) * 100)}%`),
).then((items) => console.log('Loaded', items.length, 'items'));
```

[lock:typescript]::🚫---------------------------------------

## TypeScript

Type definitions have been included for [TypeScript](https://www.typescriptlang.org/) support.

[/lock:typescript]::---------------------------------------🚫

[lock:icon]::🚫---------------------------------------

## Icon Attribution

Favicon by [Twemoji](https://github.com/twitter/twemoji).

[/lock:icon]::---------------------------------------🚫

[lock:contributing]::🚫---------------------------------------

## Contributing

Open source software is awesome and so are you. 😎

Feel free to submit a pull request for bugs or additions, and make sure to update tests as appropriate. If you find a mistake in the docs, send a PR! Even the smallest changes help.

For major changes, open an issue first to discuss what you'd like to change.

[/lock:contributing]::---------------------------------------🚫

## ⭐ Found It Helpful? [Star It!](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers)

If you found this project helpful, let the community know by giving it a [star](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers): [👉⭐](https://github.com/justinmahar/github-projectv2-csv-exporter/stargazers)

## License

See [LICENSE.md](https://justinmahar.github.io/github-projectv2-csv-exporter/?path=/story/license--page).
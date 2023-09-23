
# About portfolYOU Template Usage<small class="text-muted"></small>

[![GitHub stars](https://img.shields.io/github/stars/n7729697/n7729697.github.io.svg?style=social)](https://github.com/n7729697/n7729697.github.io/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/n7729697/n7729697.github.io.svg?style=social)](https://github.com/n7729697/n7729697.github.io/network/members)
[![GitHub downloads](https://img.shields.io/github/downloads/n7729697/n7729697.github.io/total.svg)](https://github.com/n7729697/n7729697.github.io/releases)

# Table of Contents
- [Features](##Features)
- [Installation](##Installation)
- [Customization](##Customization)
- [Adding Content](##AddingContent)

 
## Features

- Works 100% with **GitHub Pages** as a remote theme.
- Minimal design and animations.
- **Responsive** design using [Bootstrap][bootstrap].
- Support [Repository metadata][repo-meta], [FontAwesome][font-awesome], [GitHub Buttons][gh-btns] and many [more](#dependencies).
- Support **all image orientations** _(landscape, portrait or square)_ as a landing image.
- **Automatic** importing for **GitHub Repositories** as Projects.
- **Search** posts by title, tags or descriptions.
- **Tags archive** for posts.
- Disqus support for blog posts.
- Skills progress bars and education/experience timeline.
- Support large number of **social networks**.
- Quick including for various [elements][elements] as videos, lists, figures, buttons and many more.
- Attractive [404 page](https://n7729697.github.io/404.html).
- Well Documented.

[repo-meta]: https://help.github.com/en/articles/repository-metadata-on-github-pages
[elements]: {{ site.github.repository_url }}/tree/master/_includes/elements

## Installation

The following steps demonstrate how to use portfolYOU as **GitHub Pages remote theme**.

1. [Download][download] portfolYOU as .zip from official [repo][repo] then extract it.
1. Rename **`portfolYOU-master/`** to **`<your-username>.github.io/`**
1. Remove everything **except** the **`docs/`** directory.
1. Lift up the **`docs/`** directory's content to the root directory _(i.e move them to **`<your-username>.github.io/`**)_.
1. Remove **documentation** stuff:
    - **`_elements/`**
    - **`documentation/`**
    - **`_config.yml`** : any line commented as `# For Documentation Only`

1. Your directory structure should be:

    ```tree
    <your-username>.github.io/
    ├── _data/
    ├── _posts/
    ├── _projects/
    ├── pages/
    ├── _config.yml
    ├── .gitignore
    └── Gemfile
    ```

1. Update **`_config.yml`** with your data _(follow the comments for more help)_.
1. Update your site content (posts, projects and about page).
1. Finally, test portfolYOU [locally][locally] then [publish][publish] it to [GitHub Pages][gh-pages].
1. _[Optional]_ To use a specific [version][versions] of portfolYOU _(defaults to latest version)_:

    ```yml
    remote_theme: YoussefRaafatNasry/portfolYOU@v1.0.0
    ```

[repo]: {{ site.github.repository_url }}
[download]: {{ site.github.zip_url }}
[versions]: {{ site.github.releases_url }}
[locally]: https://help.github.com/articles/setting-up-your-github-pages-site-locally-with-jekyll/
[publish]: https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/
[gh-pages]: https://pages.github.com/

## Customization

Simply **override** the file you want to change by matching the **same file name and path**.  

**Example 1:** New Favicon

1. Generate your own using [favicon](https://favicon.io/) or any other tool.
1. Copy your new `favicon.ico` file into your own project with the same file path **`assets/favicon.ico`**.

**Example 2:** Custom Style

1. Create **`assets/css/style.scss`**.
1. Add the following lines:

    ```css
    ---
    ---
    /* Add your custom style here */
    @import "portfolYOU";
    ```
## Adding Content
#### Local Projects

1. Add `project-name.md` or `project-name.html` to `_projects/`.
1. Add [front matter](https://jekyllrb.com/docs/front-matter/) to the top of your new project file.

    ```yaml
    ---
    name: Awesome Project
    tools: [Tool1, Tool2]
    image: image url or path here.
    description: Write project description here.
    ---
    ```

1. Add project body in markdown or html. Check available [elements]({{ '/elements' | relative_url }}) to enjoy extra customization.
1. Check more projects templates from [here]({{ site.github.repository_url }}/tree/master/docs/_projects).

#### Remote Projects

Remote Projects are imported automatically from GitHub. The name, description and topics are fetched from the given repository name. Note that the repository must be public and on your own account. To add a Remote Project, add the following lines to your existing front matter in `pages/projects.html`:

```yaml
---
remote_projects:
  - repo-name-1
  - repo-name-2
---
```
#### Posts

1. Add `YYYY-MM-DD-post-name.md` to `_posts/`.
1. Add [front matter](https://jekyllrb.com/docs/front-matter/) to the top of your new post file.

    ```yaml
    ---
    title: Awesome Title
    tags: [TAG 1, TAG 2]
    style: fill / border (choose one only)
    color: primary / secondary / success / danger / warning / info / light / dark (choose one only)
    description: Write post description here, or it will be the first 25 words of the post's body.
    ---
    ```

1. If you left both the style and color empty, the post's style is set to default style.
1. Add post body in markdown or html. Check available [elements]({{ '/elements' | relative_url }}) to enjoy extra customization.
1. Check more posts templates from [here]({{ site.github.repository_url }}/tree/master/docs/_posts).

#### Pages

1. Add `page-name.html` or `page-name.md` to `pages/`, `new subfolder` or to `root directory` of your project.
1. Add [front matter](https://jekyllrb.com/docs/front-matter/) to the top of your new page.

    ```yaml
    ---
    layout: default
    title: Page Name
    permalink: /page_permalink/ (the output path for the page)
    weight: 2 (the order of the page in the navigation bar)
    ---
    ```

1. The new page will be added to the navigation bar automatically.
1. Check more pages templates from [here]({{ site.github.repository_url }}/tree/master/docs/pages).

#### External Content

If you want your project, post or even the page to refer to an external resource, _**google.com** for example_, just add the following attribute to your front matter:

```yaml
---
external_url: https://google.com/
---
```

> 💡 **Pro Tip**  
> You can change `external_new_tab` in `_config.yml` to make the external URLs open in a new tab.

#### Skills

Add the following lines to `_data/programming-skills.yml` or `_data/other-skills.yml`.

```yaml
- name: Awesome Skill
  percentage: 95
  color: secondary / success / danger / warning / info / light / dark (choose one only, default is primary)
```

#### Skills Categories

1. Add `category_name-skills.yml` to `_data/`.
1. Add skills to the file using the previously mentioned method.
1. Open `pages/about.md`.
1. Add the following lines to the skills section between `<div class="row">` and `</div>`:

```liquid
{% raw %}{% include about/skills.html title="Category_Name Skills" source=site.data.category_name-skills %}{% endraw %}
```

#### Timeline Events

Add the following lines to `_data/timeline.yml`:

```yaml
- title: Awesome Item
  from: 2016
  to: 2018
  description: Write item description here.
```

#### Social Networks

portfolYOU provides a good number of social networks, but if you want to add your own, go on.

1. Add the following lines to `_data/social-media.yml`:

    ```yaml
    network_name:
      url   : https://www.network_name.com/
      icon  : fab fa-icon      # From FontAwesome (https://fontawesome.com/icons)
      color : 1da1f2           # Hex color code for hover
    ```

1. Then add the following to `_config` under the `author` key:

    ```yaml
    author:
      network_name : your_username_here
    ```

1. The new network will be added to your footer automatically.


# Contributing

## Branches and Commits

See the [Git Branch and Commit Naming](https://origindd.atlassian.net/wiki/spaces/DIG/pages/69252443/Git+Branch+and+Commit+Naming) Confluence page for our branching strategy and naming conventions.

## Pull Request Template

Below is a template for pull requests. When opening a pull request, copy and
paste this template into the "Description" field. If some sections aren't
applicable (such as "Screenshots"), feel free to remove them.

```text
## Background ##

Describe the purpose of the pull request. What does it add/fix? Why?

## Changes ##

List all changes introduced in the pull request. These may be copied from commit
messages.

## Checklist ##

* Desk-checked with UI/UX designer ✓
* Cross-browser tested in supported browsers ✓

## Zeplin ##

| Desktop                  | Tablet                   | Mobile                   |
| :----------------------- | :----------------------- | :----------------------- |
| https://zpl.io/xY7Nr24   | https://zpl.io/K41mpO2   | https://zpl.io/zZe78ja   |

## Screenshots ##

![screenshot1.png](https://bitbucket.org/.../screenshot1.png)
![screenshot2.png](https://bitbucket.org/.../screenshot2.png)

## Additional notes ##

Place any additional notes for the pull request here.
```

## Merging Pull Requests

All pull requests must be code reviewed before they can be merged. At a minimum,
two other developers must review and then "Approve" the pull request before it
can be merged. If issues are raised during the code review process, the author
should resolve these before the pull request is merged. "Resolving" means either
changing the code to fix the issue or refuting the issue.

Once a pull request has been approved, the author must ensure the following
conditions have been met:

1. The branch is in sync with the `master` branch
2. There are no merge conflicts with `master`
3. All builds are passing

At this point, the pull request can be merged by the author.

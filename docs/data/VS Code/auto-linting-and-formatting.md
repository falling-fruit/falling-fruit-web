# Auto-Linting and Formatting

There's a lot of linting and formatting checks in this repo, but you shouldn't have to run them manually with `yarn lint` or `yarn format` or wait until they occur with the pre-commit hook. VS Code can be set up to run linting and formatting on file save.

## Setup Linting

You can find the extensions marketplace in the tab on the left.

![image](https://user-images.githubusercontent.com/4369024/109908167-64d4a580-7c69-11eb-817f-a3a759af4445.png)

1. Install the [ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint).
2. Install the [Prettier extension](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode).

_Optional, but recommended:_

4. Install [vscode-styled-components](https://marketplace.visualstudio.com/items?itemName=jpoissonnier.vscode-styled-components).
5. Install [GitLens](https://marketplace.visualstudio.com/items?itemName=eamodio.gitlens).
6. Learn [vscodevim](https://marketplace.visualstudio.com/items?itemName=vscodevim.vim). Haha, this one is really optional.

Now, open up _Settings_ (`Cmd+,` on Mac or `Ctrl+,` on Windows). Then search for these:

7. Set **Editor: Default Formatter** to `esbenp.prettier-vscode`.
8. Enable **Editor: Format On Save** and **Editor: Format On Paste**. This ensures that Prettier runs on file save.
9. Search for **Editor: Code Actions On Save**. Click on _Edit in settings.json_. Then add:

```
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    }
```

This ensures that ESLint runs on file save. You won't have to sort imports manually, for example.

---

## Extras

If you have the time, I'd really recommend skimming through Arpan's excellent [VS Code Handbook](https://gist.github.com/arpanlaha/ecda6d594fb8980891a89e6e1c92bc14).

### Theming

Also, [spice up your VS Code theme](https://vscodethemes.com)!

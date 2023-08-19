# PHP Surround
<h5 style="text-align: center;">Wrap blocks of PHP code quickly! 🚀</h5>

*A fork of the [Surround](https://github.com/yatki/vscode-surround/tree/master) extension*

### Demo 1: Choosing a wrapper snippet from quick pick menu

![Demo 1](https://raw.githubusercontent.com/yatki/vscode-surround/master/images/demo.gif)

### Demo 2: Wrapping multi selections

![Demo 2](https://raw.githubusercontent.com/yatki/vscode-surround/master/images/demo2.gif)

## How To Use

After selecting the code block, you can

- **right click** on selected code
- OR press (ctrl+shift+T) or (cmd+shift+T)

to get list of commands and pick one of them.

> Hint
>
> Each wrapper has a **separate command** so you can define keybindings for your favorite wrappers by searching `surround.with.commandName` in the 'Keyboard Shortcuts' section.

### List of commands

| Command                                            | Snippet                                                         |
| -------------------------------------------------- | --------------------------------------------------------------- |
| `surround.with` (ctrl+shift+T)                     | List of all the enabled commands below                          |
| `surround.with.if`                                 | if ($condition) { ... }                                         |
| `surround.with.ifElse`                             | if ($condition) { ... } else { $else }                          |
| `surround.with.tryCatch`                           | try { ... } catch (\Exception $exception) { $catchBlock }                         |
| `surround.with.foreach`                            | foreach ($1 as $2) { ... }                                      |
| `surround.with.for`                                | for ($i = 0; ... ; $i++) { ... }                                |
| `surround.with.arrowFunction`                      | fn ($params) => ...                                             |
| `surround.with.functionDeclaration`                | function $name ($params) { ... }                                |
| `surround.with.comment`                            | /\*\* ... \*/                                                   |
| `surround.with.region`                             | #region $regionName ... #endregion                              |

## Options

- `showOnlyUserDefinedSnippets` (boolean): Disables default snippets that comes with the extension and shows only used defined snippets.
- `showRecentlyUsedFirst` (boolean): Recently used snippets will be displayed on top.
- `showUpdateNotifications` (boolean): Shows notification when there is a new version of the extension.

## Configuration

Each wrapper snippet config object is defined as `ISurroundItem` like below:

```ts
interface ISurroundItem {
  label: string; // must be unique
  description?: string;
  detail?: string;
  snippet: string; // must be valid SnippetString
  disabled?: boolean; // default: false
  languageIds?: string[];
}
```

### Editing/Disabling existing wrapper functions

Go to "Settings" and search for "surround.with._commandName_".

Example `surround.with.if`:

```json
{
  "label": "if",
  "description": "if ($condition) { ... }",
  "disabled": false,
  "snippet": "if(${1:condition}) {\n\t$TM_SELECTED_TEXT\n}$0"
}
```

### Adding new custom wrapper functions

Go to "Settings" and search for `surround.custom` and edit it like below.

```js
{
  "surround.custom": {
    // command name must be unique
    "yourCommandName": {
      // label must be unique
      "label": "Your Snippet Label",
      "description": "Your Snippet Description",
      "snippet": "burrito { $TM_SELECTED_TEXT }$0", // <-- snippet goes here.
      "languageIds": ["html", "javascript", "typescript", "markdown"]
    },
    // You can add more ...
  }
}
```

### Defining language-specific snippets

With version [`1.1.0`](https://github.com/yatki/vscode-surround/releases), you can define snippets based on the document type by using `languageIds` option.

Visit VSCode docs the full list of [language identifiers](https://code.visualstudio.com/docs/languages/identifiers#_known-language-identifiers).

#### 1. Enabling a snippet for ALL languages

If you want to allow a snippet to work for all document types, simply **REMOVE** `languageIds` option.

**OR** set it to `["*"]` as below:

```jsonc
{
  "label": "if",
  "description": "if ($condition) { ... }",
  "disabled": false,
  "snippet": "if(${1:condition}) {\n\t$TM_SELECTED_TEXT\n}$0",
  "languageIds": ["*"] // Wildcard allows snippet to work with all languages
}
```

#### 2. Enabling a snippet for ONLY specified languages

If you want to allow a snippet to work with `html`, `typescript` and `typescriptreact` documents, you can use the example below.

```jsonc
{
  "label": "if",
  "description": "if ($condition) { ... }",
  "disabled": false,
  "snippet": "if(${1:condition}) {\n\t$TM_SELECTED_TEXT\n}$0",
  "languageIds": ["html", "typescript", "typescriptreact"]
}
```

#### 3. Disabling a snippet for ONLY specified languages

If you want to allow a snippet to work with **all** document types **EXCEPT** `html`, `typescript` and `typescriptreact` documents,
you can add `-` (MINUS) sign as a prefix to the language identifiers (_without_ a whitespace).

```jsonc
{
  "label": "if",
  "description": "if ($condition) { ... }",
  "disabled": false,
  "snippet": "if(${1:condition}) {\n\t$TM_SELECTED_TEXT\n}$0",
  "languageIds": ["*", "-html", "-typescript", "-typescriptreact"]
}
```

### IMPORTANT NOTES:

1.  All **command names** and **labels** must be unique. If you do not provide a **unique** command name or label, your custom wrapper functions will override existing ones.
1.  You can redefine all snippets as long as you provide a valid `SnippetString`. [Read More](https://code.visualstudio.com/docs/extensionAPI/vscode-api#SnippetString)

## Contribution

As always, I'm open to any contribution and would like to hear your feedback.

PS: [Guide for running @vscode/test-web on WSL 2](https://medium.com/javarevisited/using-wsl-2-with-x-server-linux-on-windows-a372263533c3)

### Just an important reminder:

If you are planning to contribute to **any** open source project,
before starting development, please **always open an issue** and **make a proposal first**.
This will save you from working on features that are eventually going to be rejected for some reason.

## LICENCE

MIT (c) 2023 Henrique Miranda

**Enjoy!**

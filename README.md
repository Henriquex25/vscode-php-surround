# PHP Surround
<h5 style="text-align: center;">Wrap blocks of PHP code quickly! 🚀</h5>

*A fork of the [Surround](https://github.com/yatki/vscode-surround/tree/master) extension*

### Demo: Choosing a wrapper snippet from quick pick menu

![Demo](https://raw.githubusercontent.com/Henriquex25/vscode-php-surround/master/images/tc.gif)

## How To Use

After selecting the code block, you can

- **right click** on selected code
- OR press (ctrl+shift+T) or (cmd+shift+T)

### List of commands

| Command                                            | Snippet                                                         |
| -------------------------------------------------- | --------------------------------------------------------------- |
| `surround.with` (ctrl+shift+T)                     | List of all the enabled commands below                          |
| `surround.with.if`                                 | if ($condition) { ... }                                         |
| `surround.with.ifElse`                             | if ($condition) { ... } else { $else }                          |
| `surround.with.tryCatch`                           | try { ... } catch (\Exception $exception) { $catchBlock }       |
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

### IMPORTANT NOTES:

1.  All **command names** and **labels** must be unique. If you do not provide a **unique** command name or label, your custom wrapper functions will override existing ones.
2.  You can redefine all snippets as long as you provide a valid `SnippetString`. [Read More](https://code.visualstudio.com/docs/extensionAPI/vscode-api#SnippetString)
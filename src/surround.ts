import {
  workspace,
  ExtensionContext,
  commands,
  window,
  QuickPickItem,
  SnippetString,
  extensions,
  MessageItem,
  env,
  Uri,
  Selection,
  Position,
} from "vscode";

interface ISurroundItem {
  label: string;
  description?: string;
  detail?: string;
  snippet: string;
  disabled?: boolean;
  languageIds?: string;
}

interface ISurroundConfig {
  [key: string]: ISurroundItem;
}

function getLanguageId(): string | undefined {
  let editor = window.activeTextEditor;
  if (editor === undefined) {
    return undefined;
  }
  return editor.document.languageId;
}

function filterSurroundItems(items: ISurroundItem[], languageId?: string) {
  if (languageId === undefined) {
    return items;
  }
  return items.filter((item) => {
    if (!item.languageIds || item.languageIds.length < 1) {
      return true;
    }

    if (item.languageIds.includes(`-${languageId}`)) {
      return false;
    }

    if (
      item.languageIds.includes("*") ||
      item.languageIds.includes(languageId)
    ) {
      return true;
    }

    return false;
  });
}

function getSurroundConfig(): ISurroundConfig {
  let config = workspace.getConfiguration("surround");
  const showOnlyUserDefinedSnippets = config.get(
    "showOnlyUserDefinedSnippets",
    false
  );
  const items = showOnlyUserDefinedSnippets
    ? {}
    : <ISurroundConfig>config.get("with", {});
  const custom = <ISurroundConfig>config.get("custom", {});

  for (const key of Object.keys(custom)) {
    if (typeof custom[key] !== "object" || !custom[key].label) {
      window.showErrorMessage(
        `Invalid custom config for Surround: surround.custom.${key}!\nPlease check your settings!`
      );
      return { ...items };
    }
  }

  return { ...items, ...custom };
}

function getEnabledSurroundItems(surroundConfig: ISurroundConfig) {
  const items: ISurroundItem[] = [];
  Object.keys(surroundConfig).forEach((surroundItemKey) => {
    const surroundItem: ISurroundItem = surroundConfig[surroundItemKey];
    if (!surroundItem.disabled) {
      items.push(surroundItem);
    }
  });
  return items;
}

function trimSelection(selection: Selection): Selection | undefined {
  let activeEditor = window.activeTextEditor;
  if (activeEditor && selection) {
    const startLine = selection.start.line;
    const endLine = selection.end.line;

    let startPosition: Position | undefined = undefined;
    let endPosition: Position | undefined = undefined;

    for (let lineNo = startLine; lineNo <= endLine; lineNo++) {
      const line = activeEditor.document.lineAt(lineNo);
      if (line.isEmptyOrWhitespace) {
        continue;
      }

      if (
        lineNo === startLine &&
        !line.text.slice(selection.start.character).trim()
      ) {
        continue;
      }

      if (
        lineNo > startLine &&
        lineNo === endLine &&
        selection.end.character < line.firstNonWhitespaceCharacterIndex
      ) {
        continue;
      }

      if (!startPosition) {
        // find start character index
        let startCharacter = line.firstNonWhitespaceCharacterIndex;

        if (lineNo === startLine) {
          startCharacter = Math.max(startCharacter, selection.start.character);
        }

        startPosition = new Position(lineNo, startCharacter);
      }

      // find end character index
      let endCharacter =
        line.firstNonWhitespaceCharacterIndex + line.text.trim().length;

      if (lineNo === endLine) {
        endCharacter = Math.min(endCharacter, selection.end.character);
      }

      endPosition = new Position(lineNo, endCharacter);
    }

    if (startPosition && endPosition) {
      return new Selection(startPosition, endPosition);
    }
  }

  return undefined;
}

function trimSelections(): void {
  let activeEditor = window.activeTextEditor;
  if (activeEditor && activeEditor.selections) {
    const selections: Selection[] = [];

    activeEditor.selections.forEach((selection) => {
      if (
        selection.start.line === selection.end.line &&
        selection.start.character === selection.end.character
      ) {
        return selections.push(selection);
      }

      const trimmedSelection = trimSelection(selection);
      if (trimmedSelection) {
        selections.push(trimmedSelection);
      }
    });

    activeEditor.selections = selections;
  }
}

function applyQuickPick(item: QuickPickItem, surroundItems: ISurroundItem[]) {
  const activeEditor = window.activeTextEditor;

  if (activeEditor && item) {
    const surroundItem = surroundItems.find((s) => item.label === s.label);
    if (surroundItem) {
      try {
        trimSelections();
        activeEditor.insertSnippet(new SnippetString(surroundItem.snippet));
      } catch (err) {
        window.showErrorMessage(
          "Could not apply surround snippet: " + surroundItem.label,
          String(err)
        );
      }
    }
  }
}

function applySurroundItem(key: string, surroundConfig: ISurroundConfig) {
  if (window.activeTextEditor && surroundConfig[key]) {
    const surroundItem: ISurroundItem = surroundConfig[key];
    window.activeTextEditor.insertSnippet(
      new SnippetString(surroundItem.snippet)
    );
  }
}

function registerCommands(
  context: ExtensionContext,
  surroundConfig: ISurroundConfig
) {
  commands.getCommands().then((cmdList) => {
    Object.keys(surroundConfig).forEach((key) => {
      const cmdText = `surround.with.${key}`;
      if (cmdList.indexOf(cmdText) === -1) {
        context.subscriptions.push(
          commands.registerCommand(cmdText, () => {
            applySurroundItem(key, surroundConfig);
          })
        );
      }
    });
  });
}

const SURROUND_LAST_VERSION_KEY = "HenriqueMiranda.vscode-php-surround:last-version";
const PENDING_FOCUS = "HenriqueMiranda.vscode-php-surround:pending-focus";

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: ExtensionContext) {
  let surroundItems: ISurroundItem[] = [];
  let showRecentlyUsedFirst = true;
  let surroundConfig: ISurroundConfig;

  const previousVersion = context.globalState.get<string>(
    SURROUND_LAST_VERSION_KEY
  );
  const surroundExt = extensions.getExtension("HenriqueMiranda.vscode-php-surround")!;
  const surroundVersion = surroundExt.packageJSON.version;

  function update() {
    surroundConfig = getSurroundConfig();

    showRecentlyUsedFirst = !!workspace
      .getConfiguration("surround")
      .get("showRecentlyUsedFirst");
    surroundItems = getEnabledSurroundItems(surroundConfig);

    registerCommands(context, surroundConfig);
  }

  workspace.onDidChangeConfiguration(() => {
    update();
  });

  update();
  let disposable = commands.registerCommand("surround.with", async () => {
    let quickPickItems = filterSurroundItems(
      surroundItems,
      getLanguageId()
    ).map(({ label, description }) => ({
      label,
      description,
    }));

    const item = await window.showQuickPick(quickPickItems, {
      placeHolder: "Type the label of the snippet",
      matchOnDescription: true,
    });

    if (!item) {
      return;
    }

    applyQuickPick(item, surroundItems);

    const selectedSurroundItem = surroundItems.find(
      (i) => i.label === item.label && i.description === item.description
    );

    if (showRecentlyUsedFirst && selectedSurroundItem) {
      surroundItems = surroundItems.filter(
        (i) => i.label !== item.label || i.description !== item.description
      );
      surroundItems.unshift(selectedSurroundItem);
    }
  });

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}

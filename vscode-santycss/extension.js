const vscode = require('vscode');
const { generateAll } = require('./src/data');

let allClasses = null;
let classMap = null;

function getClasses() {
  if (!allClasses) {
    allClasses = generateAll();
    classMap = new Map(allClasses.map(c => [c.name, c]));
  }
  return { allClasses, classMap };
}

// Detect if cursor is inside a class/className attribute value
function getClassContext(document, position) {
  const line = document.lineAt(position).text;
  const charIndex = position.character;

  // Look for class="..." or className="..." patterns
  const patterns = [
    /\bclass(?:Name)?\s*=\s*"([^"]*)"/g,
    /\bclass(?:Name)?\s*=\s*'([^']*)'/g,
    /\bclass(?:Name)?\s*=\s*\{`([^`]*)`\}/g,
    /\bclass(?:Name)?\s*=\s*\{['"]([^'"]*)['"]\}/g,
  ];

  for (const pattern of patterns) {
    let match;
    pattern.lastIndex = 0;
    while ((match = pattern.exec(line)) !== null) {
      const attrStart = match.index;
      // Find the opening quote
      const quoteMatch = line.slice(attrStart).search(/["'`]/);
      if (quoteMatch === -1) continue;
      const valueStart = attrStart + quoteMatch + 1;
      const valueEnd = valueStart + match[1].length;

      if (charIndex >= valueStart && charIndex <= valueEnd) {
        // Find the current word being typed
        const valueUpToCursor = match[1].slice(0, charIndex - valueStart);
        const words = valueUpToCursor.split(/\s+/);
        const currentWord = words[words.length - 1];
        return { inClassAttr: true, currentWord };
      }
    }
  }

  return { inClassAttr: false, currentWord: '' };
}

// Get the word under/before cursor for hover
function getWordAtPosition(document, position) {
  const range = document.getWordRangeAtPosition(position, /[\w:-]+/);
  if (!range) return null;
  return document.getText(range);
}

// Format CSS for hover display
function formatCSSHover(item) {
  const md = new vscode.MarkdownString();
  md.isTrusted = true;
  md.supportHtml = true;

  md.appendMarkdown(`**\`${item.name}\`** — SantyCSS\n\n`);

  if (item.doc) {
    md.appendMarkdown(`${item.doc}\n\n`);
  }

  if (item.css) {
    md.appendCodeblock(`.${item.name} {\n  ${item.css.split(';').filter(Boolean).join(';\n  ').trim()}\n}`, 'css');
  }

  return md;
}

class SantyCSSCompletionProvider {
  provideCompletionItems(document, position, token, context) {
    const config = vscode.workspace.getConfiguration('santycss');
    if (!config.get('enabled', true)) return;

    const trigger = config.get('completionTrigger', 'both');
    const { inClassAttr, currentWord } = getClassContext(document, position);

    if (trigger === 'classAttr' && !inClassAttr) return;

    const { allClasses } = getClasses();

    // Filter by what's being typed
    const filtered = currentWord.length >= 1
      ? allClasses.filter(c => c.name.startsWith(currentWord) || c.name.includes(currentWord))
      : allClasses;

    return filtered.slice(0, 200).map(item => {
      const completion = new vscode.CompletionItem(item.name, vscode.CompletionItemKind.Value);

      completion.detail = 'SantyCSS';
      completion.filterText = item.name;
      completion.insertText = item.name;

      if (item.doc) {
        completion.documentation = new vscode.MarkdownString(item.doc);
      }

      if (item.css) {
        const detail = `.${item.name} { ${item.css} }`;
        completion.documentation = new vscode.MarkdownString(
          `${item.doc ? item.doc + '\n\n' : ''}\`\`\`css\n.${item.name} {\n  ${item.css}\n}\n\`\`\``
        );
      }

      // Sort: exact prefix matches first
      completion.sortText = item.name.startsWith(currentWord)
        ? '0' + item.name
        : '1' + item.name;

      return completion;
    });
  }
}

class SantyCSSHoverProvider {
  provideHover(document, position, token) {
    const config = vscode.workspace.getConfiguration('santycss');
    if (!config.get('enabled', true)) return;
    if (!config.get('showCSSOnHover', true)) return;

    const word = getWordAtPosition(document, position);
    if (!word) return;

    const { classMap } = getClasses();
    const item = classMap.get(word);
    if (!item) return;

    return new vscode.Hover(formatCSSHover(item));
  }
}

function activate(context) {
  const LANGUAGES = [
    'html', 'javascript', 'javascriptreact',
    'typescript', 'typescriptreact',
    'vue', 'svelte', 'php', 'erb'
  ];

  const completionProvider = new SantyCSSCompletionProvider();
  const hoverProvider = new SantyCSSHoverProvider();

  for (const lang of LANGUAGES) {
    context.subscriptions.push(
      vscode.languages.registerCompletionItemProvider(
        { language: lang, scheme: 'file' },
        completionProvider,
        ' ', '"', "'", '`'  // trigger characters
      )
    );

    context.subscriptions.push(
      vscode.languages.registerHoverProvider(
        { language: lang, scheme: 'file' },
        hoverProvider
      )
    );
  }

  // Status bar item
  const statusBar = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
  statusBar.text = '$(symbol-class) SantyCSS';
  statusBar.tooltip = 'SantyCSS IntelliSense active';
  statusBar.show();
  context.subscriptions.push(statusBar);

  // Command: disable/enable toggle
  context.subscriptions.push(
    vscode.commands.registerCommand('santycss.toggle', () => {
      const config = vscode.workspace.getConfiguration('santycss');
      const enabled = config.get('enabled', true);
      config.update('enabled', !enabled, vscode.ConfigurationTarget.Global);
      vscode.window.showInformationMessage(
        `SantyCSS IntelliSense ${!enabled ? 'enabled' : 'disabled'}`
      );
    })
  );
}

function deactivate() {
  allClasses = null;
  classMap = null;
}

module.exports = { activate, deactivate };

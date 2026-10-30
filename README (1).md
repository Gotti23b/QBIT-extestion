# QBIT Extension

QBIT Extension connects the existing QBIT chat to a signed-in AI chat tab through a local Windows console. It does not use API keys.

## Install

Download `QBIT-Extension-Installer.zip` from the GitHub Actions artifact or a tagged GitHub release, extract it, and run `install-qbit-extension.bat`. The installer copies the extension and console to `%LOCALAPPDATA%\QBIT Extension`, registers the `qbit-console://` link used by QBIT's **Conectar IA** button, and opens Chrome's extensions page.

In Chrome, turn on **Developer mode**, choose **Load unpacked**, and select:

```text
%LOCALAPPDATA%\QBIT Extension\extension
```

Reload QBIT and the AI tab after loading the extension. Sign in to QBIT and to ChatGPT or Arena.ai. Gemini, Claude, DeepSeek, Qwen, and Meta AI are also supported. Click **Conectar IA** in QBIT to open the console and leave it running.

QBIT checks its existing Supabase commands and prefabricated response variants first. If none match, the extension sends the message through QBIT Console to the active supported AI chat tab, reads the finished reply, and displays it in QBIT's chat.

## Local files

- `extension/`: Chrome Manifest V3 folder to load unpacked.
- `install-qbit-extension.bat`: installer entry point.
- `install-qbit-extension.ps1`: copies the extension and registers the local URL handler.
- `start-qbit-console.bat`: opens the visible console directly.
- `qbit-console.ps1`: local WebSocket relay, bound to `127.0.0.1:17614`.

The console relays text only. It does not run shell commands or execute AI output. The QBIT source repo remains untouched; this repository contains its working copy and the separate extension integration.

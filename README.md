# QBIT Extension (carga descomprimida)

La carpeta `extension` es la que se carga desde Chrome en modo desarrollador.

1. Ejecutá `install-qbit-extension.bat` del paquete. Copia la extensión y la consola a `%LOCALAPPDATA%\QBIT Extension`, registra el enlace local que abre la consola y muestra Chrome.
2. En `chrome://extensions`, activá **Modo de desarrollador** y elegí **Cargar descomprimida**.
3. Seleccioná `%LOCALAPPDATA%\QBIT Extension\extension` y recargá las pestañas de QBIT y del proveedor de IA.
4. Iniciá sesión en [QBIT](https://gotti23b.github.io/QBIT/) y en ChatGPT o Arena.ai. También se reconocen Gemini, Claude, DeepSeek, Qwen y Meta AI.
5. Hacé clic en **Conectar IA** dentro de QBIT. Se abre QBIT Console; dejala abierta. Los comandos y respuestas prefabricadas se resuelven primero y las consultas restantes viajan a la pestaña activa de IA y vuelven al chat de QBIT.

No configures API keys. La extensión escribe el mensaje en la página del proveedor y lee la respuesta visible en esa misma conversación.

La consola solo escucha en `127.0.0.1:17614`. También podés iniciarla con `start-qbit-console.bat`. Si Chrome muestra una confirmación al abrir la consola, aceptala.

## Qué hay en cada carpeta

- `windows/electron/`: la app de escritorio QBIT Desktop. Abre el conector local y lo usa con la extensión de `browser-extension/`.
- `browser-extension/`: la extensión de Chrome que usa QBIT Desktop. La app la actualiza sola con cada release.
- `extension/`, `qbit-console.ps1`, `install-qbit-extension.*`, `start-qbit-console.bat`: la versión independiente para usar QBIT web con la consola de PowerShell.
- `.github/workflows/build-windows.yml`: arma el instalador y publica el release cuando cambia la `version` de `package.json`.

QBIT Desktop y la consola de PowerShell usan el mismo puerto (`127.0.0.1:17614`). Usá solo una de las dos a la vez.

La consola de PowerShell solo reenvía texto: no ejecuta comandos ni lo que escribe la IA.


## Controlar QBIT Desktop desde QBIT Web

La extensión ahora agrega el puente para que QBIT Web pueda ejecutar los Artifacts de QBIT Desktop:

1. Abrí QBIT Desktop. El puente local se inicia automáticamente.
2. Cargá la carpeta `extension` de este repositorio en Chrome desde `chrome://extensions` (Modo de desarrollador → Cargar descomprimida).
3. Abrí QBIT Web e iniciá sesión.
4. Activá el interruptor **Control PC** en la barra superior.
5. Abrí una pestaña de ChatGPT, Gemini, Claude, DeepSeek, Qwen, Arena.ai o Meta AI e iniciá sesión. QBIT usará esa IA para responder y podrá enviar los bloques `qbit` a QBIT Desktop.

Las acciones que requieren autorización siguen mostrando la confirmación de QBIT Desktop. Si Desktop está cerrado o la extensión no está conectada, el control aparecerá desconectado y no se ejecutarán acciones.

Dominios compatibles: `gotti23b.github.io/QBIT`, `qbit.uno` y `www.qbit.uno`.

---
name: minha-colheita-android-build
description: Empacota o projeto React+TypeScript+Vite "minha-colheita" como APK Android usando Capacitor, sem reescrever o código React existente. Use sempre que o usuário mencionar gerar APK, transformar o app em aplicativo Android, distribuir via Play Store ou WhatsApp, empacotar o projeto para celular, instalar Capacitor, ou qualquer pedido envolvendo "transformar PWA em app nativo", "gerar instalador", "build Android" ou similares neste projeto. Esta skill cuida apenas da camada de empacotamento — a integração de voz fica na skill irmã `minha-colheita-voice-architecture`, que assume que esta foi executada antes.
---

# Minha Colheita — Build Android com Capacitor

Esta skill empacota o projeto React (`minha-colheita-repo`) como APK Android usando **Capacitor**, preservando 100% do código React existente. O resultado é um aplicativo Android instalável que pode ser distribuído fora da Play Store (via link direto ou WhatsApp).

## Contexto do projeto

- Stack: React 19 + TypeScript + Vite + react-router-dom
- Backend Python separado (não entra no APK)
- Público-alvo: agricultores em regiões com baixo acesso a internet, dispositivos Android básicos (2-4GB RAM)
- Distribuição planejada: APK direto, sem loja

## Princípios

1. **Não reescreva React.** O Capacitor envelopa o build do Vite num WebView nativo. Nada de React precisa mudar.
2. **Não toque no backend Python.** Ele permanece como serviço separado, acessado via HTTP pelo app.
3. **Não inclua plugins de voz aqui.** Eles pertencem à skill `minha-colheita-voice-architecture`.
4. **Permissões mínimas.** Adicione apenas o que for estritamente necessário no `AndroidManifest.xml`.

## Fluxo de implementação (alto nível)

### Etapa 1 — Pré-requisitos
Verifique antes de prosseguir:
- Node.js e npm instalados (já são, o projeto usa Vite)
- Java JDK 17+ instalado
- Android Studio instalado (necessário para gerar o APK final)
- Variáveis `ANDROID_HOME` e `JAVA_HOME` configuradas

Se algum item faltar, pare e oriente o usuário antes de continuar.

### Etapa 2 — Instalar Capacitor no projeto
A partir da raiz do repositório:
- Instale `@capacitor/core`, `@capacitor/cli` e `@capacitor/android` via npm
- Rode `npx cap init` para configurar nome do app (`Minha Colheita`) e package ID (sugerido: `br.com.minhacolheita.app`)
- O `capacitor.config.ts` será criado na raiz — ajuste `webDir` para `dist` (saída padrão do Vite)

### Etapa 3 — Gerar o build web e adicionar plataforma Android
- Execute `npm run build` para gerar a pasta `dist/`
- Execute `npx cap add android` para criar a pasta `/android` com o projeto Android Studio
- Execute `npx cap sync` para copiar o build para dentro do projeto Android

### Etapa 4 — Configurar permissões e metadados
No arquivo `android/app/src/main/AndroidManifest.xml`:
- Adicione apenas as permissões essenciais para o funcionamento atual do app
- **Não adicione `RECORD_AUDIO` aqui** — isso é responsabilidade da skill de voz
- Confirme `android:usesCleartextTraffic` se o backend Python rodar em HTTP local durante desenvolvimento

No `android/app/build.gradle`:
- Verifique `minSdkVersion` (recomendado: 22, cobre Android 5.1+)
- Verifique `versionName` e `versionCode` para o lançamento

### Etapa 5 — Geração do APK
- Para teste rápido: `npx cap run android` (precisa de dispositivo conectado ou emulador)
- Para gerar APK assinado: abra `android/` no Android Studio → Build → Generate Signed Bundle/APK
- Para builds futuros, sempre rode `npm run build && npx cap sync` antes de gerar novo APK

## Estrutura esperada após execução

```
minha-colheita-repo/
├── android/              ← novo, gerenciado pelo Capacitor
├── backend/              ← intocado
├── src/                  ← intocado
├── dist/                 ← gerado pelo `npm run build`
├── capacitor.config.ts   ← novo
└── package.json          ← atualizado com dependências Capacitor
```

## Pontos de atenção

- **Mudanças no React exigem `npm run build && npx cap sync`** antes de aparecerem no APK. Esqueça isso e o app continuará rodando a versão antiga.
- **HTTPS não é mais obrigatório** dentro do APK (diferente da PWA), pois é app nativo. Mas se o backend Python estiver em domínio externo, prefira HTTPS por segurança.
- **Tamanho do APK**: builds básicos com Capacitor ficam em torno de 4-6 MB. Aceitável para o público-alvo.
- **Atualizações pós-instalação**: sem Play Store, atualizações exigem reenviar APK ao usuário. Considere documentar isso ou implementar um aviso simples de versão.

## Quando terminar

Confirme com o usuário:
1. O comando `npx cap run android` abre o app corretamente em emulador/dispositivo
2. A pasta `android/` está versionada (ou explicitamente ignorada — decisão do usuário)
3. O `capacitor.config.ts` está commitado
4. O usuário sabe rodar o ciclo `build → sync → run` para futuras alterações

Em seguida, oriente o usuário a executar a skill `minha-colheita-voice-architecture` para adicionar reconhecimento e síntese de voz sobre esta base.

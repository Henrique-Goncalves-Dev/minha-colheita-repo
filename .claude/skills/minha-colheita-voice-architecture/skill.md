---
name: minha-colheita-voice-architecture
description: Implementa reconhecimento de voz (STT) e síntese de fala (TTS) no app "minha-colheita" usando plugins nativos do Capacitor, com fluxo guiado por árvore de decisão para cadastros agrícolas e botões de leitura em voz alta nos rótulos da interface. Use sempre que o usuário mencionar voz, microfone, fala, reconhecimento de áudio, leitura de tela, acessibilidade auditiva, fluxo guiado por voz, "agricultor falar para cadastrar", botão de som ao lado de campos, ou qualquer integração de áudio neste projeto. Esta skill assume que `minha-colheita-android-build` já foi executada — o projeto deve estar configurado com Capacitor e a pasta `/android` deve existir antes de prosseguir.
---

# Minha Colheita — Arquitetura de Voz

Esta skill adiciona duas capacidades ao app:

1. **Reconhecimento de voz (STT)** com fluxo guiado por árvore de decisão — o app faz perguntas, o agricultor responde por voz, cada resposta vai direto ao campo correto do banco.
2. **Síntese de voz (TTS)** — botão de som ao lado de cada rótulo lê o texto em voz alta para usuários com baixa alfabetização.

## Pré-condição

O projeto já deve ter Capacitor instalado e a pasta `/android` configurada pela skill `minha-colheita-android-build`. Se não tiver, **pare e oriente o usuário** a executar aquela skill primeiro.

## Princípios

1. **Plugins nativos, não Web Speech API.** Em APK, use as APIs nativas do Android via Capacitor — mais estáveis em dispositivos básicos e não exigem HTTPS.
2. **Confirmação falada antes de salvar.** Reconhecimento por voz erra; a confirmação elimina quase 100% dos erros sem complexidade adicional.
3. **Fluxo guiado, nunca fala livre.** Uma pergunta por vez. Cada resposta cai num campo único. Sem NLP, sem LLM, sem ambiguidade.
4. **Normalização simples.** Mapeamentos diretos para palavras comuns ("dez" → 10, "milho" → "milho"). Sem IA.
5. **Acessível para baixa alfabetização.** Toda interação por voz deve ter equivalente visual e vice-versa.

## Tecnologias

- **`@capacitor-community/speech-recognition`** — STT nativo Android, suporta pt-BR, retorna texto. Licença MIT, gratuito.
- **`@capacitor/text-to-speech`** — TTS oficial Capacitor, usa motor nativo Android, voz pt-BR já instalada nos aparelhos. Licença MIT, gratuito, offline.

## Fluxo de implementação (alto nível)

### Etapa 1 — Instalar e configurar plugins
- Instale ambos os plugins via npm
- Rode `npx cap sync` para propagar para o projeto Android
- No `AndroidManifest.xml`, adicione:
  - `RECORD_AUDIO` (microfone)
  - `INTERNET` (caso o motor STT do Android precise baixar modelo de linguagem na primeira vez)
- Solicite permissão de microfone em runtime na primeira abertura do fluxo de voz

### Etapa 2 — Definir a árvore de perguntas
Crie `src/voice/voiceFlow.ts` contendo um array tipado de "passos", cada um com:
- `field` — nome do campo no formulário/banco
- `question` — texto que o app vai falar
- `type` — `'text'` ou `'number'` (define como normalizar a resposta)
- `validation` (opcional) — função que valida a resposta

Mantenha um arquivo de fluxo por entidade (sementes, vendas, despesas, etc.) — separação clara facilita manutenção.

### Etapa 3 — Hook `useVoiceFlow`
Crie `src/voice/useVoiceFlow.ts` — hook React que:
- Recebe um array de passos (do voiceFlow)
- Mantém estado: passo atual, respostas acumuladas, status (`'speaking' | 'listening' | 'confirming' | 'done'`)
- Encadeia: TTS fala pergunta → aguarda fim da fala → STT escuta → normaliza → avança
- Ao final, fala o resumo das respostas e pede confirmação ("sim"/"não")
- Se "não", reinicia o fluxo; se "sim", retorna o objeto final pronto para salvar

### Etapa 4 — Normalizador de respostas
Crie `src/voice/normalizers.ts` com funções puras:
- `normalizeNumber(text)` — converte "dez", "vinte e cinco", "10", "10 quilos" → número
- `normalizeText(text)` — limpa espaços, lowercase, remove pontuação
- `normalizeYesNo(text)` — interpreta "sim", "claro", "isso", "não", "errado", "negativo"

Sem IA. Apenas mapeamentos e regex simples. Para números por extenso em português, mantenha um dicionário até 100 — cobre quase todos os casos agrícolas reais.

### Etapa 5 — Componente de botão de som universal
Crie `src/voice/SpeakButton.tsx` — componente pequeno que recebe `text` como prop e renderiza um botão com ícone de alto-falante. Ao tocar, dispara `TextToSpeech.speak({ text, lang: 'pt-BR', rate: 0.9 })`.

Use este componente ao lado de **todo** rótulo de campo, título de tela e botão importante. Exemplo: `<label>Renda <SpeakButton text="Renda" /></label>`.

### Etapa 6 — Componente de fluxo guiado universal
Crie `src/voice/GuidedVoiceForm.tsx` — componente que recebe um array de passos e renderiza:
- Indicador visual da pergunta atual (também por escrito, para quem consegue ler)
- Indicador de estado (falando / escutando / confirmando)
- Botão grande "Repetir pergunta" (acessibilidade)
- Botão "Cancelar e usar teclado" (sempre ofereça alternativa)

Use este componente nas telas de cadastro existentes — passe a árvore correspondente da Etapa 2.

### Etapa 7 — Integração nas telas existentes
Para cada tela de cadastro do app:
- Adicione um botão "Cadastrar por voz" no topo
- Ao tocar, abra o `GuidedVoiceForm` com a árvore correta
- O resultado retornado pelo hook preenche o estado do formulário existente
- Usuário ainda pode revisar visualmente antes de salvar

### Etapa 8 — Adicionar `SpeakButton` aos rótulos
Percorra os componentes de UI existentes e adicione `<SpeakButton>` ao lado de cada rótulo principal. Priorize:
- Títulos de tela
- Rótulos de campos de formulário
- Textos de botões críticos (Salvar, Cancelar, Confirmar)
- Mensagens de erro e sucesso

## Estrutura de arquivos esperada

```
src/
├── voice/
│   ├── voiceFlow.ts           ← árvores de perguntas por entidade
│   ├── useVoiceFlow.ts        ← hook orquestrador
│   ├── normalizers.ts         ← funções de normalização
│   ├── SpeakButton.tsx        ← botão de leitura universal
│   ├── GuidedVoiceForm.tsx    ← componente de fluxo guiado
│   └── permissions.ts         ← lógica de permissão de microfone
└── (resto do projeto intocado)
```

## Pontos de atenção

- **Primeira execução pode exigir internet.** O motor STT do Android baixa modelo de linguagem pt-BR na primeira vez. Após isso, funciona offline. Documente esse comportamento ou exiba aviso na primeira abertura.
- **Não fale e escute ao mesmo tempo.** Aguarde o evento de fim do TTS antes de iniciar o STT, senão o microfone capta a própria voz do app.
- **Timeouts são essenciais.** Se o agricultor não responder em ~10 segundos, o app deve repetir a pergunta automaticamente — não ficar mudo.
- **Sempre ofereça fallback de teclado.** Microfone pode falhar (barulho, permissão negada, etc.). O usuário deve poder digitar como alternativa.
- **Voz de saída calma e pausada.** Use `rate: 0.85-0.9` no TTS. Agricultores não-letrados precisam de tempo para processar.
- **Confirmação é não-negociável.** Mesmo que o reconhecimento pareça perfeito, sempre confirme antes de salvar. Erros silenciosos em dados agrícolas geram desconfiança e abandono do app.

## Quando terminar

Confirme com o usuário:
1. Permissão de microfone é pedida corretamente na primeira abertura
2. Pelo menos uma tela de cadastro funciona end-to-end por voz (semente → quantidade → confirmação → salvo)
3. Pelo menos um rótulo (ex: "Renda") fala corretamente quando o botão de som é tocado
4. O fluxo continua funcionando se a internet cair (após primeira inicialização)
5. O fallback de teclado está acessível em toda tela com voz

Após validar tudo, oriente o usuário a regenerar o APK com `npm run build && npx cap sync` e testar num dispositivo real (emuladores nem sempre têm microfone configurado).

# IF Rush

Runner 3D de sessao curta para banca/exposicao do curso de Informatica do IF.

## Rodar local

Na pasta raiz do projeto:

```powershell
npm start
```

Abra:

```text
http://127.0.0.1:8765/if-rush/
```

Para desligar:

```powershell
npm run stop
```

Se rodar com `python -m http.server`, o jogo ainda funciona, mas o ranking fica apenas no `localStorage`.

## MVP

- Runner 3D em Three.js.
- Personagem 3D com sala de preparacao, troca de modelo, sexo e cores antes da corrida.
- Pulo, rolamento e queda rapida no ar com seta para baixo/swipe para baixo.
- Hitboxes 3D por altura para evitar mortes injustas.
- Ranking local com `localStorage`.
- Ranking em `if-rush/ranking.json` quando rodar pelo `server.py` local.
- Coletaveis didaticos sobre areas da Informatica, sem modal interrompendo a leitura da pista.
- Obstaculos com silhuetas e marcacoes de acao: pule, abaixe ou desvie.
- Controles por teclado e toque.
- Sem build obrigatorio, pronto para Cloudflare Pages como site estatico.

## Assets

- Texturas PBR CC0 baixadas do ambientCG em `assets/textures/ambientcg`.
- Modelos 3D locais reaproveitados da pasta `../models`.

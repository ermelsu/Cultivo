# Indoor Grow Tracker

Aplicação estática (HTML/CSS/JS) para:

- calendário de fases genéricas;
- checklist de preparação de ambiente e equipamentos;
- registro diário de temperatura, umidade, leitura de luz e estado dos equipamentos;
- comparação das leituras com faixas definidas pelo próprio usuário;
- histórico local;
- exportação/importação em JSON;
- armazenamento no navegador via `localStorage`.

## Rodar localmente

Você pode abrir `index.html` diretamente no navegador.

Para evitar limitações de alguns navegadores com arquivos locais, também pode usar um servidor simples:

```bash
python -m http.server 8080
```

Depois abra `http://localhost:8080`.

## Publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie `index.html`, `styles.css` e `app.js` para a raiz.
3. Abra **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch**.
5. Selecione `main` e `/root`.
6. Salve e aguarde a publicação.

## Privacidade

Os registros ficam no `localStorage` do navegador. Eles não são enviados automaticamente para nenhum servidor.

## Observação de escopo

O projeto foi estruturado como um rastreador genérico de ambiente, equipamentos e observações. As faixas e fases são configuráveis pelo usuário.

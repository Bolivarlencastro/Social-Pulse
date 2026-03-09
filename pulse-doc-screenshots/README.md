# Pulse Screenshots

Capturas geradas a partir do app local em `http://127.0.0.1:4173/` no dia 2026-03-09.

## Cobertura

- Feed social em timeline e grid
- Lista de canais e detalhe de canal
- Aba de discussao do canal
- Fluxo de criacao de pulse
- Lightbox do pulse e estados do painel lateral
- Perfil de visualizacao `Admin` vs `Usuario`
- Edge cases aplicados isoladamente

## Sequencia

1. `01-feed-timeline-default.png`
   Feed principal em timeline, com cards completos, sidebar de filtros e cards de descoberta.
2. `02-feed-grid-default.png`
   Feed principal em grid, mostrando o estado compacto dos cards.
3. `03-channels-list-default.png`
   Listagem de canais com cards de capa, metadados e acao de inscricao.
4. `04-channel-detail-pulses.png`
   Detalhe de canal na aba `Pulses`, com hero do canal e grid interno de conteudos.
5. `05-channel-detail-discussion.png`
   Detalhe de canal na aba `Discussao`, incluindo composer e historico.
6. `06-create-modal-main-type.png`
   Primeiro passo do modal `Novo conteudo`, com selecao do tipo principal.
7. `07-create-modal-link-subtype.png`
   Segundo passo do modal para o tipo `Link`, com selecao de subtipo.
8. `08-create-modal-details-invalid-url.png`
   Passo de detalhes com validacao de URL invalida para YouTube.
9. `09-lightbox-default.png`
   Lightbox do pulse aberto com descricao, comentarios e acoes.
10. `10-lightbox-rating-menu.png`
    Lightbox com menu de avaliacao expandido.
11. `11-lightbox-collapsed-sidebar.png`
    Lightbox com painel lateral recolhido.
12. `12-user-mode-feed-grid.png`
    Feed em modo `Usuario`, com menu de edge cases aberto para evidenciar a troca de perfil.
13. `13-edge-empty-dataset.png`
    Edge case `Sem canais e pulses`, forçando empty states nas tres colunas.
14. `14-edge-missing-cover.png`
    Edge case `Sem imagem de capa`, validando fallback visual em feed e listas.
15. `15-edge-long-content.png`
    Edge case `Titulos e descricoes longas`, validando truncamento e quebra de layout.
16. `16-edge-large-volume.png`
    Edge case `Muitos canais e pulses` no feed, validando densidade e scroll.
17. `17-edge-large-volume-channels.png`
    Mesmo edge case na tela de canais, validando expansao da navegacao lateral e da lista principal.

## Observacoes

- Os screenshots refletem os estados implementados e acessiveis no prototipo atual do modulo social.
- O menu de edge cases aparece aberto em parte das capturas para documentar explicitamente qual cenario foi ativado.

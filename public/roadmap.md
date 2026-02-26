# Story Mapping - Pulses como Rede Social

## Pulses Social

### Feed
#### Consumo e descoberta no feed principal

##### V1.0 - Consumo (Aluno)
**Layout de Feed Social**
- [x] Feed em 3 colunas (esquerda, centro, direita)
- [x] Tabs no topo da coluna central
- [x] Tabs com Feed e Canais
- [x] View mode (lista/grid) na mesma barra das tabs
- [x] View mode desabilitado na aba Canais

**Cards laterais e descoberta**
- [x] Card Canais no lado esquerdo
- [x] Seção Criados por mim no card de canais
- [x] Canais do dono não duplicam em inscritos
- [x] Card Categorias no lado esquerdo
- [x] Card Pulses em Destaque no lado direito
- [x] Card Pulses Favoritos no lado direito
- [x] Ações Ver todos para aplicar filtros rápidos
- [x] Ação Remover filtro para voltar ao feed principal

**Comportamento do feed**
- [x] Filtro de pulses por canal (um por vez)
- [x] Sem tag visual de filtro por canal na coluna do feed
- [x] Empty state para canal/categoria sem pulses
- [x] Capa de pulse com play animado no feed
- [x] Imagens no feed em 1:1 por padrão
- [x] Suporte a imagens com aspect ratio variado (vertical/horizontal)
- [x] Vídeo e áudio podem tocar direto no feed
- [x] Exemplo de vídeos vertical e horizontal no feed

##### V1.1 - Gestão (Admin/Owner)
**CRUD e inativação**
- [x] Pulse: editar, excluir e inativar via menu de 3 pontos
- [x] Canal: editar, excluir e inativar via menu de 3 pontos
- [x] Fluxo de gestão acionado pelo card (pulses e canais)

### Pulse
#### Consumo completo em lightbox social

##### V1.0 - Consumo (Aluno)
**Lightbox de consumo**
- [x] Clique no pulse abre lightbox estilo rede social
- [x] Lightbox ocupa toda a área disponível
- [x] Bordas arredondadas e respiro superior/inferior (desktop)
- [x] Setas externas para navegar entre pulses no desktop
- [x] Header mobile com setas (esquerda) e fechar (direita)
- [x] Botão de colapsar painel de descrição/comentários no desktop
- [x] Botão de fechar fora da lightbox no desktop

**Estrutura de conteúdo**
- [x] Área de mídia maior que a área de descrição/comentários
- [x] Descrição resumida no feed e expandível no lightbox
- [x] Comentários com edição e exclusão pelo menu de 3 pontos
- [x] Barra de ações separada da área de comentar
- [x] Fechar menu de rating ao clicar fora

**Interações sociais**
- [x] Rating com estrelas de 1 a 5
- [x] Botão de rating abre menu horizontal de estrelas
- [x] Botão comentar com foco no input
- [x] Botão compartilhar copia link do pulse
- [x] Toast de confirmação no rodapé do app
- [x] Botão salvar com estado ativo/inativo (sem toast dentro do card)

### Conteúdo
#### Tipos de pulse e exibição

##### V1.0 - Consumo (Aluno)
**Tipos suportados no feed/lightbox**
- [x] Imagem
- [x] Vídeo (upload)
- [x] Vídeo embed (YouTube e Vimeo)
- [x] Podcast/áudio
- [x] PDF
- [x] Spreadsheet (Google Sheets iframe)
- [x] Texto (Google Docs iframe)
- [x] Presentation (Google Slides iframe)
- [x] Question (quiz Konquest)
- [x] H5P/Genially (iframe)

**Padrões visuais**
- [x] Empty state de capa para pulse sem imagem
- [x] Empty state de capa para canal sem imagem
- [x] Fallback para imagem quebrada sem ícone quebrado do navegador
- [x] Áudio com capa ao fundo e player centralizado (feed/lightbox)

### Mobile
#### Experiência mobile first

##### V1.0 - Consumo (Aluno)
**Navegação mobile**
- [x] Sem sidebar fixa no mobile
- [x] Sidebar abre por botão menu no header
- [x] Clique fora fecha o menu mobile
- [x] Header mobile sem botão de tela cheia
- [x] Perfil no header mobile exibido apenas com avatar

**Diretriz de produto**
- [x] Mobile focado em consumo
- [x] Sem fluxo de criação de pulse no mobile (documentado)

##### V1.1 - Ajustes pendentes
**Refinamentos**
- [ ] Revisar dialogs mobile de comentários/consumo em devices menores
- [ ] Ajustar microquebras de texto em cenários extremos
- [ ] Validar ergonomia final de touch targets em todos os breakpoints

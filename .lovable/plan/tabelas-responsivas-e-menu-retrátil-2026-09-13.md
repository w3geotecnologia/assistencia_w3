# Tabelas responsivas e menu retrátil

## Alterações
- Ajustar as tabelas de Clientes e Ordens de Serviço para manter leitura e ações acessíveis em telas menores.
- Recolher suavemente o menu lateral enquanto o ponteiro estiver sobre qualquer uma dessas tabelas, devolvendo toda a largura ao conteúdo.
- Restaurar o menu automaticamente quando o ponteiro sair da tabela.
- Conferir o resultado no tamanho atual da prévia e em uma tela menor.

## Detalhes técnicos
- Usar classes compartilhadas no contêiner principal, menu e áreas das tabelas para controlar a transição sem alterar dados ou regras do sistema.
- Manter colunas essenciais e habilitar rolagem horizontal controlada quando a largura não comportar a grade.
- Preservar os botões de visualizar, editar e excluir com dimensões estáveis.

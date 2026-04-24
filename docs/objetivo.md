### Objetivo do app

> Fazer um app para cadastrar categorias e produtos, onde cada categoria pode ter vários produtos, e cada produto pertence a uma categoria. O app deve permitir criar, ler, atualizar e excluir categorias e produtos, além de exibir a lista de categorias e produtos cadastrados. (usar setlist)

---

#### Regras:

- ira ser utilizado SQLite para o DB
- o app sera feito utilizando o framework react native
- o app sera feito utilizando o expo
- o app sera feito utilizando o typescript
- navegação será com props e stack navigator

##### tela home:

Tela de boas vindas, onde o usuario pode escolher entre acessar as categorias ou os produtos.
funcionará com navegação stack navigator, onde ao clicar em categorias ou produtos, o usuario sera redirecionado para a tela.

##### tela categorias:

Tela onde o usuario pode ver a lista de categorias cadastradas, criar uma nova categoria, editar ou excluir uma categoria existente (IRÁ VER COMO SETLIST). / no canto superior direito da tela, deve haver um botão para criar nova categoria, ao acessar ele ira preencher um campo de texto com o nome da categoria, e um botão para salvar a categoria.

##### tela produtos:

Tela onde o usuario pode ver a lista de produtos cadastrados, criar um novo produto, editar ou excluir um produto existente (IRÁ VER COMO SETLIST). Cada produto deve exibir o nome da categoria a qual pertence. / no canto superior direito da tela, deve haver um botão para criar, ao acessar ele ira preencher um campo de texto com o nome do produto, um campo de texto para o preço do produto, uma lista dropdown basica para selecionar a categoria do produto (deve existir no banco de dados), e um botão para salvar o produto.

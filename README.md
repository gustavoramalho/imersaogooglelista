# 📝 Minha Lista de Tarefas (Design Moderno & Dark Mode)

Aplicação de gerenciamento de tarefas com foco em experiência visual aconchegante, inspirada em layouts modernos de aplicativos móveis.

---

## 🎨 O que foi implementado a partir das referências:

1. **Dark Mode (Modo Escuro)** 🌙 / ☀️:
   - Alternância com um único clique no topo.
   - O tema escolhido fica gravado no `localStorage`, permanecendo ativo ao recarregar a página.
   - Paleta de cores cuidadosamente ajustada (tons cremes e quentes no modo claro; carvão profundo e suave aos olhos no modo escuro).

2. **Categorias com Emojis e Badges**:
   - 📝 **Geral**
   - 📚 **Estudos**
   - 💼 **Trabalho**
   - 🐾 **Pessoal**
   - Carrossel superior com contagem em tempo real de tarefas por categoria.

3. **Visual dos Cards e Checkbox**:
   - Cantos arredondados no estilo "mobile app" (`border-radius: 16px`).
   - Checkbox estilizado com cantos suaves.
   - Horário de registro da tarefa ("Hoje às 10:30").
   - Efeito de conclusão visualmente claro (fundo verde suave, borda lateral esmeralda e tag `✓ Feito`).

---

## 🚀 Como executar

Basta abrir o arquivo [index.html](file:///Users/gustavo/Projetos/imersaogooglelista/index.html) no seu navegador:

```bash
open index.html
```

---

## 🧠 Como o Dark Mode funciona por baixo dos panos?

Implementar o Dark Mode é um ótimo aprendizado sobre a relação entre **CSS** e **JavaScript**:

1. **Variáveis no CSS (`style.css`)**:
   Definimos as cores padrões dentro de `:root` (Modo Claro) e as mesmas variáveis com valores escuros sob o seletor `body.dark-mode`.
   
2. **Alternância no JavaScript (`script.js`)**:
   Quando o usuário clica no botão de tema, o JavaScript apenas adiciona ou remove a classe `dark-mode` do `<body>`:
   ```javascript
   document.body.classList.toggle("dark-mode");
   ```
   O navegador recalcula automaticamente as cores sem precisar reescrever nenhum elemento!
   
3. **Persistência**:
   Gravamos a preferência do usuário com `localStorage.setItem("app_theme", "dark")` para que ele não perca sua escolha ao reabrir a página.

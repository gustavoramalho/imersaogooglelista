/**
 * ====================================================================
 * APLICAÇÃO: LISTA DE TAREFAS (COM DESIGN MODERNO E DARK MODE)
 * ====================================================================
 * Este arquivo controla:
 * 1. Alternância e persistência do Modo Escuro (Dark Mode)
 * 2. Gestão do estado (tarefas, categorias, status)
 * 3. Criação, conclusão e exclusão de tarefas
 * 4. Filtros dinâmicos por categoria e por status
 * 5. Armazenamento no LocalStorage
 */

// --------------------------------------------------------------------
// 1. SELEÇÃO DE ELEMENTOS DO DOM
// --------------------------------------------------------------------
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const categorySelect = document.getElementById("task-category");
const taskList = document.getElementById("task-list");
const emptyState = document.getElementById("empty-state");
const taskCounter = document.getElementById("task-counter");
const themeToggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// Botões de filtros
const categoryPills = document.querySelectorAll(".category-pill");
const statusTabs = document.querySelectorAll(".status-tab");

// Badges de contagem das categorias
const badgeAll = document.getElementById("badge-all");
const badgeGeral = document.getElementById("badge-geral");
const badgeEstudos = document.getElementById("badge-estudos");
const badgeTrabalho = document.getElementById("badge-trabalho");
const badgePessoal = document.getElementById("badge-pessoal");

// --------------------------------------------------------------------
// 2. CONTROLE DO TEMA (DARK MODE)
// --------------------------------------------------------------------
/**
 * Inicializa e alterna o tema (Claro / Escuro) salvando no LocalStorage
 */
function initTheme() {
  const savedTheme = localStorage.getItem("app_theme") || "light";
  applyTheme(savedTheme);
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark-mode");
    themeIcon.textContent = "☀️"; // Ícone de sol para voltar ao claro
    localStorage.setItem("app_theme", "dark");
  } else {
    document.body.classList.remove("dark-mode");
    themeIcon.textContent = "🌙"; // Ícone de lua para ir para o escuro
    localStorage.setItem("app_theme", "light");
  }
}

themeToggleBtn.addEventListener("click", () => {
  const isDark = document.body.classList.contains("dark-mode");
  applyTheme(isDark ? "light" : "dark");
});

// --------------------------------------------------------------------
// 3. ESTADO DA APLICAÇÃO
// --------------------------------------------------------------------
// Recupera as tarefas salvas no LocalStorage ou inicia com a lista vazia
let tasks = JSON.parse(localStorage.getItem("tasks_data_v2")) || [];
let selectedCategory = "all";  // 'all', 'geral', 'estudos', 'trabalho', 'pessoal'
let selectedStatus = "all";    // 'all', 'pending', 'completed'

// --------------------------------------------------------------------
// 4. PERSISTÊNCIA (LocalStorage)
// --------------------------------------------------------------------
function saveTasks() {
  localStorage.setItem("tasks_data_v2", JSON.stringify(tasks));
}

// --------------------------------------------------------------------
// 5. OPERAÇÕES DE TAREFAS
// --------------------------------------------------------------------

/**
 * Adiciona uma nova tarefa
 */
function addTask(text, category) {
  const now = new Date();
  const timeFormatted = `Hoje às ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newTask = {
    id: Date.now(),
    text: text.trim(),
    category: category,
    completed: false,
    createdAt: timeFormatted
  };

  tasks.unshift(newTask);
  saveTasks();
  render();
}

/**
 * Alterna status concluído/pendente
 */
function toggleTask(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      return { ...t, completed: !t.completed };
    }
    return t;
  });

  saveTasks();
  render();
}

/**
 * Exclui uma tarefa
 */
function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

// --------------------------------------------------------------------
// 6. RENDERIZAÇÃO
// --------------------------------------------------------------------

// Mapeamento de nomes e emojis das categorias
const categoryMeta = {
  geral: { label: "Geral", icon: "📝" },
  estudos: { label: "Estudos", icon: "📚" },
  trabalho: { label: "Trabalho", icon: "💼" },
  pessoal: { label: "Pessoal", icon: "🐾" }
};

function render() {
  taskList.innerHTML = "";

  // 1. Atualizar contadores das categorias no topo
  updateCategoryBadges();

  // 2. Filtrar tarefas por categoria e por status
  const filteredTasks = tasks.filter(task => {
    const matchCategory = selectedCategory === "all" || task.category === selectedCategory;
    const matchStatus = 
      selectedStatus === "all" ? true :
      selectedStatus === "pending" ? !task.completed :
      task.completed;

    return matchCategory && matchStatus;
  });

  // 3. Exibir ou ocultar o estado vazio
  if (filteredTasks.length === 0) {
    emptyState.classList.add("show");
  } else {
    emptyState.classList.remove("show");
  }

  // 4. Desenhar os cards de cada tarefa
  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = `task-item ${task.completed ? "completed" : ""}`;

    const cat = categoryMeta[task.category] || categoryMeta.geral;

    li.innerHTML = `
      <div class="task-left" data-id="${task.id}">
        <input 
          type="checkbox" 
          class="task-checkbox" 
          ${task.completed ? "checked" : ""} 
          aria-label="Concluir tarefa"
        />
        <div class="task-details">
          <span class="task-text">${escapeHtml(task.text)}</span>
          <div class="task-meta">
            <span class="category-tag ${task.category}">
              <span>${cat.icon}</span> ${cat.label}
            </span>
            <span class="task-time">${task.createdAt}</span>
          </div>
        </div>
      </div>
      <div class="task-actions">
        ${task.completed ? '<span class="status-badge completed">✓ Feito</span>' : ''}
        <button class="delete-btn" data-id="${task.id}" title="Excluir tarefa">
          🗑️
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });

  // 5. Atualizar contador geral de pendentes
  const pendingCount = tasks.filter(t => !t.completed).length;
  taskCounter.textContent = `${pendingCount} pendente${pendingCount !== 1 ? "s" : ""}`;
}

/**
 * Atualiza os números nos botões de categoria do topo
 */
function updateCategoryBadges() {
  badgeAll.textContent = tasks.length;
  badgeGeral.textContent = tasks.filter(t => t.category === "geral").length;
  badgeEstudos.textContent = tasks.filter(t => t.category === "estudos").length;
  badgeTrabalho.textContent = tasks.filter(t => t.category === "trabalho").length;
  badgePessoal.textContent = tasks.filter(t => t.category === "pessoal").length;
}

/**
 * Prevenção de injeção de HTML
 */
function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

// --------------------------------------------------------------------
// 7. EVENTOS E INTERAÇÕES
// --------------------------------------------------------------------

// Adicionar tarefa no submit do form
taskForm.addEventListener("submit", event => {
  event.preventDefault();
  const text = taskInput.value.trim();
  const category = categorySelect.value;

  if (text !== "") {
    addTask(text, category);
    taskInput.value = "";
    taskInput.focus();
  }
});

// Ações na lista de tarefas (concluir / excluir)
taskList.addEventListener("click", event => {
  const deleteBtn = event.target.closest(".delete-btn");
  if (deleteBtn) {
    const taskId = Number(deleteBtn.dataset.id);
    deleteTask(taskId);
    return;
  }

  const taskLeft = event.target.closest(".task-left");
  if (taskLeft) {
    const taskId = Number(taskLeft.dataset.id);
    toggleTask(taskId);
  }
});

// Filtros por Categoria (Todas, Geral, Estudos, etc.)
categoryPills.forEach(pill => {
  pill.addEventListener("click", () => {
    categoryPills.forEach(p => p.classList.remove("active"));
    pill.classList.add("active");
    selectedCategory = pill.dataset.category;
    render();
  });
});

// Filtros por Status (Todas, Pendentes, Concluídas)
statusTabs.forEach(tab => {
  tab.addEventListener("click", () => {
    statusTabs.forEach(t => t.classList.remove("active"));
    tab.classList.add("active");
    selectedStatus = tab.dataset.filter;
    render();
  });
});

// --------------------------------------------------------------------
// 8. INICIALIZAÇÃO
// --------------------------------------------------------------------
initTheme();
render();

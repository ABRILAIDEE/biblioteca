const STORAGE_KEY = 'biblioteca-libros';

const form = document.getElementById('book-form');
const formTitle = document.getElementById('form-title');
const bookIdInput = document.getElementById('book-id');
const titleInput = document.getElementById('title');
const authorInput = document.getElementById('author');
const yearInput = document.getElementById('year');
const genreInput = document.getElementById('genre');
const tableBody = document.getElementById('books-table-body');
const emptyMessage = document.getElementById('empty-message');
const cancelButton = document.getElementById('cancel-btn');

function loadBooks() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    return [];
  }

  try {
    const books = JSON.parse(data);
    return Array.isArray(books) ? books : [];
  } catch {
    return [];
  }
}

function saveBooks(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function resetForm() {
  form.reset();
  bookIdInput.value = '';
  formTitle.textContent = 'Registrar libro';
  cancelButton.classList.add('hidden');
}

function populateForm(book) {
  bookIdInput.value = book.id;
  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year;
  genreInput.value = book.genre;
  formTitle.textContent = 'Editar libro';
  cancelButton.classList.remove('hidden');
}

function createBookRow(book) {
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${book.title}</td>
    <td>${book.author}</td>
    <td>${book.year}</td>
    <td>${book.genre}</td>
    <td>
      <div class="inline-actions">
        <button data-action="edit" data-id="${book.id}" type="button">Editar</button>
        <button data-action="delete" data-id="${book.id}" type="button" class="secondary">Eliminar</button>
      </div>
    </td>
  `;

  return row;
}

function renderBooks() {
  const books = loadBooks();
  tableBody.innerHTML = '';

  books.forEach((book) => {
    tableBody.appendChild(createBookRow(book));
  });

  emptyMessage.classList.toggle('hidden', books.length > 0);
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const books = loadBooks();
  const currentId = bookIdInput.value;

  const bookData = {
    id: currentId || crypto.randomUUID(),
    title: titleInput.value.trim(),
    author: authorInput.value.trim(),
    year: yearInput.value.trim(),
    genre: genreInput.value.trim()
  };

  if (currentId) {
    const index = books.findIndex((book) => book.id === currentId);
    if (index !== -1) {
      books[index] = bookData;
    }
  } else {
    books.push(bookData);
  }

  saveBooks(books);
  resetForm();
  renderBooks();
});

cancelButton.addEventListener('click', resetForm);

tableBody.addEventListener('click', (event) => {
  const target = event.target;
  if (!(target instanceof HTMLButtonElement)) {
    return;
  }

  const { action, id } = target.dataset;
  const books = loadBooks();

  if (action === 'delete') {
    const nextBooks = books.filter((book) => book.id !== id);
    saveBooks(nextBooks);
    if (bookIdInput.value === id) {
      resetForm();
    }
    renderBooks();
    return;
  }

  if (action === 'edit') {
    const selected = books.find((book) => book.id === id);
    if (selected) {
      populateForm(selected);
      titleInput.focus();
    }
  }
});

renderBooks();

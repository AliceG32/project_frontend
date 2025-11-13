const favoriteToastEl = document.getElementById('favoriteToast');
const favoriteToastBody = document.getElementById('favoriteToastBody');
const deleteConfirmModalEl = document.getElementById('deleteConfirmModal');

function showFavoriteToast(movieTitle, message = null) {
    if (favoriteToastEl && favoriteToastBody) {
        const text = message || `Фильм: ${movieTitle} добавлен в избранное.`;
        favoriteToastBody.textContent = text;

        const toast = new bootstrap.Toast(favoriteToastEl, {
            delay: 3000
        });
        toast.show();

        console.log(`Toast показан: ${text}`);
    }
}

document.querySelectorAll('.js-favorite-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        if (row) {
            const titleCell = row.querySelector('td:nth-child(2)');
            if (titleCell) {
                const movieTitle = titleCell.textContent.trim();

                showFavoriteToast(movieTitle);
            }
        }
    });
});

document.querySelectorAll('.js-info-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        if (row) {
            const cells = row.querySelectorAll('th, td');

            document.getElementById('modal-id').textContent = cells[0].textContent.trim();
            document.getElementById('modal-title').textContent = cells[1].textContent.trim();
            document.getElementById('modal-year').textContent = cells[2].textContent.trim();
            document.getElementById('modal-genre').textContent = cells[3].textContent.trim();

            const rating = button.getAttribute('data-rating');
            document.getElementById('modal-rating').textContent = rating;
        }
    });
});

document.querySelectorAll('.js-edit-btn').forEach(button => {
    button.addEventListener('click', (event) => {
        const row = event.target.closest('tr');
        if (row) {
            const cells = row.querySelectorAll('th, td');

            document.getElementById('edit-movie-id').value = cells[0].textContent.trim();
            document.getElementById('edit-movie-title').value = cells[1].textContent.trim();
            document.getElementById('edit-movie-year').value = cells[2].textContent.trim();
            document.getElementById('edit-movie-genre').value = cells[3].textContent.trim();
        }
    });
});

document.getElementById('save-movie-changes')?.addEventListener('click', () => {

    const id = document.getElementById('edit-movie-id').value;
    const title = document.getElementById('edit-movie-title').value;
    console.log(`Changes saved for Movie ID: ${id}, Title: ${title}`);

    const editModal = bootstrap.Modal.getInstance(document.getElementById('editMovieModal'));
    editModal.hide();

    let targetRow = null;
    document.querySelectorAll('table tbody tr').forEach(row => {
        if (row.querySelector('th')?.textContent.trim() === id) {
            targetRow = row;
        }
    });
    if (targetRow) {
        const cells = targetRow.querySelectorAll('th, td');
        cells[1].textContent = document.getElementById('edit-movie-title').value;
        cells[2].textContent = document.getElementById('edit-movie-year').value;
        cells[3].textContent = document.getElementById('edit-movie-genre').value;
    }

    showFavoriteToast(title, `Изменения для фильма "${title}" сохранены!`);
});

if (deleteConfirmModalEl) {
    deleteConfirmModalEl.addEventListener('show.bs.modal', function (event) {
        const button = event.relatedTarget;
        const row = button.closest('tr');

        if (row) {
            const cells = row.querySelectorAll('th, td');
            const movieId = cells[0].textContent.trim();
            const movieTitle = cells[1].textContent.trim();

            document.getElementById('movie-id-to-delete').value = movieId;
            document.getElementById('movie-title-to-delete').textContent = movieTitle;
        }
    });
}

document.getElementById('confirm-delete-movie')?.addEventListener('click', () => {
    const movieIdToDelete = document.getElementById('movie-id-to-delete').value;
    const movieTitle = document.getElementById('movie-title-to-delete').textContent;

    console.log(`Deletion confirmed for Movie ID: ${movieIdToDelete}, Title: ${movieTitle}`);

    let targetRow = null;
    document.querySelectorAll('table tbody tr').forEach(row => {
        if (row.querySelector('th')?.textContent.trim() === movieIdToDelete) {
            targetRow = row;
        }
    });

    if (targetRow) {
        targetRow.remove();
        showFavoriteToast(movieTitle, `Фильм "${movieTitle}" удален.`);
    }

    const deleteModal = bootstrap.Modal.getInstance(deleteConfirmModalEl);
    deleteModal.hide();
});

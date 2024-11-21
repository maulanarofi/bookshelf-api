const { nanoid } = require('nanoid');
const books = require('./books');

const addBookHandler = (request, h) => {
    const { name, year, author, summary, publisher, pageCount, readPage, reading} = request.payload;

    if (!name) {
        const resp = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        });
        resp.code(400);
        return resp;
    }
    
    if(readPage > pageCount){
        const resp = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        });
        resp.code(400);
        return resp;
    }

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        finished,
        insertedAt,
        updatedAt
    };

    books.push(newBook);

    const isSuccess = books.some((book) => book.id === id);

    if (isSuccess) {
        const resp = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        resp.code(201);
        return resp;
    };
};

const getAllBookHandler = (request, h) => {
    const { name, reading, finished } = request.query;
    let filteredBooks = books;

      if (name) {
        const nameLower = name.toLowerCase();
        filteredBooks = filteredBooks.filter((book) => book.name.toLowerCase().includes(nameLower));
      };
      if (reading === '0' || reading === '1') {
        const isReading = reading === '1';
        filteredBooks = filteredBooks.filter((book) => book.reading === isReading);
      };
      if (finished === '0' || finished === '1') {
        const isFinished = finished === '1';
        filteredBooks = filteredBooks.filter((book) => book.finished === isFinished);
      };

    const bookList = filteredBooks.map(book => ({
        id: book.id,
        name: book.name,
        publisher: book.publisher
    }));
    const resp = h.response({
        status: 'success',
        data: {
            books: bookList
        }
    });
    resp.code(200);
    return resp;
};

const getBookHandlerById = (request, h) => {
    const { bookId } = request.params;

    const book = books.find((book) => book.id === bookId);

    if (!book) {
        const resp = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan'
        });
        resp.code(404);
        return resp;
    }
    const resp = h.response({
        status: 'success',
        data: {
            book: book
        }
    });
    resp.code(200);
    return resp;
};

const editBookHandlerById = (request, h) => {
    const { bookId } = request.params;
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const updatedAt = new Date().toISOString();
    const index = books.findIndex((book) => book.id === bookId);

    if (!name) {
        const resp = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        });
        resp.code(400);
        return resp;
    }

    if (readPage > pageCount) {
        const resp = h.response({
            status:'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        });
        resp.code(400);
        return resp;
    }
    
    if (index !== -1){
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
            updatedAt,
            finished: pageCount === readPage,
        };
        const resp = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        });
        resp.code(200);
        return resp;
    };

    const resp = h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    });
    resp.code(404);
    return resp;
};

const deleteBookHandlerById = (request, h) => {
    const { id } = request.params;
    const index = books.findIndex((book) => book.bookId === id);

    if (index !== -1) {
        books.splice(index, 1);

        const resp = h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        resp.code(200);
        return resp;
    };

    const resp = h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    });
    resp.code(404);
    return resp;

}

module.exports = {
    addBookHandler,
    getAllBookHandler,
    getBookHandlerById,
    editBookHandlerById,
    deleteBookHandlerById
};
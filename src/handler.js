const { nanoid } = require("nanoid");
const notes = require("./notes");

const addNoteHandler = (request, h) => {
    const { title, tags, body } = request.payload;
    const id = nanoid(16);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newNote = {
        title, tags, body, id, createdAt, updatedAt
    };

    notes.push(newNote);

    const isSuccess = notes.filter((note) => note.id === id).length > 0;

    if (isSuccess) {
        // FIX: Perbaiki logika respons agar status code 201 bisa diatur
        const response = h.response({
            status: 'success', // FIX: Hapus tanda seru
            message: 'catatan berhasil ditambahkan!',
            data: {
                noteId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'catatan gagal ditambahkan!',
    });
    response.code(500);
    return response;
};

const getAllNotesHandler = () => ({
    status: 'success',
    data: {
        // FIX: Petakan (map) array untuk memastikan 'id' selalu ada di respons
        notes: notes.map((note) => ({
            id: note.id,
            title: note.title,
            body: note.body,
        })),
    },
});

const getNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    // IMPROVEMENT: Gunakan .find() agar lebih efisien daripada .filter()[0]
    const note = notes.find((n) => n.id === id);

    if (note !== undefined) {
        return {
            status: 'success',
            data: {
                note,
            },
        };
    };

    const response = h.response({
        status: 'fail',
        message: 'catatan tidak ditemukan', // Menghapus '!' agar konsisten
    });
    response.code(404);
    return response;
};

const editNoteByIdHandler = (request, h) => {
    const { id } = request.params;
    const { title, tags, body } = request.payload;
    const updatedAt = new Date().toISOString();

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes[index] = {
            ...notes[index],
            title, tags, body, updatedAt,
        };
        const response = h.response({
            status: 'success',
            message: 'catatan berhasil diperbarui!',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'gagal memperbarui catatan. Id tidak ditemukan!',
    });
    response.code(404);
    return response;
}

const deleteNoteByIdHandler = (request, h) => {
    const { id } = request.params;

    const index = notes.findIndex((note) => note.id === id);

    if (index !== -1) {
        notes.splice(index, 1);
        const response = h.response({
            status: 'success',
            message: 'catatan berhasil dihapus!',
        });
        response.code(200);
        return response;
    }

    const response = h.response({
        status: 'fail',
        message: 'catatan gagal dihapus. Id tidak ditemukan!',
    });
    response.code(404);
    return response;
}

module.exports = {
    addNoteHandler,
    getAllNotesHandler,
    getNoteByIdHandler,
    editNoteByIdHandler,
    deleteNoteByIdHandler,
};
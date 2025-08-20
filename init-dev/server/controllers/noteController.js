const Note = require('../models/Note');

// @desc    Adicionar uma nova anotação
// @route   POST /api/notes
// @access  Private
const addNote = async (req, res) => {
  if (!req.body.title || !req.body.content) {
    res.status(400).json({ message: 'Please add all fields' });
  }

  const note = await Note.create({
    user: req.user.id,
    title: req.body.title,
    content: req.body.content,
  });

  res.status(200).json(note);
};

// @desc    Obter anotações do usuário
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  const notes = await Note.find({ user: req.user.id });

  res.status(200).json(notes);
};

// @desc    Atualizar uma anotação
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
  }

  const updatedNote = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  res.status(200).json(updatedNote);
};

// @desc    Deletar uma anotação
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  const note = await Note.findById(req.params.id);

  if (!note) {
    res.status(404).json({ message: 'Note not found' });
  }

  if (note.user.toString() !== req.user.id) {
    res.status(401).json({ message: 'User not authorized' });
  }

  await note.remove();

  res.status(200).json({ id: req.params.id });
};

module.exports = { getNotes, addNote, updateNote, deleteNote };